// Interactive Stories Engine with Branching Choices and Audio Narration
class StoriesManager {
    constructor() {
        this.currentStory = null;
        this.currentChapterIndex = 0;
        this.speaking = false;
        this.speechSynth = window.speechSynthesis;
    }

    init() {
        this.renderStoryList();
    }

    renderStoryList() {
        const container = document.getElementById('stories-grid');
        if (!container) return;

        const stories = window.appStorage.getStories();
        container.innerHTML = '';

        stories.forEach(story => {
            const card = document.createElement('div');
            card.className = 'story-card';
            card.innerHTML = `
                <div class="story-card-header">
                    <span class="story-category-tag">${story.category}</span>
                    <span class="story-read-time">⏱️ ${story.readTime}</span>
                </div>
                <div class="story-icon-circle">${story.icon}</div>
                <h3 class="story-card-title">${story.title}</h3>
                <p class="story-card-summary">${story.summary}</p>
                <button class="btn btn-primary start-story-btn" data-id="${story.id}">
                    📖 ابدأ المغامرة الآن
                </button>
            `;

            card.querySelector('.start-story-btn').addEventListener('click', () => {
                this.openStory(story.id);
            });

            container.appendChild(card);
        });
    }

    openStory(storyId) {
        const stories = window.appStorage.getStories();
        this.currentStory = stories.find(s => s.id === storyId);
        if (!this.currentStory) return;

        this.currentChapterIndex = 0;
        this.stopNarration();

        document.getElementById('stories-overview')?.classList.add('hidden');
        document.getElementById('story-reader-view')?.classList.remove('hidden');

        document.getElementById('reader-story-title').textContent = this.currentStory.title;
        document.getElementById('reader-story-category').textContent = this.currentStory.category;

        this.renderCurrentChapter();
    }

