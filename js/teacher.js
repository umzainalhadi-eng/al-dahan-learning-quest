// Weekly Activities & School Administration (أ. مؤمن المشرف العام & أ. علي دحان)
class TeacherManager {
    constructor() {
        this.currentQuizAnswers = {};
    }

    init() {
        this.renderWeeklyActivity();
        this.renderWeeklyLeaderboard();
        const dashboard = document.getElementById('teacher-dashboard-content');
        if (!dashboard || !dashboard.classList.contains('hidden')) {
            this.setupTeacherPanel();
            this.setupMoamenPanel();
        }
    }

    renderWeeklyActivity() {
        const activity = window.appStorage.getActiveWeeklyActivity();
        const container = document.getElementById('weekly-activity-container');
        if (!container || !activity) return;

        const allActivities = window.appStorage.getWeeklyActivities();
        const activeIdx = window.appStorage.getActiveWeeklyIndex();

        container.innerHTML = `
            <div class="weekly-banner-card" style="border: 2px solid #10b981;">
                <div class="weekly-header-flex">
                    <div class="weekly-title-wrap">
                        <div class="flex items-center gap-2 mb-2 flex-wrap">
                            <span class="weekly-badge" style="background: #10b981;">🌟 نشاط الأسبوع #${activity.weekNumber} (من أصل 12 نشاطاً)</span>
                            <span class="meta-tag">📚 ${activity.subject}</span>
                            <span class="meta-tag">🎁 جائزة الإنجاز: +${activity.rewardPoints} نقطة</span>
                            <span class="meta-tag">🎖️ ${activity.badgeReward}</span>
                        </div>
                        <h2 class="weekly-title" style="color: #065f46;">${activity.title}</h2>
                        <p class="text-muted">${activity.description}</p>
                    </div>
                </div>

                <div class="teacher-tip-bubble" style="margin: 1.5rem 0; background: #ecfdf5; border-right: 4px solid #10b981;">
                    <img src="images/teacher_ali_dahan.png" style="width: 55px; height: 55px; border-radius: 50%; object-fit: cover; border: 2px solid #10b981;">
                    <div class="teacher-tip-text">
                        <strong>إرشاد المعلم أ. علي دحان:</strong>
                        <p style="margin: 0;">${activity.tips}</p>
                    </div>
                </div>

                <!-- Interactive Multi-format Questions (MCQ + True/False) -->
                <div class="activity-quiz-section mt-4" style="background: var(--surface-elevated); padding: 1.75rem; border-radius: var(--radius-md); border: 1px solid var(--border);">
                    <h3 class="font-bold text-xl mb-4 text-primary">📝 أسئلة وتحديات النشاط التفاعلية:</h3>
                    
                    <form id="form-weekly-interactive">
                        ${activity.questions.map((q, qIdx) => `
                            <div class="mb-5 p-4 rounded-lg bg-surface border border-[var(--border)]" style="background: var(--surface);">
                                <div class="flex items-center gap-2 mb-3">
                                    <span class="badge" style="background: #e0e7ff; color: #4338ca; padding: 0.2rem 0.6rem; border-radius: 99px; font-size: 0.8rem; font-weight: 800;">
                                        ${q.type === 'tf' ? 'صح أم خطأ' : 'اختيار من متعدد'}
                                    </span>
                                    <h4 class="font-bold text-lg">${qIdx + 1}. ${q.question}</h4>
                                </div>
                                <div class="grid gap-2" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.75rem;">
                                    ${q.options.map((opt, oIdx) => `
                                        <label class="weekly-option-label" style="display: flex; align-items: center; gap: 0.6rem; padding: 0.75rem 1rem; border: 2px solid var(--border); border-radius: 10px; cursor: pointer; transition: all 0.2s;">
                                            <input type="radio" name="q_${qIdx}" value="${oIdx}" required style="accent-color: #10b981;">
                                            <span class="font-bold">${opt}</span>
                                        </label>
                                    `).join('')}
                                </div>
                            </div>
                        `).join('')}

                        <!-- Creative / Writing Task -->
                        <div class="mb-5 p-4 rounded-lg bg-surface border border-[var(--border)]" style="background: var(--surface);">
                            <div class="flex items-center gap-2 mb-2">
                                <span class="badge" style="background: #fef3c7; color: #b45309; padding: 0.2rem 0.6rem; border-radius: 99px; font-size: 0.8rem; font-weight: 800;">
                                    تحدي البيان والإبداع
                                </span>
                                <h4 class="font-bold text-lg">💡 ${activity.creativeTask}</h4>
                            </div>
                            <textarea id="weekly-creative-answer" class="form-control" rows="3" placeholder="اكتب إجابتك وفكرتك الإبداعية هنا ليقرأها المعلم أ. علي دحان..." required></textarea>
                        </div>

                        <div class="flex justify-between items-center flex-wrap gap-3 mt-4">
                            <button type="submit" class="btn btn-primary btn-lg" style="background: linear-gradient(135deg, #059669, #10b981);">
                                🚀 إرسال إجابات النشاط للأستاذ علي دحان
                            </button>
                            <span class="text-sm text-muted">حساب الطالب الحالي: <strong>${window.appStorage.getCurrentUser().name}</strong></span>
                        </div>
                    </form>
                </div>
            </div>
        `;

        this.bindWeeklyQuizSubmission(activity);
    }

