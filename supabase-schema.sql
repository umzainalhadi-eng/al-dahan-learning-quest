create table if not exists public.classroom_teachers (
    user_id uuid primary key references auth.users (id) on delete cascade,
    created_at timestamptz not null default now()
);

create table if not exists public.classroom_threads (
    id uuid primary key default gen_random_uuid(),
    student_id uuid not null references auth.users (id) on delete cascade,
    student_name text not null check (char_length(student_name) between 1 and 80),
    class_name text not null default '',
    kind text not null check (kind in ('submission', 'question', 'chat')),
    title text not null check (char_length(title) between 1 and 160),
    created_at timestamptz not null default now()
);

create table if not exists public.classroom_messages (
    id uuid primary key default gen_random_uuid(),
    thread_id uuid not null references public.classroom_threads (id) on delete cascade,
    sender_id uuid not null references auth.users (id) on delete cascade,
    sender_role text not null check (sender_role in ('student', 'teacher')),
    body text not null check (char_length(body) between 1 and 5000),
    answers jsonb not null default '[]'::jsonb,
    score jsonb,
    created_at timestamptz not null default now()
);

create table if not exists public.classroom_reactions (
    message_id uuid primary key references public.classroom_messages (id) on delete cascade,
    teacher_id uuid not null references auth.users (id) on delete cascade,
    reaction text not null check (reaction in ('❤️', '👏', '⭐', '💡')),
    updated_at timestamptz not null default now()
);

create index if not exists classroom_threads_student_created_idx
    on public.classroom_threads (student_id, created_at desc);
create index if not exists classroom_messages_thread_created_idx
    on public.classroom_messages (thread_id, created_at);

alter table public.classroom_teachers enable row level security;
alter table public.classroom_threads enable row level security;
alter table public.classroom_messages enable row level security;
alter table public.classroom_reactions enable row level security;

create or replace function public.is_classroom_teacher()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
    select exists (
        select 1
        from public.classroom_teachers
        where user_id = (select auth.uid())
    );
$$;

revoke all on function public.is_classroom_teacher() from public;
grant execute on function public.is_classroom_teacher() to authenticated;

drop policy if exists "students and teachers read permitted threads" on public.classroom_threads;
drop policy if exists "students create their own threads" on public.classroom_threads;
drop policy if exists "teachers read messages" on public.classroom_messages;
drop policy if exists "thread participants send messages" on public.classroom_messages;
drop policy if exists "students and teachers read permitted reactions" on public.classroom_reactions;
drop policy if exists "teachers manage reactions" on public.classroom_reactions;

create policy "students and teachers read permitted threads"
    on public.classroom_threads for select to authenticated
    using ((select auth.uid()) = student_id or (select public.is_classroom_teacher()));

create policy "students create their own threads"
    on public.classroom_threads for insert to authenticated
    with check (
        (select auth.uid()) = student_id
        and not (select public.is_classroom_teacher())
    );

create policy "teachers read messages"
    on public.classroom_messages for select to authenticated
    using (
        (select public.is_classroom_teacher())
        or exists (
            select 1
            from public.classroom_threads
            where classroom_threads.id = classroom_messages.thread_id
              and classroom_threads.student_id = (select auth.uid())
        )
    );

create policy "thread participants send messages"
    on public.classroom_messages for insert to authenticated
    with check (
        sender_id = (select auth.uid())
        and (
            (
                sender_role = 'student'
                and not (select public.is_classroom_teacher())
                and exists (
                    select 1
                    from public.classroom_threads
                    where classroom_threads.id = classroom_messages.thread_id
                      and classroom_threads.student_id = (select auth.uid())
                )
            )
            or (
                sender_role = 'teacher'
                and (select public.is_classroom_teacher())
                and exists (
                    select 1
                    from public.classroom_threads
                    where classroom_threads.id = classroom_messages.thread_id
                )
            )
        )
    );

create policy "students and teachers read permitted reactions"
    on public.classroom_reactions for select to authenticated
    using (
        (select public.is_classroom_teacher())
        or exists (
            select 1
            from public.classroom_messages
            join public.classroom_threads
              on classroom_threads.id = classroom_messages.thread_id
            where classroom_messages.id = classroom_reactions.message_id
              and classroom_threads.student_id = (select auth.uid())
        )
    );

create policy "teachers manage reactions"
    on public.classroom_reactions for all to authenticated
    using (
        (select public.is_classroom_teacher())
        and teacher_id = (select auth.uid())
    )
    with check (
        (select public.is_classroom_teacher())
        and teacher_id = (select auth.uid())
    );

create or replace function public.create_classroom_thread(
    p_student_name text,
    p_class_name text,
    p_kind text,
    p_title text,
    p_body text,
    p_answers jsonb default '[]'::jsonb,
    p_score jsonb default null
)
returns uuid
language plpgsql
security invoker
set search_path = ''
as $$
declare
    new_thread_id uuid;
begin
    insert into public.classroom_threads (
        student_id, student_name, class_name, kind, title
    ) values (
        (select auth.uid()),
        left(trim(p_student_name), 80),
        left(trim(coalesce(p_class_name, '')), 120),
        p_kind,
        left(trim(p_title), 160)
    )
    returning id into new_thread_id;

    insert into public.classroom_messages (
        thread_id, sender_id, sender_role, body, answers, score
    ) values (
        new_thread_id,
        (select auth.uid()),
        'student',
        left(trim(p_body), 5000),
        coalesce(p_answers, '[]'::jsonb),
        p_score
    );

    return new_thread_id;
end;
$$;

revoke all on function public.create_classroom_thread(
    text, text, text, text, text, jsonb, jsonb
) from public, anon;
grant execute on function public.create_classroom_thread(
    text, text, text, text, text, jsonb, jsonb
) to authenticated;

revoke all on public.classroom_teachers from anon, authenticated;
grant select on public.classroom_threads to authenticated;
grant insert on public.classroom_threads to authenticated;
grant select, insert on public.classroom_messages to authenticated;
grant select, insert, update, delete on public.classroom_reactions to authenticated;

-- Create teacher accounts in Supabase Auth first, then run this as the project owner:
-- insert into public.classroom_teachers (user_id)
-- select id from auth.users where email = 'teacher@example.com'
-- on conflict (user_id) do nothing;