    renderCurrentChapter() {
        const chapter = this.currentStory.chapters[this.currentChapterIndex];
        if (!chapter) return;

        const textEl = document.getElementById('reader-chapter-text');
        const decisionContainer = document.getElementById('reader-decisions-container');
        const progressEl = document.getElementById('reader-progress-info');
        const reflectionBox = document.getElementById('reader-reflection-box');

        if (textEl) textEl.textContent = chapter.text;
        if (progressEl) progressEl.textContent = `المشهد ${chapter.scene} من ${this.currentStory.chapters.length}`;

        // Stop narration if running
        this.stopNarration();

        // Check if final reflection question scene
        if (chapter.reflectionQuestion) {
            if (decisionContainer) decisionContainer.classList.add('hidden');
            if (reflectionBox) {
                reflectionBox.classList.remove('hidden');
                reflectionBox.innerHTML = `
                    <div class="reflection-quiz-card">
                        <h4 class="font-bold text-lg mb-2">🎯 سؤال التفكير وتحدي الحكمة:</h4>
                        <p class="mb-4">${chapter.reflectionQuestion}</p>
                        <div class="options-list">
                            ${chapter.options.map((opt, idx) => `
                                <button class="reflection-opt-btn" data-idx="${idx}">
                                    ${opt}
                                </button>
                            `).join('')}
                        </div>
                    </div>
                `;

                reflectionBox.querySelectorAll('.reflection-opt-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const chosen = parseInt(btn.dataset.idx);
                        if (chosen === chapter.correctIndex) {
                            window.soundEngine.success();
                            btn.classList.add('correct');
                            window.confettiManager.burst(window.innerWidth / 2, window.innerHeight / 2, 80);
                            window.appStorage.addPoints(chapter.xpReward, `إكمال قصة: ${this.currentStory.title}`);
                            window.appStorage.addBadge(`بطل قصة ${this.currentStory.title} 📜`);
                            window.app.updateHeaderStats();

                            setTimeout(() => {
                                alert(`🎉 تهانينا يا بطل!\nأجبت بحكمة ونلت +${chapter.xpReward} نقطة ووسام الإنجاز القصصي!`);
                                this.closeStory();
                            }, 1200);
                        } else {
                            window.soundEngine.wrong();
                            btn.classList.add('wrong');
                            alert('فكر مجدداً يا بطل، ما هي الرسالة العميقة التي أرادت القصة إيصالها؟');
                        }
                    });
                });
            }
        } else {
            if (reflectionBox) reflectionBox.classList.add('hidden');
            if (decisionContainer) {
                decisionContainer.classList.remove('hidden');
                decisionContainer.innerHTML = `
                    <div class="decision-prompt-box">
                        <p class="decision-prompt-text font-bold mb-3">🤔 ${chapter.decisionPrompt || 'ما هي خطوتك التالية؟'}</p>
                        <div class="decision-buttons">
                            ${chapter.choices.map((c, i) => `
                                <button class="decision-btn" data-next="${c.nextScene}">
                                    ✨ ${c.text}
                                </button>
                            `).join('')}
                        </div>
                    </div>
                `;

                decisionContainer.querySelectorAll('.decision-btn').forEach(btn => {
                    btn.addEventListener('click', () => {
                        window.soundEngine.click();
                        const nextSceneNum = parseInt(btn.dataset.next);
                        const nextIdx = this.currentStory.chapters.findIndex(ch => ch.scene === nextSceneNum);
                        if (nextIdx !== -1) {
                            this.currentChapterIndex = nextIdx;
                            this.renderCurrentChapter();
                        } else {
                            this.currentChapterIndex++;
                            this.renderCurrentChapter();
                        }
                    });
                });
            }
        }

        // Render scene illustration
        this.renderSceneIllustration(chapter);
    }

    renderSceneIllustration(chapter) {
        const canvas = document.getElementById('story-illustration-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const w = canvas.width;
        const h = canvas.height;
        const storyPanels = {
            'story-1': { title: 'متحف أشكال الحروف', items: [['ب', 'منفصل'], ['بـ', 'أول الكلمة'], ['ـبـ', 'وسط الكلمة'], ['ـب', 'آخر الكلمة']] },
            'story-2': { title: 'محققو الجملة', items: [['قرأَ', 'الفعل'], ['الطالبُ', 'الفاعل'], ['الدرسَ', 'المفعول به']] },
            'story-3': { title: 'عائلة الجذر ك ت ب', items: [['ك ت ب', 'الجذر'], ['كاتِب', 'اسم الفاعل'], ['مكتوب', 'اسم المفعول'], ['مكتبة', 'اسم المكان']] },
            'story-4': { title: 'ورشة علامات الترقيم', items: [['.', 'نقطة'], ['،', 'فاصلة'], ['؟', 'استفهام'], [':', 'حوار']] },
            'story-5': { title: 'مقاعد الهمزة', items: [['فئة', 'نبرة'], ['مؤمن', 'واو'], ['رأس', 'ألف'], ['سماء', 'السطر']] },
            'story-6': { title: 'قاموس الجذور', items: [['كَشَفَ', 'الجذر'], ['كاشف', 'اسم فاعل'], ['مكشوف', 'اسم مفعول'], ['استكشاف', 'مصدر']] },
            'story-7': { title: 'مفاتيح الأساليب', items: [['يا', 'نداء'], ['هل', 'استفهام'], ['افتحوا', 'أمر'], ['لا تهملوا', 'نهي']] },
            'story-8': { title: 'قصر النواسخ', items: [['الحديقةُ', 'مبتدأ'], ['جميلةٌ', 'خبر'], ['كانت', 'ناسخ'], ['جميلةً', 'خبر كان']] }
        };
        const panel = storyPanels[this.currentStory.id];
        if (!panel) return;

        const background = ctx.createLinearGradient(0, 0, w, h);
        background.addColorStop(0, '#edf7f4');
        background.addColorStop(1, '#e8f1f8');
        ctx.fillStyle = background;
        ctx.fillRect(0, 0, w, h);
        ctx.direction = 'rtl';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#174c4a';
        ctx.font = 'bold 30px Cairo, sans-serif';
        ctx.fillText(panel.title, w / 2, 52);

        const gap = 18;
        const cardWidth = Math.min(178, (w - 80 - gap * (panel.items.length - 1)) / panel.items.length);
        const totalWidth = cardWidth * panel.items.length + gap * (panel.items.length - 1);
        const startX = (w - totalWidth) / 2;
        const colors = ['#0b7285', '#2a9d8f', '#e76f51', '#d99a24'];
        const activeIndex = Math.min(chapter.scene - 1, panel.items.length - 1);

        panel.items.forEach(([value, label], index) => {
            const x = startX + index * (cardWidth + gap);
            const y = 88 + Math.sin(Date.now() / 550 + index) * 4;
            ctx.fillStyle = index === activeIndex ? '#ffffff' : 'rgba(255, 255, 255, 0.72)';
            ctx.strokeStyle = index === activeIndex ? colors[index % colors.length] : 'rgba(23, 76, 74, 0.16)';
            ctx.lineWidth = index === activeIndex ? 4 : 2;
            ctx.beginPath();
            ctx.roundRect(x, y, cardWidth, 150, 16);
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = colors[index % colors.length];
            ctx.font = `bold ${value.length > 4 ? 31 : 46}px Cairo, sans-serif`;
            ctx.fillText(value, x + cardWidth / 2, y + 78);
            ctx.fillStyle = '#355b62';
            ctx.font = 'bold 17px Cairo, sans-serif';
            ctx.fillText(label, x + cardWidth / 2, y + 124);
        });

        ctx.fillStyle = '#55747a';
        ctx.font = 'bold 18px Cairo, sans-serif';
        ctx.fillText(`المشهد ${chapter.scene} · تعلّم واكتشف`, w / 2, h - 22);
    }

    toggleNarration() {
        if (!this.speechSynth) {
            alert('خاصية القراءة الصوتية غير مدعومة في هذا المتصفح.');
            return;
        }

        if (this.speaking) {
            this.stopNarration();
        } else {
            const chapter = this.currentStory.chapters[this.currentChapterIndex];
            if (!chapter) return;

            const utterance = new SpeechSynthesisUtterance(chapter.text);
            utterance.lang = 'ar-SA';
            utterance.rate = 0.9;
            utterance.pitch = 1.05;

            utterance.onend = () => {
                this.speaking = false;
                this.updateNarrationButtonUI();
            };

            utterance.onerror = () => {
                this.speaking = false;
                this.updateNarrationButtonUI();
            };

            this.speechSynth.speak(utterance);
            this.speaking = true;
            this.updateNarrationButtonUI();
        }
    }

    stopNarration() {
        if (this.speechSynth) {
            this.speechSynth.cancel();
        }
        this.speaking = false;
        this.updateNarrationButtonUI();
    }

    updateNarrationButtonUI() {
        const btn = document.getElementById('btn-narrate-story');
        if (btn) {
            btn.innerHTML = this.speaking ? '⏹️ إيقاف الصوت' : '🔊 استمع للقصة بصوت الأستاذ';
            btn.className = this.speaking ? 'btn btn-danger' : 'btn btn-outline';
        }
    }

    closeStory() {
        this.stopNarration();
        document.getElementById('story-reader-view')?.classList.add('hidden');
        document.getElementById('stories-overview')?.classList.remove('hidden');
    }
}

window.storiesManager = new StoriesManager();
