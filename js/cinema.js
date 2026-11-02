// Educational Short Films & Interactive Cinema Engine
class CinemaManager {
    constructor() {
        this.currentFilm = null;
        this.currentSceneIdx = 0;
        this.isPlaying = false;
        this.playInterval = null;
        this.animFrameId = null;
        this.speechSynth = window.speechSynthesis;
        this.particles = [];
    }

    init() {
        this.renderFilmList();
        this.setupCinemaControls();
    }

    renderFilmList() {
        const container = document.getElementById('films-grid');
        if (!container) return;

        const films = window.appStorage.getCinemaFilms();
        container.innerHTML = '';

        films.forEach(film => {
            const card = document.createElement('div');
            card.className = 'film-card';
            card.innerHTML = `
                <div class="film-badge-row">
                    <span class="film-category-tag">${film.category}</span>
                    <span class="film-time-tag">⏱️ ${film.duration}</span>
                </div>
                <div class="film-theater-icon">🎬</div>
                <h3 class="film-card-title">${film.title}</h3>
                <p class="film-card-desc">${film.description}</p>
                <button class="btn btn-primary watch-film-btn" data-id="${film.id}">
                    ▶️ مشاهدة العرض التفاعلي
                </button>
            `;

            card.querySelector('.watch-film-btn').addEventListener('click', () => {
                this.loadFilm(film.id);
            });

            container.appendChild(card);
        });
    }

    setupCinemaControls() {
        const playBtn = document.getElementById('cinema-play-btn');
        if (playBtn) {
            playBtn.addEventListener('click', () => this.togglePlay());
        }

        const nextSceneBtn = document.getElementById('cinema-next-scene');
        if (nextSceneBtn) {
            nextSceneBtn.addEventListener('click', () => this.nextScene());
        }

        const prevSceneBtn = document.getElementById('cinema-prev-scene');
        if (prevSceneBtn) {
            prevSceneBtn.addEventListener('click', () => this.prevScene());
        }

        const closeBtn = document.getElementById('cinema-close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeTheater());
        }
    }

    loadFilm(filmId) {
        const films = window.appStorage.getCinemaFilms();
        this.currentFilm = films.find(f => f.id === filmId);
        if (!this.currentFilm) return;

        this.currentSceneIdx = 0;
        this.isPlaying = false;
        this.initParticles();

        document.getElementById('films-overview')?.classList.add('hidden');
        document.getElementById('cinema-theater-view')?.classList.remove('hidden');

        document.getElementById('theater-film-title').textContent = this.currentFilm.title;
        document.getElementById('theater-film-category').textContent = this.currentFilm.category;

        this.renderScene();
        this.startSceneAnimation();
    }

    renderScene() {
        if (!this.currentFilm) return;
        const scene = this.currentFilm.scenes[this.currentSceneIdx];
        if (!scene) return;

        const titleEl = document.getElementById('theater-scene-title');
        const subtitlesEl = document.getElementById('theater-subtitles-text');
        const progressEl = document.getElementById('theater-scene-indicator');

        if (titleEl) titleEl.textContent = `المشهد ${this.currentSceneIdx + 1}: ${scene.title}`;
        if (subtitlesEl) subtitlesEl.textContent = scene.subtitles;
        if (progressEl) progressEl.textContent = `${this.currentSceneIdx + 1} / ${this.currentFilm.scenes.length}`;

        // Narration
        this.narrateSubtitles(scene.subtitles);

        // Check if last scene, show checkpoint quiz
        const quizBox = document.getElementById('theater-quiz-box');
        if (this.currentSceneIdx === this.currentFilm.scenes.length - 1 && this.currentFilm.quiz) {
            if (quizBox) {
                quizBox.classList.remove('hidden');
                this.renderFilmQuiz();
            }
        } else {
            if (quizBox) quizBox.classList.add('hidden');
        }
    }

