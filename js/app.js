// Main Application Controller - رياض اللغة العربية (أ. علي دحان)
function ensureAppStorageBridge() {
    const key = 'riyadh_al_lugha_v2';
    const fallback = window.INITIAL_DATA || { students: [], currentUser: null };
    const seed = (() => {
        try {
            const raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : fallback;
        } catch (e) {
            return fallback;
        }
    })();

    const data = Array.isArray(seed.students) ? { ...fallback, ...seed } : { ...fallback };
    const getCurrentUser = () => data.currentUser || data.students[0] || null;
    const setCurrentUser = (studentId) => {
        const found = (data.students || []).find(s => s.id === studentId);
        if (found) data.currentUser = found;
        return getCurrentUser();
    };
    const save = () => { try { localStorage.setItem(key, JSON.stringify(data)); } catch (e) {} };
    const toDateKey = (date) => {
        const local = new Date(date);
        const offset = local.getTimezoneOffset() * 60000;
        return new Date(local.getTime() - offset).toISOString().slice(0, 10);
    };
    const calculateLevel = (points = 0) => Math.max(1, Math.floor((Number(points) || 0) / 500) + 1);
    const calculateLevelTitle = (level = 1) => {
        const titles = ['فارس مبتدئ', 'باحث طموح', 'فارس البيان', 'عالم عبقري', 'أسطورة الضاد ⭐'];
        return titles[Math.min(Number(level) - 1, titles.length - 1)] || titles[0];
    };
    const normalizeStudent = (student) => {
        if (!student) return student;
        const points = Number(student.points || 0);
        const computedLevel = calculateLevel(points);
        student.level = Number(student.level || computedLevel);
        if (student.level < computedLevel) student.level = computedLevel;
        student.levelTitle = student.levelTitle || calculateLevelTitle(student.level);
        student.streak = Number(student.streak || 1);
        if (!Array.isArray(student.enthusiasmDays)) student.enthusiasmDays = [];
        if (!Array.isArray(student.badges)) student.badges = [];
        return student;
    };
    const normalize = () => {
        if (!Array.isArray(data.students)) data.students = Array.isArray(fallback.students) ? fallback.students.slice() : [];
        data.students = data.students.map(normalizeStudent);
        const user = data.currentUser ? normalizeStudent(data.currentUser) : data.students[0];
        data.currentUser = user || null;
        if (user && (!Array.isArray(user.enthusiasmDays) || user.enthusiasmDays.length === 0)) {
            user.enthusiasmDays = [toDateKey(new Date())];
            user.streak = 1;
        }
        save();
    };

    const recordDailyEnthusiasm = () => {
        const user = getCurrentUser();
        if (!user) return 0;
        const set = new Set(Array.isArray(user.enthusiasmDays) ? user.enthusiasmDays : []);
        const todayKey = toDateKey(new Date());
        set.add(todayKey);
        const sortedDates = [...set].sort();
        let streak = 0;
        let cursor = new Date();
        while (sortedDates.includes(toDateKey(cursor))) {
            streak += 1;
            cursor.setDate(cursor.getDate() - 1);
        }
        user.enthusiasmDays = sortedDates;
        user.streak = Math.max(streak, Number(user.streak) || 1);
        user.level = calculateLevel(Number(user.points || 0));
        user.levelTitle = calculateLevelTitle(user.level);
        save();
        return user.streak;
    };

    const hasRequiredStorageApi = !!window.appStorage &&
        typeof window.appStorage.getCurrentUser === 'function' &&
        typeof window.appStorage.setCurrentUser === 'function' &&
        typeof window.appStorage.recordDailyEnthusiasm === 'function';

    if (!hasRequiredStorageApi) {
        normalize();
        window.appStorage = {
            STORAGE_KEY: key,
            data,
            getCurrentUser,
            setCurrentUser,
            recordDailyEnthusiasm,
            getStudentOfTheMonth() {
                const list = (data.students || []).slice().sort((a, b) => (b.points || 0) - (a.points || 0));
                const student = list[0] || null;
                if (!student) return null;
                return {
                    ...student,
                    month: new Intl.DateTimeFormat('ar', { month: 'long', year: 'numeric' }).format(new Date()),
                    grade: student.className || 'طالب متميز',
                    title: student.levelTitle || student.role || 'فارس اللغة العربية',
                    totalPoints: student.points || 0,
                    completedActivities: student.badges?.length || 0,
                    claps: student.claps || 140,
                    teacherNote: 'نعتز باجتهادك في تعلم اللغة العربية ومثابرتك في كل تحدٍ.'
                };
            },
            getLeaderboard(period = 'all') {
                const students = (data.students || []).slice().sort((a, b) => (b.points || 0) - (a.points || 0));
                return period === 'all' ? students : students;
            },
            getWeeklyActivities() { return data.weeklyActivitiesCatalog || (window.INITIAL_DATA && window.INITIAL_DATA.weeklyActivitiesCatalog) || []; },
            getActiveWeeklyActivity() { return this.getWeeklyActivities()[0] || null; },
            getWeeklyLeaderboard() { return []; },
            getGames() { return data.gamesCatalog || (window.INITIAL_DATA && window.INITIAL_DATA.gamesCatalog) || []; },
            getStories() { return data.stories || (window.INITIAL_DATA && window.INITIAL_DATA.stories) || []; },
            getCinemaFilms() { return data.cinemaFilms || (window.INITIAL_DATA && window.INITIAL_DATA.cinemaFilms) || []; },
            getClasses() { return data.classes || (window.INITIAL_DATA && window.INITIAL_DATA.classes) || []; },
            getTeachers() { return data.teachers || (window.INITIAL_DATA && window.INITIAL_DATA.teachers) || []; },
            getCompletedGames() { return Array.isArray(data.completedGames) ? data.completedGames : []; },
            completeGame(gameId) { if (!Array.isArray(data.completedGames)) data.completedGames = []; if (data.completedGames.includes(gameId)) return false; data.completedGames.push(gameId); save(); return true; },
            addPoints(points, reason = '') { const user = getCurrentUser(); if (!user) return { leveledUp: false, newLevel: 1, newPoints: 0 }; user.points = (user.points || 0) + points; user.level = calculateLevel(user.points); user.levelTitle = calculateLevelTitle(user.level); save(); return { leveledUp: true, newLevel: user.level, newPoints: user.points }; },
            addBadge(badge) { const user = getCurrentUser(); if (!user) return false; if (!user.badges) user.badges = []; if (!user.badges.includes(badge)) { user.badges.push(badge); save(); return true; } return false; },
            submitWeeklyInteractive(result) { return result; },
            incrementClaps() { return 1; },
            setActiveWeeklyActivity() { return null; },
            getActiveWeeklyIndex() { return 0; },
            ensureLeaderboardHistory() { return true; },
            resetAll() { localStorage.removeItem(key); Object.keys(data).forEach(k => delete data[k]); Object.assign(data, fallback); save(); }
        };
    }
}

