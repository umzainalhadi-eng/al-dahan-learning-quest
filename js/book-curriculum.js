(() => {
    const readingLessons = Array.isArray(window.READING_BOOK_LESSONS)
        ? window.READING_BOOK_LESSONS.map(lesson => ({ ...lesson, book: 'كتاب القراءة' }))
        : [];
    const workbookLessons = Array.isArray(window.WORKBOOK_LESSONS)
        ? window.WORKBOOK_LESSONS.map(lesson => ({ ...lesson, book: 'كراسة التدريبات' }))
        : [];
    const lessons = [...readingLessons, ...workbookLessons];

    const toActivityQuestion = question => ({
        type: question.options.length === 2 ? 'tf' : 'mcq',
        question: question.text,
        options: [...question.options],
        correct: question.correct,
        explanation: question.explanation
    });

    window.BOOK_CURRICULUM = {
        lessons,
        games: lessons.map((lesson, index) => ({
            id: `book-game-${lesson.id}`,
            number: index + 1,
            title: `تحدي: ${lesson.title}`,
            book: lesson.book,
            bookId: lesson.id,
            skill: lesson.skill || lesson.term || lesson.book,
            icon: lesson.icon || '📚',
            difficulty: 'متدرج',
            description: lesson.summary,
            objective: `التدرب على مهارات درس «${lesson.title}».`,
            points: 50,
            bookQuestions: lesson.questions.map(question => ({
                text: question.text,
                options: [...question.options],
                correct: question.correct,
                explanation: question.explanation
            }))
        })),
        activities: lessons.map((lesson, index) => ({
            id: `book-activity-${lesson.id}`,
            weekNumber: index + 1,
            title: lesson.title,
            subject: lesson.book,
            rewardPoints: 100,
            badgeReward: `وسام ${lesson.title}`,
            description: lesson.summary,
            tips: `راجع درس «${lesson.title}» واقرأ السؤال جيداً قبل اختيار الإجابة.`,
            questions: lesson.questions.map(toActivityQuestion),
            creativeTask: `اكتب جملة أو مثالاً جديداً يوضح ما تعلمته في «${lesson.title}».`
        })),
        stories: Array.isArray(window.WORKBOOK_STORIES) ? window.WORKBOOK_STORIES : [],
        films: Array.isArray(window.WORKBOOK_FILMS) ? window.WORKBOOK_FILMS : []
    };
})();
