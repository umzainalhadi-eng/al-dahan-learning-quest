class WorkbookLearningLab {
    constructor() {
        this.lesson = null;
        this.questions = [];
        this.questionIndex = 0;
        this.correctAnswers = 0;
        this.answerLog = [];
        this.selectedOption = null;
        this.answered = false;
        this.mode = 'quiz';
        this.timer = null;
        this.story = null;
        this.storyScene = 0;
        this.matchSelection = null;
        this.matchedPairs = new Set();
    }

    init() {
        this.renderLessons();
        this.renderStories();
        document.getElementById('workbook-back').addEventListener('click', () => this.showLessons());
        document.getElementById('workbook-next').addEventListener('click', () => this.nextQuestion());
        document.getElementById('workbook-check').addEventListener('click', () => this.checkAnswer());
        document.getElementById('workbook-home').addEventListener('click', () => this.showLessons());
        document.getElementById('workbook-retry').addEventListener('click', () => this.startGame(this.lesson.id, this.mode));
        document.getElementById('workbook-match-back').addEventListener('click', () => this.showLessons());
        document.getElementById('workbook-story-close').addEventListener('click', () => this.closeStory());
    }

    renderLessons() {
        const grid = document.getElementById('workbook-lessons-grid');
        grid.replaceChildren();
        window.WORKBOOK_LESSONS.forEach(lesson => {
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
            const buttons = document.createElement('div');
            buttons.className = 'flex gap-2 flex-wrap mt-3';
            [
                ['quiz', '📝 اختبار'],
                ['truefalse', '✅ صح أم خطأ'],
                ['speed', '⚡ سرعة'],
                ['match', '🧠 ذاكرة']
            ].forEach(([mode, label]) => {
                const button = document.createElement('button');
                button.type = 'button';
                button.className = `btn ${mode === 'quiz' ? 'btn-primary' : 'btn-outline'} btn-sm`;
                button.textContent = label;
                button.addEventListener('click', () => mode === 'match' ? this.startMatching(lesson) : this.startGame(lesson.id, mode));
                buttons.appendChild(button);
            });
            card.append(icon, title, summary, buttons);
            grid.appendChild(card);
        });
    }

    startGame(lessonId, mode) {
        clearInterval(this.timer);
        this.lesson = window.WORKBOOK_LESSONS.find(item => item.id === lessonId);
        if (!this.lesson) return;
        this.mode = mode;
        this.questions = this.lesson.questions.map((question, index) => {
            if (mode !== 'truefalse') return { ...question };
            const showCorrect = index % 2 === 0;
            const optionIndex = showCorrect ? question.correct : (question.correct + 1) % question.options.length;
            return {
                ...question,
                text: `صح أم خطأ: ${question.text} — «${question.options[optionIndex]}»`,
                options: ['صح', 'خطأ'],
                correct: showCorrect ? 0 : 1
            };
        });
        this.questionIndex = 0;
        this.correctAnswers = 0;
        this.answerLog = [];
        this.showView('workbook-quiz-view');
        this.renderQuestion();
    }

    renderQuestion() {
        const question = this.questions[this.questionIndex];
        if (!question) return this.finishGame();
        this.selectedOption = null;
        this.answered = false;
        document.getElementById('workbook-title').textContent = this.lesson.title;
        document.getElementById('workbook-mode-tag').textContent = this.mode === 'speed' ? '⚡ تحدي السرعة' : this.mode === 'truefalse' ? '✅ صح أم خطأ' : '📝 اختيار من متعدد';
        document.getElementById('workbook-progress').textContent = `السؤال ${this.questionIndex + 1} من ${this.questions.length}`;
        document.getElementById('workbook-question').textContent = question.text;
        document.getElementById('workbook-progress-fill').style.width = `${(this.questionIndex / this.questions.length) * 100}%`;
        const options = document.getElementById('workbook-options');
        options.replaceChildren();
        question.options.forEach((value, index) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'quiz-option-btn';
            button.textContent = value;
            button.addEventListener('click', () => {
                if (this.answered) return;
                this.selectedOption = index;
                options.querySelectorAll('button').forEach(item => item.classList.remove('selected'));
                button.classList.add('selected');
            });
            options.appendChild(button);
        });
        document.getElementById('workbook-feedback').textContent = '';
        document.getElementById('workbook-check').classList.remove('hidden');
        document.getElementById('workbook-next').classList.add('hidden');
        const timer = document.getElementById('workbook-timer');
        timer.classList.toggle('hidden', this.mode !== 'speed');
        clearInterval(this.timer);
        if (this.mode === 'speed') {
            let seconds = 15;
            timer.textContent = `⏱️ ${seconds} ثانية`;
            this.timer = setInterval(() => {
                seconds--;
                timer.textContent = `⏱️ ${seconds} ثانية`;
                if (seconds <= 0) {
                    clearInterval(this.timer);
                    if (!this.answered) {
                        this.selectedOption = -1;
                        this.checkAnswer();
                    }
                }
            }, 1000);
        }
    }

    checkAnswer() {
        if (this.answered || this.selectedOption === null) return;
        clearInterval(this.timer);
        this.answered = true;
        const question = this.questions[this.questionIndex];
        const feedback = document.getElementById('workbook-feedback');
        document.querySelectorAll('#workbook-options button').forEach((button, index) => {
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
            feedback.textContent = `الإجابة: ${question.options[question.correct]}. ${question.explanation}`;
            feedback.style.color = 'var(--danger)';
            if (window.soundEngine) window.soundEngine.wrong();
        }
        this.answerLog.push({
            question: question.text,
            answer: question.options[this.selectedOption] || '',
            correctAnswer: question.options[question.correct],
            isCorrect: this.selectedOption === question.correct
        });
        document.getElementById('workbook-check').classList.add('hidden');
        const next = document.getElementById('workbook-next');
        next.textContent = this.questionIndex === this.questions.length - 1 ? 'النتيجة' : 'التالي';
        next.classList.remove('hidden');
    }

    nextQuestion() {
        if (!this.answered) return;
        this.questionIndex++;
        this.renderQuestion();
    }

    finishGame() {
        clearInterval(this.timer);
        this.showView('workbook-result-view');
        const total = this.questions.length;
        document.getElementById('workbook-score').textContent = `${this.correctAnswers} من ${total}`;
        document.getElementById('workbook-result-message').textContent = this.correctAnswers / total >= 0.8
            ? 'ممتاز! أتقنت مهارة هذا الموضوع.'
            : 'أحسنت المحاولة، راجع الشرح وأعد الجولة.';
        this.sendResultToTeacher(total);
    }

    async sendResultToTeacher(total) {
        const result = document.getElementById('workbook-result-message');
        const status = document.getElementById('workbook-sync-status') || document.createElement('p');
        status.id = 'workbook-sync-status';
        status.className = 'text-sm font-bold mt-3';
        result?.after(status);
        if (!window.classroomService?.isConfigured()) {
            status.textContent = 'لم تُرسل النتيجة للمعلم؛ إعداد Supabase غير مكتمل.';
            status.style.color = 'var(--danger)';
            return;
        }
        status.textContent = 'جارٍ إرسال نتيجتك إلى المعلم...';
        try {
            await window.classroomService.submitStudentWork({
                kind: 'submission',
                title: `كراسة التدريبات: ${this.lesson.title}`,
                body: `أكملت ${this.mode === 'quiz' ? 'الاختبار' : this.mode === 'truefalse' ? 'تحدي صح أم خطأ' : 'تحدي السرعة'} في درس «${this.lesson.title}».`,
                answers: this.answerLog,
                score: { correct: this.correctAnswers, total }
            });
            status.textContent = 'وصلت نتيجتك وإجاباتك إلى المعلم.';
        } catch (error) {
            console.error('تعذر إرسال نتيجة الكراسة إلى المعلم.', error);
            status.textContent = `تعذر إرسال النتيجة إلى المعلم: ${error.message}`;
            status.style.color = 'var(--danger)';
        }
    }

    startMatching(lesson) {
        this.lesson = lesson;
        this.matchedPairs.clear();
        this.matchSelection = null;
        this.showView('workbook-match-view');
        const pairs = this.getPairs(lesson);
        const cards = pairs.flatMap((pair, id) => [
            { id, label: pair[0], side: 'term' },
            { id, label: pair[1], side: 'meaning' }
        ]).sort(() => Math.random() - 0.5);
        const grid = document.getElementById('workbook-match-grid');
        grid.replaceChildren();
        cards.forEach(card => {
            const button = document.createElement('button');
            button.className = 'portal-card text-center font-bold';
            button.type = 'button';
            button.textContent = '❔ اضغط للكشف';
            button.dataset.id = String(card.id);
            button.dataset.side = card.side;
            button.dataset.label = card.label;
            button.addEventListener('click', () => this.flipMatchCard(button));
            grid.appendChild(button);
        });
        this.updateMatchStatus();
    }

    getPairs(lesson) {
        if (lesson.id === 'wb-past-tense') return [['كتبَ', 'حدث وقع وانتهى'], ['زرعوا', 'ماضٍ اتصلت به واو الجماعة'], ['فهمتُ', 'ماضٍ اتصل بتاء الفاعل'], ['وصلنا', 'ماضٍ اتصل بنا الفاعلين']];
        if (lesson.id === 'wb-alif-layyinah') return [['عصا', 'ألف لينة قائمة'], ['فتى', 'ألف لينة مقصورة'], ['دعا', 'فعل مختوم بألف قائمة'], ['رمى', 'فعل مختوم بألف مقصورة']];
        return [['الإنصات', 'تركيز السمع لفهم الكلام'], ['يتفقد', 'يبحث ليتأكد من الحال'], ['التسلسل', 'ترتيب الأحداث'], ['التعاطف', 'مراعاة مشاعر الآخرين']];
    }

    flipMatchCard(button) {
        if (button.disabled || button.dataset.revealed) return;
        button.textContent = button.dataset.label;
        button.dataset.revealed = 'true';
        if (!this.matchSelection) {
            this.matchSelection = button;
            return;
        }
        const first = this.matchSelection;
        this.matchSelection = null;
        const match = first !== button && first.dataset.id === button.dataset.id && first.dataset.side !== button.dataset.side;
        if (match) {
            first.disabled = true;
            button.disabled = true;
            first.classList.add('correct');
            button.classList.add('correct');
            this.matchedPairs.add(button.dataset.id);
            this.updateMatchStatus();
            if (this.matchedPairs.size === 4) {
                document.getElementById('workbook-match-message').textContent = 'رائع! طابقت جميع الأزواج.';
                if (window.confettiManager) window.confettiManager.burst(window.innerWidth / 2, window.innerHeight / 2, 60);
            }
        } else {
            first.classList.add('wrong');
            button.classList.add('wrong');
            window.setTimeout(() => {
                first.textContent = '❔ اضغط للكشف';
                button.textContent = '❔ اضغط للكشف';
                delete first.dataset.revealed;
                delete button.dataset.revealed;
                first.classList.remove('wrong');
                button.classList.remove('wrong');
            }, 700);
        }
    }

    updateMatchStatus() {
        document.getElementById('workbook-match-count').textContent = `${this.matchedPairs.size} من 4 أزواج`;
        document.getElementById('workbook-match-message').textContent = '';
    }

    renderStories() {
        const grid = document.getElementById('workbook-stories-grid');
        grid.replaceChildren();
        window.WORKBOOK_STORIES.forEach(story => {
            const card = document.createElement('article');
            card.className = 'portal-card';
            const icon = document.createElement('div');
            icon.className = 'portal-icon-box';
            icon.textContent = story.icon;
            const title = document.createElement('h3');
            title.className = 'portal-title';
            title.textContent = story.title;
            const summary = document.createElement('p');
            summary.className = 'portal-desc';
            summary.textContent = story.summary;
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'btn btn-primary';
            button.textContent = 'ابدأ القصة';
            button.addEventListener('click', () => this.openStory(story));
            card.append(icon, title, summary, button);
            grid.appendChild(card);
        });
    }

    openStory(story) {
        this.story = story;
        this.storyScene = 0;
        document.getElementById('workbook-story-reader').classList.remove('hidden');
        document.getElementById('workbook-story-reader').scrollIntoView({ behavior: 'smooth', block: 'start' });
        this.renderStoryScene();
    }

    renderStoryScene() {
        const chapter = this.story.chapters[this.storyScene];
        document.getElementById('workbook-story-title').textContent = this.story.title;
        document.getElementById('workbook-story-progress').textContent = `المشهد ${this.storyScene + 1} من ${this.story.chapters.length}`;
        document.getElementById('workbook-story-text').textContent = chapter.text;
        const choices = document.getElementById('workbook-story-choices');
        choices.replaceChildren();
        const options = chapter.reflectionQuestion
            ? chapter.options.map((text, index) => ({ text, nextScene: index === chapter.correctIndex ? -1 : -2 }))
            : chapter.choices;
        if (chapter.reflectionQuestion) {
            const question = document.createElement('h4');
            question.className = 'font-bold';
            question.textContent = chapter.reflectionQuestion;
            choices.appendChild(question);
        }
        options.forEach(choice => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'btn btn-outline';
            button.textContent = choice.text;
            button.addEventListener('click', () => {
                if (choice.nextScene < 0) {
                    const correct = choice.nextScene === -1;
                    document.getElementById('workbook-story-text').textContent = correct
                        ? `${chapter.text} أحسنت! ${chapter.options[chapter.correctIndex]}`
                        : 'حاول التفكير في أحداث القصة ثم اختر الإجابة الأقرب.';
                    if (correct) {
                        button.classList.add('correct');
                        if (window.soundEngine) window.soundEngine.success();
                    } else if (window.soundEngine) window.soundEngine.wrong();
                    return;
                }
                const next = this.story.chapters.findIndex(item => item.scene === choice.nextScene);
                this.storyScene = next >= 0 ? next : Math.min(this.storyScene + 1, this.story.chapters.length - 1);
                this.renderStoryScene();
            });
            choices.appendChild(button);
        });
    }

    closeStory() {
        document.getElementById('workbook-story-reader').classList.add('hidden');
        this.story = null;
    }

    showView(id) {
        ['workbook-lessons-view', 'workbook-quiz-view', 'workbook-result-view', 'workbook-match-view'].forEach(viewId => {
            document.getElementById(viewId).classList.toggle('hidden', viewId !== id);
        });
    }

    showLessons() {
        clearInterval(this.timer);
        this.showView('workbook-lessons-view');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.workbookLearningLab = new WorkbookLearningLab();
    window.workbookLearningLab.init();
});