ensureAppStorageBridge();

class App {
    constructor() {
        this.currentView = 'home';
    }

    init() {
        // Setup intro animation FIRST so skip/enter buttons are immediately active
        this.setupIntroAnimation();

        // Initialize submodules safely with try/catch isolation
        try { if (window.gamesManager) window.gamesManager.init(); } catch (e) { console.error('gamesManager init error', e); }
        try { if (window.storiesManager) window.storiesManager.init(); } catch (e) { console.error('storiesManager init error', e); }
        try { if (window.cinemaManager) window.cinemaManager.init(); } catch (e) { console.error('cinemaManager init error', e); }
        try { if (window.leaderboardManager) window.leaderboardManager.init(); } catch (e) { console.error('leaderboardManager init error', e); }
        try { if (window.teacherManager) window.teacherManager.init(); } catch (e) { console.error('teacherManager init error', e); }

        try { this.setupNavigation(); } catch (e) { console.error(e); }
        try { this.setupAvatarPicker(); } catch (e) { console.error(e); }
        try { this.setupSoundToggle(); } catch (e) { console.error(e); }
        try { if (window.appStorage && typeof window.appStorage.recordDailyEnthusiasm === 'function') window.appStorage.recordDailyEnthusiasm(); } catch (e) { console.error(e); }
        try { this.updateHeaderStats(); } catch (e) { console.error(e); }
        try { this.renderHomeSpotlight(); } catch (e) { console.error(e); }
        try { this.setupImageLightbox(); } catch (e) { console.error(e); }

        console.log('Riyadh Al-Lugha Al-Arabiyya Platform initialized successfully.');
    }