    narrateSubtitles(text) {
        if (!this.speechSynth) return;
        this.speechSynth.cancel();
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = 'ar-SA';
        utter.rate = 0.95;
        this.speechSynth.speak(utter);
    }

    renderFilmQuiz() {
        const q = this.currentFilm.quiz;
        const quizBox = document.getElementById('theater-quiz-box');
        if (!quizBox) return;

        quizBox.innerHTML = `
            <div class="theater-quiz-content">
                <h4 class="font-bold text-lg mb-2">💡 ماذا فهمنا من الفيلم؟ (سؤال المتابعة الذكية):</h4>
                <p class="mb-4">${q.question}</p>
                <div class="options-list">
                    ${q.options.map((opt, i) => `
                        <button class="film-quiz-opt" data-idx="${i}">${opt}</button>
                    `).join('')}
                </div>
            </div>
        `;

        quizBox.querySelectorAll('.film-quiz-opt').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.dataset.idx);
                if (idx === q.correct) {
                    window.soundEngine.success();
                    btn.classList.add('correct');
                    window.confettiManager.burst(window.innerWidth / 2, window.innerHeight / 2, 70);
                    window.appStorage.addPoints(q.xp, `مشاهدة فيلم: ${this.currentFilm.title}`);
                    window.appStorage.addBadge('ناقد علمي واعد 🎬');
                    window.app.updateHeaderStats();
                    setTimeout(() => {
                        alert(`🌟 إجابة ممتازة!\nأكملت مشاهدة الفيلم بنجاح ونلت +${q.xp} نقطة!`);
                    }, 800);
                } else {
                    window.soundEngine.wrong();
                    btn.classList.add('wrong');
                    alert('إجابة غير دقيقة، تذكر ما شرحه الفيلم في المشهد الثاني!');
                }
            });
        });
    }

    initParticles() {
        this.particles = [];
        for (let i = 0; i < 60; i++) {
            this.particles.push({
                x: Math.random() * 800,
                y: Math.random() * 450,
                speed: 1 + Math.random() * 3,
                radius: 2 + Math.random() * 4,
                alpha: 0.3 + Math.random() * 0.7
            });
        }
    }

    startSceneAnimation() {
        cancelAnimationFrame(this.animFrameId);
        const canvas = document.getElementById('cinema-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        let tick = 0;

        const loop = () => {
            tick++;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const scene = this.currentFilm?.scenes[this.currentSceneIdx];
            if (scene) {
                if (scene.svgType === 'ocean_evaporation') {
                    this.drawEvaporationScene(ctx, canvas.width, canvas.height, tick);
                } else if (scene.svgType === 'clouds_condensation') {
                    this.drawCloudsScene(ctx, canvas.width, canvas.height, tick);
                } else if (scene.svgType === 'rain_mountains') {
                    this.drawRainScene(ctx, canvas.width, canvas.height, tick);
                } else if (scene.svgType.startsWith('arabic_')) {
                    this.drawArabicLessonScene(ctx, canvas.width, canvas.height, tick, scene.svgType);
                } else if (scene.svgType === 'plane_forces' || scene.svgType === 'airfoil_stream' || scene.svgType === 'plane_cruising') {
                    this.drawPlaneScene(ctx, canvas.width, canvas.height, tick, scene.svgType);
                } else {
                    this.drawGenericScene(ctx, canvas.width, canvas.height, tick);
                }
            }

            this.animFrameId = requestAnimationFrame(loop);
        };

        loop();
    }

    // Canvas Scenes:
    drawEvaporationScene(ctx, w, h, tick) {
        // Ocean & Sun
        const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
        skyGrad.addColorStop(0, '#fdcb6e');
        skyGrad.addColorStop(0.5, '#e17055');
        skyGrad.addColorStop(1, '#0984e3');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, w, h);

        // Radiant Sun
        ctx.beginPath();
        ctx.arc(w / 2, 90, 45, 0, Math.PI * 2);
        ctx.fillStyle = '#ffeaa7';
        ctx.shadowColor = '#ffeaa7';
        ctx.shadowBlur = 30;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Sea waves
        ctx.fillStyle = '#0984e3';
        ctx.beginPath();
        ctx.moveTo(0, h * 0.7);
        for (let x = 0; x <= w; x += 20) {
            const waveY = h * 0.7 + Math.sin((x + tick * 2) * 0.03) * 12;
            ctx.lineTo(x, waveY);
        }
        ctx.lineTo(w, h);
        ctx.lineTo(0, h);
        ctx.fill();

        // Rising vapor particles
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        this.particles.forEach(p => {
            p.y -= p.speed * 0.8;
            if (p.y < 80) p.y = h * 0.7 + Math.random() * 40;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    drawCloudsScene(ctx, w, h, tick) {
        const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
        bgGrad.addColorStop(0, '#74b9ff');
        bgGrad.addColorStop(1, '#a29bfe');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        // Drifting Clouds
        const drawCloud = (cx, cy, scale) => {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.beginPath();
            ctx.arc(cx, cy, 35 * scale, 0, Math.PI * 2);
            ctx.arc(cx + 40 * scale, cy - 15 * scale, 45 * scale, 0, Math.PI * 2);
            ctx.arc(cx + 85 * scale, cy, 35 * scale, 0, Math.PI * 2);
            ctx.fill();
        };

        const cloudX1 = ((tick * 1.2) % (w + 200)) - 100;
        const cloudX2 = (((tick * 0.8) + 300) % (w + 200)) - 100;
        drawCloud(cloudX1, 120, 1.2);
        drawCloud(cloudX2, 200, 0.9);
    }

    drawRainScene(ctx, w, h, tick) {
        ctx.fillStyle = '#2d3436';
        ctx.fillRect(0, 0, w, h);

        // Dark cloud top
        ctx.fillStyle = '#636e72';
        ctx.fillRect(0, 0, w, 80);

        // Rain drops falling
        ctx.strokeStyle = '#74b9ff';
        ctx.lineWidth = 2;
        this.particles.forEach(p => {
            p.y += p.speed * 3;
            if (p.y > h) {
                p.y = 80;
                p.x = Math.random() * w;
            }
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x - 2, p.y + 16);
            ctx.stroke();
        });

        // Green mountains
        ctx.fillStyle = '#00b894';
        ctx.beginPath();
        ctx.moveTo(0, h);
        ctx.lineTo(w * 0.35, h - 140);
        ctx.lineTo(w * 0.7, h);
        ctx.lineTo(w, h - 110);
        ctx.lineTo(w, h);
        ctx.fill();
    }

    drawPlaneScene(ctx, w, h, tick, type) {
        // Sky
        const sky = ctx.createLinearGradient(0, 0, 0, h);
        sky.addColorStop(0, '#0984e3');
        sky.addColorStop(1, '#81ecec');
        ctx.fillStyle = sky;
        ctx.fillRect(0, 0, w, h);

        // Airflow streamlines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 2;
        for (let y = 80; y <= h - 80; y += 45) {
            ctx.beginPath();
            const offset = (tick * 8) % 100;
            ctx.moveTo(0, y);
            for (let x = 0; x < w; x += 40) {
                const wave = Math.sin((x + offset) * 0.02) * 8;
                ctx.lineTo(x, y + wave);
            }
            ctx.stroke();
        }

        // Airplane in center
        const cx = w / 2;
        const cy = h / 2 + Math.sin(tick * 0.05) * 8;

        // Plane Body
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.ellipse(cx, cy, 90, 24, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#0984e3';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Wings
        ctx.fillStyle = '#dfe6e9';
        ctx.beginPath();
        ctx.moveTo(cx - 20, cy);
        ctx.lineTo(cx - 60, cy - 65);
        ctx.lineTo(cx - 20, cy - 65);
        ctx.lineTo(cx + 15, cy);
        ctx.fill();

        // Forces vectors arrows
        const drawArrow = (fromX, fromY, toX, toY, color, label) => {
            ctx.strokeStyle = color;
            ctx.fillStyle = color;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(fromX, fromY);
            ctx.lineTo(toX, toY);
            ctx.stroke();

            ctx.font = 'bold 13px Cairo, sans-serif';
            ctx.fillText(label, toX + 5, toY + 5);
        };

        drawArrow(cx, cy - 25, cx, cy - 90, '#e74c3c', 'قوة الرفع ⬆️');
        drawArrow(cx, cy + 25, cx, cy + 90, '#2c3e50', 'الوزن (الجاذبية) ⬇️');
        drawArrow(cx + 80, cy, cx + 150, cy, '#27ae60', 'قوة الدفع ➡️');
        drawArrow(cx - 80, cy, cx - 140, cy, '#f39c12', 'مقاومة الهواء ⬅️');
    }

    drawArabicLessonScene(ctx, w, h, tick, type) {
        const scenes = {
            arabic_letters: {
                title: 'الحرف يتشكل بحسب موقعه',
                items: [
                    { value: 'ب', label: 'منفصل', color: '#0b7285' },
                    { value: 'بـ', label: 'أول الكلمة', color: '#2a9d8f' },
                    { value: 'ـبـ', label: 'وسط الكلمة', color: '#e76f51' },
                    { value: 'ـب', label: 'آخر الكلمة', color: '#d99a24' }
                ],
                footer: 'بَاب  •  بُسْتان  •  حَبْل'
            },
            arabic_vowels: {
                title: 'الحركات تغيّر صوت الكلمة',
                items: [
                    { value: 'كَتَبَ', label: 'فَتْحَة', color: '#0b7285' },
                    { value: 'كُتِبَ', label: 'ضَمَّة وكسرة', color: '#e76f51' },
                    { value: 'كْ', label: 'سُكُون', color: '#d99a24' }
                ],
                footer: 'نقرأ الحرف مع حركته لنفهم الكلمة'
            },
            arabic_root: {
                title: 'الجذر ك ت ب يبني عائلة كلمات',
                items: [
                    { value: 'كَتَبَ', label: 'فعل', color: '#0b7285' },
                    { value: 'كاتِب', label: 'اسم فاعل', color: '#2a9d8f' },
                    { value: 'مَكْتوب', label: 'اسم مفعول', color: '#e76f51' },
                    { value: 'مَكْتَبة', label: 'اسم مكان', color: '#d99a24' }
                ],
                footer: 'تتغير الصيغة ويبقى الجذر دليلاً على المعنى'
            },
            arabic_sentence: {
                title: 'تتعاون الكلمات لتكوين الجملة',
                items: [
                    { value: 'قرأَ', label: 'فعل', color: '#0b7285' },
                    { value: 'الطالبُ', label: 'فاعل مرفوع', color: '#2a9d8f' },
                    { value: 'الدرسَ', label: 'مفعول به', color: '#e76f51' }
                ],
                footer: 'نسأل: ماذا حدث؟ من فعله؟ وعلى ماذا وقع؟'
            },
            arabic_punctuation: {
                title: 'علامات تنظّم القراءة',
                items: [
                    { value: '.', label: 'نقطة: نهاية فكرة', color: '#0b7285' },
                    { value: '،', label: 'فاصلة: وقفة قصيرة', color: '#2a9d8f' },
                    { value: '؟', label: 'استفهام: سؤال', color: '#e76f51' },
                    { value: ':', label: 'نقطتان: توضيح', color: '#d99a24' }
                ],
                footer: 'العلامة المناسبة تجعل المعنى أوضح'
            },
            arabic_nasikh: {
                title: 'الناسخ يغيّر حركة الخبر',
                items: [
                    { value: 'الحديقةُ', label: 'اسم مرفوع', color: '#0b7285' },
                    { value: 'جميلةٌ', label: 'خبر مرفوع', color: '#2a9d8f' },
                    { value: 'جميلةً', label: 'خبر كان منصوب', color: '#e76f51' }
                ],
                footer: 'كان ترفع الاسم وتنصب الخبر، وإنّ تنصب الاسم وترفع الخبر'
            }
        };
        const lesson = scenes[type];
        if (!lesson) return this.drawGenericScene(ctx, w, h, tick);

        const background = ctx.createLinearGradient(0, 0, w, h);
        background.addColorStop(0, '#eff8f6');
        background.addColorStop(1, '#e6f1f7');
        ctx.fillStyle = background;
        ctx.fillRect(0, 0, w, h);

        ctx.direction = 'rtl';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#174c4a';
        ctx.font = 'bold 30px Cairo, sans-serif';
        ctx.fillText(lesson.title, w / 2, 62);

        const cardWidth = Math.min(190, (w - 100) / lesson.items.length - 16);
        const cardHeight = 170;
        const gap = 18;
        const totalWidth = lesson.items.length * cardWidth + (lesson.items.length - 1) * gap;
        const startX = (w - totalWidth) / 2;
        const activeIndex = Math.floor(tick / 45) % lesson.items.length;

        lesson.items.forEach((item, index) => {
            const x = startX + index * (cardWidth + gap);
            const y = 110 + Math.sin(tick / 18 + index) * 5;
            const isActive = index === activeIndex;
            ctx.fillStyle = isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.72)';
            ctx.strokeStyle = isActive ? item.color : 'rgba(23, 76, 74, 0.15)';
            ctx.lineWidth = isActive ? 4 : 2;
            ctx.beginPath();
            ctx.roundRect(x, y, cardWidth, cardHeight, 18);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = item.color;
            ctx.font = 'bold 46px Cairo, sans-serif';
            ctx.fillText(item.value, x + cardWidth / 2, y + 83);
            ctx.fillStyle = '#355b62';
            ctx.font = 'bold 19px Cairo, sans-serif';
            ctx.fillText(item.label, x + cardWidth / 2, y + 135);
        });

        ctx.fillStyle = '#355b62';
        ctx.font = 'bold 20px Cairo, sans-serif';
        ctx.fillText(lesson.footer, w / 2, h - 42);
    }

    drawGenericScene(ctx, w, h, tick) {
        ctx.fillStyle = '#2d3436';
        ctx.fillRect(0, 0, w, h);
    }

    togglePlay() {
        this.isPlaying = !this.isPlaying;
        const btn = document.getElementById('cinema-play-btn');
        if (btn) btn.innerHTML = this.isPlaying ? '⏸️ إيقاف مؤقت' : '▶️ تشغيل';

        clearInterval(this.playInterval);
        if (this.isPlaying) {
            this.playInterval = setInterval(() => {
                if (this.currentSceneIdx < this.currentFilm.scenes.length - 1) {
                    this.nextScene();
                } else {
                    this.isPlaying = false;
                    clearInterval(this.playInterval);
                    if (btn) btn.innerHTML = '▶️ تشغيل';
                }
            }, 8000);
        }
    }

    nextScene() {
        if (!this.currentFilm) return;
        if (this.currentSceneIdx < this.currentFilm.scenes.length - 1) {
            this.currentSceneIdx++;
            this.renderScene();
        }
    }

    prevScene() {
        if (!this.currentFilm) return;
        if (this.currentSceneIdx > 0) {
            this.currentSceneIdx--;
            this.renderScene();
        }
    }

    closeTheater() {
        this.isPlaying = false;
        clearInterval(this.playInterval);
        cancelAnimationFrame(this.animFrameId);
        if (this.speechSynth) this.speechSynth.cancel();

        document.getElementById('cinema-theater-view')?.classList.add('hidden');
        document.getElementById('films-overview')?.classList.remove('hidden');
    }
}

window.cinemaManager = new CinemaManager();