    bindWeeklyQuizSubmission(activity) {
        const form = document.getElementById('form-weekly-interactive');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (form.dataset.submitting === 'true') return;
            form.dataset.submitting = 'true';
            const submitButton = form.querySelector('button[type="submit"]');
            if (submitButton) submitButton.disabled = true;
            let correctCount = 0;
            const totalQuestions = activity.questions.length;

            activity.questions.forEach((q, qIdx) => {
                const selected = form.querySelector(`input[name="q_${qIdx}"]:checked`);
                if (selected && parseInt(selected.value) === q.correct) {
                    correctCount++;
                }
            });

            const creativeAnswer = document.getElementById('weekly-creative-answer')?.value.trim() || '';
            const scorePerQ = Math.round(100 / totalQuestions);
            const quizScore = correctCount * scorePerQ;
            const bonusCreative = creativeAnswer.length > 10 ? 50 : 20;
            const answers = activity.questions.map((question, index) => {
                const selected = form.querySelector(`input[name="q_${index}"]:checked`);
                const selectedIndex = selected ? Number.parseInt(selected.value, 10) : -1;
                return {
                    question: question.question,
                    answer: selectedIndex >= 0 ? question.options[selectedIndex] : '',
                    correctAnswer: question.options[question.correct],
                    isCorrect: selectedIndex === question.correct
                };
            });

            const entry = window.appStorage.submitWeeklyInteractive({
                score: quizScore,
                bonus: bonusCreative,
                creativeAnswer
            });

            let teacherDelivery = 'لم يُرسل التقرير إلى المعلم. أكمِل إعداد Supabase في js/supabase-config.js.';
            if (window.classroomService?.isConfigured()) {
                try {
                    await window.classroomService.submitStudentWork({
                        kind: 'submission',
                        title: `نشاط: ${activity.title}`,
                        body: `الإجابة الإبداعية: ${creativeAnswer}`,
                        answers,
                        score: { correct: correctCount, total: totalQuestions, points: quizScore, bonus: bonusCreative }
                    });
                    teacherDelivery = 'تم إرسال إجاباتك للنشاط إلى المعلم.';
                    await window.classroomService.renderStudentThreads();
                } catch (error) {
                    console.error('تعذر إرسال إجابات النشاط إلى المعلم.', error);
                    teacherDelivery = `تعذر إرسال الإجابات للمعلم: ${error.message}`;
                }
            }

            if (window.soundEngine) window.soundEngine.applause();
            if (window.confettiManager) window.confettiManager.burst(window.innerWidth / 2, window.innerHeight / 2, 100);

            alert(`🎉 أحسنت صنعاً يا ${entry.studentName}!\n` +
                  `أجبت عن ${correctCount} من أصل ${totalQuestions} أسئلة بشكل صحيح!\n` +
                  `نقاط الأسئلة: ${quizScore} نقطة\n` +
                  `نقاط التحدي الإبداعي: +${bonusCreative} نقطة\n` +
                  `المجموع: +${entry.total} نقطة ذهبية!\n` +
                  `تم تسجيلك في لوحة صدارة النشاط الأسبوعي بالمركز #${entry.rank}!\n\n${teacherDelivery}`);

            this.renderWeeklyLeaderboard();
            if (window.app) window.app.updateHeaderStats();
            form.dataset.submitting = 'false';
            if (submitButton) submitButton.disabled = false;
        });
    }

    renderWeeklyLeaderboard() {
        const container = document.getElementById('weekly-leaderboard-container');
        if (!container) return;

        const board = window.appStorage.getWeeklyLeaderboard();
        const activity = window.appStorage.getActiveWeeklyActivity();

        container.innerHTML = `
            <div class="weekly-banner-card mt-6" style="border: 2px solid #fbbf24;">
                <div class="flex justify-between items-center mb-4 flex-wrap gap-2">
                    <div>
                        <h3 class="font-extrabold text-2xl text-accent flex items-center gap-2">
                            <span>🏆</span>
                            <span>لوحة صدارة النشاط الأسبوعي (#${activity.weekNumber}: ${activity.title})</span>
                        </h3>
                        <p class="text-muted text-sm">ترتيب الطلاب المشاركين في نشاط هذا الأسبوع ونقاطهم الفورية</p>
                    </div>
                    <span class="meta-tag" style="background: #fef3c7; color: #b45309; font-weight: 800;">
                        ${board.length} أبطال مسجلين
                    </span>
                </div>

                <div class="leaderboard-table-card">
                    <table class="leaderboard-table">
                        <thead>
                            <tr>
                                <th style="width: 70px;">المركز</th>
                                <th>اسم البطل</th>
                                <th class="text-center">الصف</th>
                                <th class="text-center">درجة النشاط</th>
                                <th class="text-center">درجة الإبداع</th>
                                <th class="text-end">المجموع الأسبوعي</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${board.map((item, idx) => `
                                <tr class="${item.studentName === window.appStorage.getCurrentUser().name ? 'current-user-row' : ''}">
                                    <td>
                                        <span class="rank-number rank-${idx + 1}">${idx + 1}</span>
                                    </td>
                                    <td>
                                        <div class="student-info-flex">
                                            <span class="table-avatar">${item.avatar || '🌟'}</span>
                                            <div>
                                                <strong>${item.studentName}</strong>
                                                ${item.studentName === window.appStorage.getCurrentUser().name ? '<span class="badge-me">(أنت)</span>' : ''}
                                                <div class="text-xs text-muted">💬 ${item.teacherFeedback}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="text-center font-bold text-sm text-muted">${item.className || 'الصف الخامس'}</td>
                                    <td class="text-center font-bold text-primary">${item.score} / 100</td>
                                    <td class="text-center font-bold text-accent">+${item.bonus}</td>
                                    <td class="text-end font-extrabold text-lg" style="color: #059669;">${item.total} نقطة</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    // Teacher Panel (أ. علي دحان) & General Supervisor Panel (أ. مؤمن)
    setupTeacherPanel() {
        // Teacher selects 1 active activity out of the 12
        const actSelect = document.getElementById('select-active-weekly-activity');
        if (actSelect) {
            const all = window.appStorage.getWeeklyActivities();
            const activeIdx = window.appStorage.getActiveWeeklyIndex();
            actSelect.innerHTML = all.map((act, idx) => `
                <option value="${idx}" ${idx === activeIdx ? 'selected' : ''}>
                    نشاط الأسبوع ${act.weekNumber}: ${act.title} (${act.subject})
                </option>
            `).join('');

            actSelect.addEventListener('change', () => {
                const newIdx = parseInt(actSelect.value);
                window.appStorage.setActiveWeeklyActivity(newIdx);
                alert(`✅ تم اعتماد (نشاط الأسبوع ${all[newIdx].weekNumber}: ${all[newIdx].title}) كنشاط نشط لهذا الأسبوع!`);
                this.renderWeeklyActivity();
                this.renderWeeklyLeaderboard();
            });
        }

        // Form: Teacher adds new student (المعلم من يضيف الطلاب ولكل طالب حساب)
        const addStudentForm = document.getElementById('form-teacher-add-student');
        if (addStudentForm) {
            addStudentForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const name = document.getElementById('new-std-name').value.trim();
                const avatar = document.getElementById('new-std-avatar').value.trim() || '🦁';
                const classId = document.getElementById('new-std-class').value;
                const cls = window.appStorage.getClasses().find(c => c.id === classId);

                const newStd = window.appStorage.addStudent({
                    name,
                    avatar,
                    classId,
                    className: cls ? cls.name : 'الصف الخامس (أ)'
                });

                alert(`🎉 تم إضافة الطالب/ـة (${newStd.name}) بنجاح وتم إنشاء حساب مستقل له في ${newStd.className}!`);
                addStudentForm.reset();
                this.renderStudentsList();
            });
        }
    }

    setupMoamenPanel() {
        // General Supervisor (أ. مؤمن) assigns teacher to specific class
        const assignForm = document.getElementById('form-moamen-assign-teacher');
        if (assignForm) {
            assignForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const teacherId = document.getElementById('assign-teacher-select').value;
                const classId = document.getElementById('assign-class-select').value;

                const res = window.appStorage.assignTeacherToClass(teacherId, classId);
                if (res) {
                    alert(`✅ تم تعيين المعلم (${res.teacher.name}) رسمياً على (${res.cls.name}) بواسطة المشرف العام أ. مؤمن!`);
                    this.renderClassesTable();
                }
            });
        }
    }

    renderStudentsList() {
        const container = document.getElementById('teacher-students-list');
        if (!container) return;
        const students = window.appStorage.getStudents();
        container.innerHTML = students.map(s => `
            <div class="p-3 border rounded-lg flex justify-between items-center" style="background: var(--surface);">
                <div class="flex items-center gap-3">
                    <span style="font-size: 1.8rem;">${s.avatar || '🎓'}</span>
                    <div>
                        <strong>${s.name}</strong>
                        <div class="text-xs text-muted">${s.className} | اسم المستخدم: ${s.username}</div>
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    <span class="points-text font-bold">${s.points || 0} نقطة</span>
                    <button class="btn btn-outline btn-sm" onclick="window.teacherManager.loginAsStudent('${s.id}')">
                        دخول بحسابه
                    </button>
                </div>
            </div>
        `).join('');
    }

    loginAsStudent(studentId) {
        const u = window.appStorage.setCurrentUser(studentId);
        alert(`تم التبديل الآن إلى حساب الطالب: ${u.name} (${u.className})`);
        if (window.app) window.app.updateHeaderStats();
        location.reload();
    }

    renderClassesTable() {
        const container = document.getElementById('moamen-classes-list');
        if (!container) return;
        const classes = window.appStorage.getClasses();
        container.innerHTML = classes.map(c => `
            <div class="p-3 border rounded-lg flex justify-between items-center" style="background: var(--surface);">
                <div>
                    <strong>${c.name}</strong>
                    <div class="text-xs text-muted">المعلم المعين: <span class="text-primary font-bold">${c.teacherName}</span></div>
                </div>
                <span class="badge" style="background: #e0e7ff; color: #4338ca; padding: 0.3rem 0.8rem; border-radius: 99px;">
                    ${window.appStorage.getStudents(c.id).length} طلاب
                </span>
            </div>
        `).join('');
    }
}

window.teacherManager = new TeacherManager();