    setupIntroAnimation() {
        const intro = document.getElementById('intro-splash-screen');
        if (!intro) return;

        // Play gentle chime on intro display
        setTimeout(() => {
            if (window.soundEngine) window.soundEngine.coin();
        }, 600);

        // Sound fanfare on title reveal (at 1.4s)
        setTimeout(() => {
            if (window.soundEngine && intro && !intro.classList.contains('fade-out')) {
                window.soundEngine.levelUp();
            }
        }, 1500);

        // Global dismiss function accessible from anywhere
        window.closeIntro = (e) => {
            if (e && e.stopPropagation) e.stopPropagation();
            if (window.soundEngine) window.soundEngine.applause();
            if (window.confettiManager) {
                window.confettiManager.burst(window.innerWidth / 2, window.innerHeight * 0.4, 90);
            }
            intro.classList.add('fade-out');
            setTimeout(() => {
                intro.style.display = 'none';
            }, 500);
        };

        const enterBtn = document.getElementById('btn-intro-enter');
        const skipBtn = document.getElementById('btn-intro-skip');
        const skipBottomBtn = document.getElementById('btn-intro-skip-bottom');

        if (enterBtn) enterBtn.addEventListener('click', window.closeIntro);
        if (skipBtn) skipBtn.addEventListener('click', window.closeIntro);
        if (skipBottomBtn) skipBottomBtn.addEventListener('click', window.closeIntro);

        // Keyboard navigation: Escape or Space to skip
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
                window.closeIntro();
                document.removeEventListener('keydown', handleKeyDown);
            }
        };
        document.addEventListener('keydown', handleKeyDown);
    }

    replayIntro() {
        let intro = document.getElementById('intro-splash-screen');
        if (!intro) {
            location.reload();
            return;
        }
        intro.style.display = 'flex';
        intro.classList.remove('fade-out');
        this.setupIntroAnimation();
    }

    setupImageLightbox() {
        // Allow clicking on any gallery image to view in a modal (only on home gallery, NOT blocking intro)
        document.querySelectorAll('.gallery-thumb-box img').forEach(img => {
            img.addEventListener('click', (e) => {
                e.stopPropagation();
                this.openImageLightbox(img.src, img.alt || 'معرض رياض اللغة العربية');
            });
        });
    }

    openImageLightbox(src, caption) {
        let modal = document.getElementById('img-lightbox-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'img-lightbox-modal';
            modal.className = 'modal-backdrop';
            modal.style.zIndex = '200000';
            modal.innerHTML = `
                <div class="modal-dialog text-center" style="max-width: 800px; padding: 1.5rem; background: #0f172a; border: 2px solid #fbbf24;">
                    <button class="modal-close-btn" style="color: white;" onclick="document.getElementById('img-lightbox-modal').classList.add('hidden')">&times;</button>
                    <img id="lightbox-img-el" src="" style="max-width: 100%; max-height: 75vh; border-radius: 12px; object-fit: contain; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
                    <p id="lightbox-caption-el" class="text-white font-bold mt-3 text-lg"></p>
                </div>
            `;
            document.body.appendChild(modal);
            modal.addEventListener('click', (e) => {
                if (e.target === modal) modal.classList.add('hidden');
            });
        }
        document.getElementById('lightbox-img-el').src = src;
        document.getElementById('lightbox-caption-el').textContent = caption;
        modal.classList.remove('hidden');
        if (window.soundEngine) window.soundEngine.click();
    }

    renderHomeSpotlight() {
        const spot = document.getElementById('home-som-spotlight');
        if (spot && window.appStorage) {
            const student = window.appStorage.getStudentOfTheMonth();
            if (student) {
                spot.innerHTML = `
                    <div class="gold-card-wrapper" style="margin-bottom: 2rem; padding: 1.5rem;">
                        <div class="gold-shimmer-effect"></div>
                        <div class="flex justify-between items-center mb-2 flex-wrap gap-2">
                            <span class="golden-crown-badge">👑 وسام العرش والقدوة - طالب الشهر في رياض اللغة العربية</span>
                            <span class="som-period">${student.month}</span>
                        </div>
                        <div class="flex items-center gap-4 flex-wrap mt-3">
                            <div class="som-avatar-frame" style="width: 80px; height: 80px;">
                                <span style="font-size: 2.8rem;">${student.avatar}</span>
                            </div>
                            <div style="flex: 1; min-width: 200px;">
                                <h3 class="som-name" style="font-size: 1.5rem; margin-bottom: 0.1rem;">${student.name}</h3>
                                <div class="som-title-tag" style="margin-bottom: 0.5rem;">🌟 ${student.title} (${student.grade})</div>
                                <p class="text-sm italic" style="color: #78350f;">«${student.teacherNote}»</p>
                            </div>
                            <div class="flex gap-2">
                                <a href="leaderboard.html" class="btn btn-gold btn-sm">
                                    🏆 عرض لوحة الشرف والشهادة
                                </a>
                            </div>
                        </div>
                    </div>
                `;
            }
        }
    }

    setupNavigation() {
        // SPA buttons with data-view
        const navBtns = document.querySelectorAll('.nav-link-btn[data-view]');
        navBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetView = btn.dataset.view;
                if (document.getElementById(`view-${targetView}`)) {
                    e.preventDefault();
                    this.switchView(targetView);
                }
            });
        });

        // Quick jump buttons
        document.querySelectorAll('[data-jump-view]').forEach(el => {
            el.addEventListener('click', (e) => {
                const targetView = el.dataset.jumpView;
                if (document.getElementById(`view-${targetView}`)) {
                    e.preventDefault();
                    this.switchView(targetView);
                }
            });
        });

        // If URL has hash (e.g. #games, #weekly, #stories, #cinema, #leaderboard)
        if (window.location.hash) {
            const hashView = window.location.hash.replace('#', '');
            if (document.getElementById(`view-${hashView}`)) {
                this.switchView(hashView);
            }
        }
    }

    switchView(viewName) {
        window.soundEngine.click();
        this.currentView = viewName;
        window.location.hash = viewName;

        // Update active nav button
        document.querySelectorAll('.nav-link-btn').forEach(btn => {
            if (btn.dataset.view === viewName) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Hide all views, show targeted view
        document.querySelectorAll('.app-view-section').forEach(sec => {
            sec.classList.add('hidden');
        });

        const activeSec = document.getElementById(`view-${viewName}`);
        if (activeSec) {
            activeSec.classList.remove('hidden');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // Submodule specific view refreshes
        if (viewName === 'leaderboard') {
            if (window.leaderboardManager) {
                window.leaderboardManager.renderStudentOfTheMonth();
                window.leaderboardManager.renderLeaderboard();
            }
        } else if (viewName === 'weekly') {
            if (window.teacherManager) {
                window.teacherManager.renderWeeklyActivity();
            }
        } else if (viewName === 'games') {
            if (window.gamesManager) {
                const activeGameBtn = document.querySelector('.game-tab-btn.active');
                if (activeGameBtn) {
                    activeGameBtn.click();
                } else {
                    window.gamesManager.startQuiz();
                }
            }
        }
    }

    updateHeaderStats() {
        const user = window.appStorage.getCurrentUser();
        if (!user) return;

        const nameEl = document.getElementById('header-user-name');
        const avatarEl = document.getElementById('header-user-avatar');
        const pointsEl = document.getElementById('header-user-points');
        const levelEl = document.getElementById('header-user-level');
        const streakEl = document.getElementById('header-user-streak');
        const badgesCountEl = document.getElementById('header-user-badges-count');

        if (nameEl) nameEl.textContent = user.name;
        if (avatarEl) avatarEl.textContent = user.avatar;
        if (pointsEl) pointsEl.textContent = user.points.toLocaleString();
        if (levelEl) levelEl.textContent = `مستوى ${user.level} (${user.levelTitle})`;
        if (streakEl) streakEl.textContent = `${user.streak} يوم 🔥`;
        if (badgesCountEl) badgesCountEl.textContent = `${user.badges.length} أوسمة 🎖️`;
    }

    setupAvatarPicker() {
        const avatarTrigger = document.getElementById('header-user-avatar');
        const modal = document.getElementById('avatar-modal');
        const avatars = ['🦁', '🚀', '👩‍🔬', '🧑‍💻', '🎨', '⚡', '🏹', '✨', '👑', '🦉', '🔭', '🧭'];

        if (avatarTrigger && modal) {
            avatarTrigger.addEventListener('click', () => {
                modal.classList.remove('hidden');
                const list = document.getElementById('avatar-options-grid');
                if (list) {
                    list.innerHTML = avatars.map(av => `
                        <button class="avatar-option-btn ${av === window.appStorage.getCurrentUser().avatar ? 'selected' : ''}" data-avatar="${av}">
                            ${av}
                        </button>
                    `).join('');

                    list.querySelectorAll('.avatar-option-btn').forEach(btn => {
                        btn.addEventListener('click', () => {
                            const newAv = btn.dataset.avatar;
                            window.appStorage.updateCurrentUser({ avatar: newAv });
                            window.soundEngine.coin();
                            this.updateHeaderStats();
                            modal.classList.add('hidden');
                        });
                    });
                }
            });

            document.getElementById('btn-close-avatar-modal')?.addEventListener('click', () => {
                modal.classList.add('hidden');
            });
        }
    }

    setupSoundToggle() {
        const soundBtn = document.getElementById('btn-toggle-sound');
        if (soundBtn) {
            soundBtn.addEventListener('click', () => {
                const isEnabled = window.soundEngine.toggle();
                soundBtn.textContent = isEnabled ? '🔊' : '🔇';
                soundBtn.title = isEnabled ? 'كتم الصوت' : 'تشغيل الصوت';
            });
        }
    }
}

// Global emergency close intro function attached before DOMContentLoaded
window.closeIntro = function(e) {
    if (e && e.stopPropagation) e.stopPropagation();
    const intro = document.getElementById('intro-splash-screen');
    if (intro) {
        intro.classList.add('fade-out');
        setTimeout(() => { intro.style.display = 'none'; }, 400);
    }
};

window.app = new App();

document.addEventListener('DOMContentLoaded', () => {
    window.app.init();
});
