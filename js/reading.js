class ReadingBookManager {
    constructor() {
        this.selectedLessonId = null;
        this.questions = [];
        this.questionIndex = 0;
        this.correctAnswers = 0;
        this.selectedOption = null;
        this.hasAnswered = false;
        this.answerLog = [];
        this.gameMode = 'quiz';
        this.timer = null;
        this.progressKey = 'arabic_reading_book_progress_v1';
    }

    init() {
        this.renderLessons();
        document.getElementById('reading-all-challenge')?.addEventListener('click', () => this.startChallenge(null));
        document.getElementById('reading-back')?.addEventListener('click', () => this.showLessons());
    }

    getLessons() {
        return Array.isArray(window.READING_BOOK_LESSONS) ? window.READING_BOOK_LESSONS : [];
    }

    getProgress() {
        try {
            const progress = JSON.parse(localStorage.getItem(this.progressKey) || '{}');
            return progress && typeof progress === 'object' ? progress : {};
        } catch (error) {
            console.error('تعذر قراءة تقدم بنك الأسئلة المحفوظ.', error);
            return {};
        }
    }

    renderLessons() {
        const grid = document.getElementById('reading-lessons-grid');
        if (!grid) return;
        const progress = this.getProgress();
        grid.replaceChildren();

        this.getLessons().forEach(lesson => {
            const card = document.createElement('article');
            card.className = 'portal-card';
            const icon = document.createElement('div');
            icon.className = 'portal-icon-box';
            icon.textContent = lesson.icon;
            const title = document.createElement('h3');
            title.className = 'portal-title';
            title.textContent = lesson.title;
            const summary = document.createElement('p');
            summary.className = 'portal-desc';
            summary.textContent = lesson.summary;
            const count = document.createElement('p');
            count.className = 'text-sm text-muted';
            const bestScore = progress[lesson.id]?.bestScore;
            count.textContent = `${lesson.questions.length} أسئلة أصلية${Number.isFinite(bestScore) ? ` • أفضل نتيجة: ${bestScore}/${lesson.questions.length}` : ''}`;
            const modes = document.createElement('div');
            modes.className = 'flex gap-2 flex-wrap mt-3';
            [
                { id: 'quiz', label: '📝 اختبار' },
                { id: 'truefalse', label: '✅ صح أم خطأ' },
                { id: 'speed', label: '⚡ سرعة' }
            ].forEach(mode => {
                const button = document.createElement('button');
                button.className = `btn ${mode.id === 'quiz' ? 'btn-primary' : 'btn-outline'} btn-sm`;
                button.type = 'button';
                button.textContent = mode.label;
                button.addEventListener('click', () => this.startChallenge(lesson.id, mode.id));
                modes.appendChild(button);
            });
            card.append(icon, title, summary, count, modes);
            grid.appendChild(card);
        });
    }

    startChallenge(lessonId, gameMode = 'quiz') {
        clearInterval(this.timer);
        this.selectedLessonId = lessonId;
        this.gameMode = gameMode;
        const lessons = this.getLessons().filter(lesson => !lessonId || lesson.id === lessonId);
        this.questions = lessons.flatMap(lesson => lesson.questions.map((question, index) => {
            if (gameMode !== 'truefalse') return { ...question, lessonTitle: lesson.title };
            const useCorrectAnswer = index % 2 === 0;
            const answerIndex = useCorrectAnswer
                ? question.correct
                : (question.correct + 1) % question.options.length;
            return {
                ...question,
                lessonTitle: lesson.title,
                text: `صح أم خطأ: الإجابة عن السؤال «${question.text}» هي «${question.options[answerIndex]}»؟`,
                options: ['صح', 'خطأ'],
                correct: useCorrectAnswer ? 0 : 1
            };
        }));
        this.questionIndex = 0;
        this.correctAnswers = 0;
        this.answerLog = [];
        this.selectedOption = null;
        this.hasAnswered = false;
        document.getElementById('reading-lessons-view')?.classList.add('hidden');
        document.getElementById('reading-quiz-view')?.classList.remove('hidden');
        document.getElementById('reading-complete-view')?.classList.add('hidden');
        this.renderQuestion();
    }

    renderQuestion() {
        const question = this.questions[this.questionIndex];
        if (!question) {
            this.finishChallenge();
            return;
        }
        const title = document.getElementById('reading-quiz-title');
        const tag = document.getElementById('reading-question-tag');
        const progress = document.getElementById('reading-question-progress');
        const text = document.getElementById('reading-question-text');
        const options = document.getElementById('reading-options');
        const feedback = document.getElementById('reading-feedback');
        const next = document.getElementById('reading-next');
        const fill = document.getElementById('reading-progress-fill');
        title.textContent = this.selectedLessonId ? question.lessonTitle : 'تحدي الكتاب الشامل';
        tag.textContent = question.type;
        progress.textContent = `السؤال ${this.questionIndex + 1} من ${this.questions.length}`;
        text.textContent = question.text;
        feedback.textContent = '';
        feedback.className = 'text-sm font-bold mt-3';
        next.classList.add('hidden');
        fill.style.width = `${(this.questionIndex / this.questions.length) * 100}%`;
        const timer = document.getElementById('reading-timer');
        if (timer) {
            timer.classList.toggle('hidden', this.gameMode !== 'speed');
            timer.textContent = this.gameMode === 'speed' ? '⏱️ 15' : '';
        }
        options.replaceChildren();
        this.selectedOption = null;
        this.hasAnswered = false;

        question.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'quiz-option-btn';
            button.type = 'button';
            button.textContent = option;
            button.addEventListener('click', () => {
                if (this.hasAnswered) return;
                this.selectedOption = index;
                options.querySelectorAll('button').forEach(item => item.classList.remove('selected'));
                button.classList.add('selected');
            });
            options.appendChild(button);
        });
        document.getElementById('reading-check')?.replaceWith(this.createCheckButton());
        clearInterval(this.timer);
        if (this.gameMode === 'speed') {
            let seconds = 15;
            this.timer = setInterval(() => {
                seconds--;
                if (timer) timer.textContent = `⏱️ ${seconds}`;
                if (seconds <= 0) {
                    clearInterval(this.timer);
                    if (!this.hasAnswered) {
                        this.selectedOption = (question.correct + 1) % question.options.length;
                        this.checkAnswer();
                    }
                }
            }, 1000);
        }
    }

    createCheckButton() {
        const button = document.createElement('button');
        button.id = 'reading-check';
        button.className = 'btn btn-primary mt-3';
        button.type = 'button';
        button.textContent = 'تحقق من الإجابة';
        button.addEventListener('click', () => this.checkAnswer());
        return button;
    }

    checkAnswer() {
        if (this.hasAnswered || this.selectedOption === null) return;
        clearInterval(this.timer);
        this.hasAnswered = true;
        const question = this.questions[this.questionIndex];
        const options = document.getElementById('reading-options');
        const feedback = document.getElementById('reading-feedback');
        const next = document.getElementById('reading-next');
        options.querySelectorAll('button').forEach((button, index) => {
            button.disabled = true;
            if (index === question.correct) button.classList.add('correct');
            if (index === this.selectedOption && index !== question.correct) button.classList.add('wrong');
        });
        if (this.selectedOption === question.correct) {
            this.correctAnswers++;
            feedback.textContent = `أحسنت! ${question.explanation}`;
            feedback.style.color = 'var(--success)';
            if (window.soundEngine) window.soundEngine.success();
        } else {
            feedback.textContent = `الإجابة الصحيحة: ${question.options[question.correct]}. ${question.explanation}`;
            feedback.style.color = 'var(--danger)';
            if (window.soundEngine) window.soundEngine.wrong();
        }
        this.answerLog.push({
            question: question.text,
            answer: this.questions[this.questionIndex].options[this.selectedOption] || '',
            correctAnswer: question.options[question.correct],
            isCorrect: this.selectedOption === question.correct
        });
        next.textContent = this.questionIndex === this.questions.length - 1 ? 'عرض النتيجة' : 'السؤال التالي';
        next.classList.remove('hidden');
    }

    nextQuestion() {
        if (!this.hasAnswered) return;
        this.questionIndex++;
        this.renderQuestion();
    }

    finishChallenge() {
        clearInterval(this.timer);
        document.getElementById('reading-quiz-view')?.classList.add('hidden');
        const complete = document.getElementById('reading-complete-view');
        complete?.classList.remove('hidden');
        const percent = Math.round((this.correctAnswers / this.questions.length) * 100);
        document.getElementById('reading-score').textContent = `${this.correctAnswers} من ${this.questions.length}`;
        document.getElementById('reading-result-message').textContent = percent >= 80
            ? 'ممتاز! قراءتك دقيقة وفهمك رائع.'
            : percent >= 50
                ? 'أحسنت، راجع الإجابات ثم حاول تحسين نتيجتك.'
                : 'واصل التدريب، فكل محاولة تقربك من الإتقان.';

        const progress = this.getProgress();
        const lessonIds = this.selectedLessonId ? [this.selectedLessonId] : this.getLessons().map(lesson => lesson.id);
        if (this.selectedLessonId) {
            const previousBest = Number(progress[this.selectedLessonId]?.bestScore) || 0;
            progress[this.selectedLessonId] = {
                attempts: (Number(progress[this.selectedLessonId]?.attempts) || 0) + 1,
                bestScore: Math.max(previousBest, this.correctAnswers),
                lastScore: this.correctAnswers,
                lastPlayedAt: new Date().toISOString()
            };
        } else {
            progress.lastChallenge = {
                score: this.correctAnswers,
                total: this.questions.length,
                lessonIds,
                completedAt: new Date().toISOString()
            };
        }
        try {
            localStorage.setItem(this.progressKey, JSON.stringify(progress));
        } catch (error) {
            console.error('تعذر حفظ نتيجة بنك الأسئلة.', error);
        }
        if (window.confettiManager && percent >= 80) {
            window.confettiManager.burst(window.innerWidth / 2, window.innerHeight / 2, 70);
        }
        this.sendResultToTeacher(lessonIds);
        this.renderLessons();
    }

    async sendResultToTeacher(lessonIds) {
        const status = document.getElementById('reading-sync-status') || document.createElement('p');
        status.id = 'reading-sync-status';
        status.className = 'text-sm font-bold mt-3';
        document.getElementById('reading-result-message')?.after(status);
        if (!window.classroomService?.isConfigured()) {
            status.textContent = 'لم تُرسل النتيجة للمعلم؛ إعداد Supabase غير مكتمل.';
            status.style.color = 'var(--danger)';
            return;
        }
        status.textContent = 'جارٍ إرسال نتيجتك إلى المعلم...';
        try {
            const titles = this.getLessons()
                .filter(lesson => lessonIds.includes(lesson.id))
                .map(lesson => lesson.title);
            await window.classroomService.submitStudentWork({
                kind: 'submission',
                title: `كتاب القراءة: ${titles.join('، ')}`,
                body: `أكملت ${this.gameMode === 'quiz' ? 'الاختبار' : this.gameMode === 'truefalse' ? 'تحدي صح أم خطأ' : 'تحدي السرعة'} في كتاب القراءة.`,
                answers: this.answerLog,
                score: { correct: this.correctAnswers, total: this.questions.length }
            });
            status.textContent = 'وصلت نتيجتك وإجاباتك إلى المعلم.';
        } catch (error) {
            console.error('تعذر إرسال نتيجة القراءة إلى المعلم.', error);
            status.textContent = `تعذر إرسال النتيجة إلى المعلم: ${error.message}`;
            status.style.color = 'var(--danger)';
        }
    }

    showLessons() {
        clearInterval(this.timer);
        document.getElementById('reading-quiz-view')?.classList.add('hidden');
        document.getElementById('reading-complete-view')?.classList.add('hidden');
        document.getElementById('reading-lessons-view')?.classList.remove('hidden');
        this.renderLessons();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.readingBookManager = new ReadingBookManager();
    window.readingBookManager.init();
    document.getElementById('reading-next')?.addEventListener('click', () => window.readingBookManager.nextQuestion());
    document.getElementById('reading-retry')?.addEventListener('click', () => window.readingBookManager.startChallenge(window.readingBookManager.selectedLessonId, window.readingBookManager.gameMode));
    document.getElementById('reading-home')?.addEventListener('click', () => window.readingBookManager.showLessons());
});
