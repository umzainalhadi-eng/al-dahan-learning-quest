// Storage Management with LocalStorage persistence - رياض اللغة العربية
class AppStorage {
    constructor() {
        this.STORAGE_KEY = 'riyadh_al_lugha_v2';
        this.data = this.loadData();
        this.normalizeData();
    }

    toDateKey(date) {
        const local = new Date(date);
        const offset = local.getTimezoneOffset() * 60000;
        return new Date(local.getTime() - offset).toISOString().slice(0, 10);
    }

    getLevelTitles() {
        return ["فارس مبتدئ", "باحث طموح", "فارس البيان", "عالم عبقري", "أسطورة الضاد ⭐"];
    }

    calculateLevel(points = 0) {
        return Math.max(1, Math.floor((Number(points) || 0) / 500) + 1);
    }

    calculateLevelTitle(level = 1) {
        const titles = this.getLevelTitles();
        return titles[Math.min(Number(level) - 1, titles.length - 1)] || titles[0];
    }

    normalizeStudent(student) {
        if (!student) return student;
        const points = Number(student.points || 0);
        const computedLevel = this.calculateLevel(points);
        student.level = Number(student.level || computedLevel);
        if (student.level < computedLevel) student.level = computedLevel;
        student.levelTitle = student.levelTitle || this.calculateLevelTitle(student.level);
        student.streak = Number(student.streak || 1);
        if (!Array.isArray(student.enthusiasmDays)) student.enthusiasmDays = [];
        if (!Array.isArray(student.badges)) student.badges = [];
        return student;
    }

    normalizeData() {
        if (!this.data) this.data = JSON.parse(JSON.stringify(INITIAL_DATA));
        if (!Array.isArray(this.data.students)) this.data.students = Array.isArray(INITIAL_DATA.students) ? [...INITIAL_DATA.students] : [];

        this.data.students = this.data.students.map(student => this.normalizeStudent(student));

        const fallbackUser = this.data.currentUser || this.data.students[0];
        this.data.currentUser = fallbackUser ? this.normalizeStudent({ ...fallbackUser }) : null;

        this.data.students = this.data.students.map(student => {
            if (student.id === this.data.currentUser?.id) return this.data.currentUser;
            return student;
        });

        this.data.weeklyActivitiesCatalog = this.getWeeklyActivities();
        this.data.gamesCatalog = this.getGames();
        this.data.stories = this.getStories();
        this.data.cinemaFilms = this.getCinemaFilms();

        const user = this.getCurrentUser();
        if (user) {
            user.level = this.calculateLevel(Number(user.points || 0));
            user.levelTitle = this.calculateLevelTitle(user.level);
            user.enthusiasmDays = Array.isArray(user.enthusiasmDays) ? user.enthusiasmDays : [];
            if (user.enthusiasmDays.length === 0) {
                user.enthusiasmDays = [this.toDateKey(new Date())];
                user.streak = 1;
            }
            if (!user.levelTitle) user.levelTitle = this.calculateLevelTitle(user.level);
        }
        this.saveData();
    }

    loadData() {
        const mergeById = (saved = [], defaults = []) => {
            const map = new Map((saved || []).map(item => [item.id, item]));
            const merged = [...(saved || [])];
            (defaults || []).forEach(item => {
                if (!map.has(item.id)) merged.push(item);
            });
            return merged;
        };

        try {
            const raw = localStorage.getItem(this.STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                const merged = {
                    ...INITIAL_DATA,
                    ...parsed,
                    weeklyActivitiesCatalog: mergeById(parsed.weeklyActivitiesCatalog || INITIAL_DATA.weeklyActivitiesCatalog, INITIAL_DATA.weeklyActivitiesCatalog),
                    gamesCatalog: mergeById(parsed.gamesCatalog || INITIAL_DATA.gamesCatalog, INITIAL_DATA.gamesCatalog)
                };
                return merged;
            }
        } catch (e) {
            console.error('Failed to load from storage, fallback to seed', e);
        }
        return JSON.parse(JSON.stringify(INITIAL_DATA));
    }

    saveData() {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.data));
        } catch (e) {
            console.error('Failed to save to storage', e);
        }
    }

    // Current User & Student Accounts
    getCurrentUser() {
        return this.data.currentUser || this.data.students[0];
    }

    setCurrentUser(studentId) {
        const found = this.data.students.find(s => s.id === studentId);
        if (found) {
            this.data.currentUser = found;
            this.saveData();
            return found;
        }
        return this.getCurrentUser();
    }

    getStudents(classId = null) {
        if (!this.data.students) this.data.students = INITIAL_DATA.students;
        if (classId) {
            return this.data.students.filter(s => s.classId === classId);
        }
        return this.data.students;
    }

    recordDailyEnthusiasm() {
        const user = this.getCurrentUser();
        if (!user) return 0;

        const set = new Set(Array.isArray(user.enthusiasmDays) ? user.enthusiasmDays : []);
        const todayKey = this.toDateKey(new Date());
        set.add(todayKey);

        const sortedDates = [...set].sort();
        let streak = 0;
        let cursor = new Date();

        while (sortedDates.includes(this.toDateKey(cursor))) {
            streak += 1;
            cursor.setDate(cursor.getDate() - 1);
        }

        user.enthusiasmDays = sortedDates;
        user.streak = Math.max(streak, Number(user.streak) || 1);
        user.level = this.calculateLevel(Number(user.points || 0));
        user.levelTitle = this.calculateLevelTitle(user.level);

        const idx = this.data.students.findIndex(s => s.id === user.id);
        if (idx !== -1) {
            this.data.students[idx] = { ...this.data.students[idx], ...user };
        }

        this.saveData();
        return user.streak;
    }

    addStudent(studentData) {
        if (!this.data.students) this.data.students = [];
        const newStudent = {
            id: 'std-' + Date.now(),
            name: studentData.name,
            username: studentData.username || 'std_' + Math.floor(Math.random() * 1000),
            avatar: studentData.avatar || '🦁',
            classId: studentData.classId || 'cls-5',
            className: studentData.className || 'الصف الخامس (أ)',
            points: 100,
            weeklyPoints: 0,
            streak: 1,
            badges: ['طالب جديد 🌟']
        };
        this.data.students.push(newStudent);
        this.saveData();
        return newStudent;
    }

    // Classes & Teachers System (Supervised by General Supervisor Moamen)
    getClasses() {
        return this.data.classes || INITIAL_DATA.classes;
    }

    getTeachers() {
        return this.data.teachers || INITIAL_DATA.teachers;
    }

    assignTeacherToClass(teacherId, classId) {
        const teacher = this.data.teachers.find(t => t.id === teacherId);
        const cls = this.data.classes.find(c => c.id === classId);
        if (teacher && cls) {
            teacher.assignedClassId = classId;
            teacher.assignedClassName = cls.name;
            cls.teacherName = teacher.name;
            this.saveData();
            return { teacher, cls };
        }
        return null;
    }

    addClass(name, teacherName = 'غير معين') {
        const newClass = {
            id: 'cls-' + Date.now(),
            name,
            teacherName,
            studentsCount: 0
        };
        this.data.classes.push(newClass);
        this.saveData();
        return newClass;
    }

    // Points and Rewards
    addPoints(points, reason = '') {
        this.ensureLeaderboardHistory();
        const user = this.getCurrentUser();
        user.points = (user.points || 0) + points;
        user.weeklyPoints = (user.weeklyPoints || 0) + points;
        user.monthlyPoints = (user.monthlyPoints || 0) + points;
        this.data.pointsHistory.push({
            studentId: user.id,
            points,
            reason,
            timestamp: new Date().toISOString()
        });
        
        // Check for level up: every 500 points
        const currentLevel = Math.floor(user.points / 500) + 1;
        let leveledUp = false;
        if (!user.level || currentLevel > user.level) {
            user.level = currentLevel;
            leveledUp = true;
            const titles = ["فارس مبتدئ", "باحث طموح", "فارس البيان", "عالم عبقري", "أسطورة الضاد ⭐"];
            user.levelTitle = titles[Math.min(currentLevel - 1, titles.length - 1)];
        }

        // Also sync in students array
        const idx = this.data.students.findIndex(s => s.id === user.id);
        if (idx !== -1) {
            this.data.students[idx].points = user.points;
            this.data.students[idx].weeklyPoints = user.weeklyPoints;
            this.data.students[idx].monthlyPoints = user.monthlyPoints;
            this.data.students[idx].level = user.level;
            this.data.students[idx].levelTitle = user.levelTitle;
        }

        this.saveData();
        return { leveledUp, newLevel: user.level, newPoints: user.points };
    }

    addBadge(badge) {
        const user = this.getCurrentUser();
        if (!user.badges) user.badges = [];
        if (!user.badges.includes(badge)) {
            user.badges.push(badge);
            this.saveData();
            return true;
        }
        return false;
    }

    // 12 Ready Weekly Activities System (Chosen by Teacher Ali Dahan)
    getWeeklyActivities() {
        return window.BOOK_CURRICULUM?.activities || [];
    }

    getActiveWeeklyIndex() {
        const index = Number(this.data.activeWeeklyIndex) || 0;
        return index >= 0 && index < this.getWeeklyActivities().length ? index : 0;
    }

    getActiveWeeklyActivity() {
        const list = this.getWeeklyActivities();
        const idx = this.getActiveWeeklyIndex();
        return list[idx] || list[0];
    }

    setActiveWeeklyActivity(index) {
        const list = this.getWeeklyActivities();
        if (index >= 0 && index < list.length) {
            this.data.activeWeeklyIndex = index;
            this.saveData();
            return list[index];
        }
        return null;
    }

    submitWeeklyInteractive(result) {
        if (!this.data.weeklyLeaderboard) this.data.weeklyLeaderboard = [];
        const user = this.getCurrentUser();

        // Calculate score
        const total = result.score + (result.bonus || 0);

        const entry = {
            id: 'wlb-' + Date.now(),
            studentName: user.name,
            avatar: user.avatar || '🦁',
            className: user.className || 'الصف الخامس',
            score: result.score,
            bonus: result.bonus || 0,
            total: total,
            submissionDate: 'اليوم',
            teacherFeedback: 'إنجاز رائع ومتميز يا بطل في نشاط هذا الأسبوع! معتمد من أ. علي دحان.',
            creativeAnswer: result.creativeAnswer || '',
            rank: this.data.weeklyLeaderboard.length + 1
        };

        // If student already has entry, update it if higher
        const existingIdx = this.data.weeklyLeaderboard.findIndex(e => e.studentName === user.name);
        if (existingIdx !== -1) {
            if (total > this.data.weeklyLeaderboard[existingIdx].total) {
                this.data.weeklyLeaderboard[existingIdx] = entry;
            }
        } else {
            this.data.weeklyLeaderboard.push(entry);
        }

        // Sort by total desc
        this.data.weeklyLeaderboard.sort((a, b) => b.total - a.total);
        this.data.weeklyLeaderboard.forEach((e, idx) => e.rank = idx + 1);

        this.addPoints(total, 'النشاط الأسبوعي');
        this.addBadge(this.getActiveWeeklyActivity().badgeReward);
        this.saveData();
        return entry;
    }

    getWeeklyLeaderboard() {
        if (!this.data.weeklyLeaderboard) this.data.weeklyLeaderboard = INITIAL_DATA.weeklyLeaderboard;
        return this.data.weeklyLeaderboard.sort((a, b) => b.total - a.total);
    }

    // 100 Games Catalog
    getGames() {
        return window.BOOK_CURRICULUM?.games || [];
    }

    ensureArabicMediaContent() {
        if (this.data.arabicMediaRevision >= 4) return;
        const hasCurrentArabicContent = this.data.arabicMediaRevision >= 2;
        const savedStories = hasCurrentArabicContent && Array.isArray(this.data.stories)
            ? this.data.stories
            : INITIAL_DATA.stories;
        const savedFilms = hasCurrentArabicContent && Array.isArray(this.data.cinemaFilms)
            ? this.data.cinemaFilms
            : INITIAL_DATA.cinemaFilms;
        const mergeById = (saved, defaults) => {
            const ids = new Set(saved.map(item => item.id));
            return [...saved, ...defaults.filter(item => !ids.has(item.id))];
        };
        this.data.stories = mergeById(savedStories, [...INITIAL_DATA.stories, ...(window.WORKBOOK_STORIES || [])]);
        this.data.cinemaFilms = mergeById(savedFilms, [...INITIAL_DATA.cinemaFilms, ...(window.WORKBOOK_FILMS || [])]);
        this.data.arabicMediaRevision = 4;
        this.saveData();
    }

    getStories() {
        this.ensureArabicMediaContent();
        return window.BOOK_CURRICULUM?.stories || [];
    }

    getCinemaFilms() {
        this.ensureArabicMediaContent();
        return window.BOOK_CURRICULUM?.films || [];
    }

    ensureLeaderboardHistory() {
        if (this.data.leaderboardHistorySeeded) return;
        if (!Array.isArray(this.data.pointsHistory)) this.data.pointsHistory = [];
        const timestamp = new Date().toISOString();
        this.getStudents().forEach(student => {
            this.data.pointsHistory.push({
                studentId: student.id,
                points: student.weeklyPoints || 0,
                reason: 'الرصيد الافتتاحي',
                timestamp
            });
        });
        this.data.leaderboardHistorySeeded = true;
        this.saveData();
    }

    getLeaderboard(period = 'all') {
        const students = this.getStudents();
        if (period === 'all') {
            return students
                .map(student => ({ ...student, points: student.points || 0, badgesCount: student.badges?.length || 0 }))
                .sort((a, b) => b.points - a.points);
        }

        this.ensureLeaderboardHistory();
        const now = new Date();
        const cutoff = period === 'week'
            ? now.getTime() - 7 * 24 * 60 * 60 * 1000
            : new Date(now.getFullYear(), now.getMonth(), 1).getTime();
        const scores = new Map();
        this.data.pointsHistory.forEach(entry => {
            if (new Date(entry.timestamp).getTime() < cutoff) return;
            scores.set(entry.studentId, (scores.get(entry.studentId) || 0) + entry.points);
        });

        return students
            .map(student => ({ ...student, points: scores.get(student.id) || 0, badgesCount: student.badges?.length || 0 }))
            .sort((a, b) => b.points - a.points);
    }

    getStudentOfTheMonth() {
        const student = this.getLeaderboard('month')[0];
        if (!student) return null;
        return {
            ...student,
            month: new Intl.DateTimeFormat('ar', { month: 'long', year: 'numeric' }).format(new Date()),
            grade: student.className || 'طالب متميز',
            title: student.levelTitle || student.role || 'فارس اللغة العربية',
            totalPoints: student.points,
            completedActivities: student.badgesCount,
            claps: this.data.studentClaps?.[student.id] ?? student.claps ?? 140,
            teacherNote: 'نعتز باجتهادك في تعلم اللغة العربية ومثابرتك في كل تحدٍ.'
        };
    }

    incrementClaps() {
        const student = this.getStudentOfTheMonth();
        if (!student) return 0;
        if (!this.data.studentClaps) this.data.studentClaps = {};
        const claps = (this.data.studentClaps[student.id] ?? student.claps ?? 0) + 1;
        this.data.studentClaps[student.id] = claps;
        this.saveData();
        return claps;
    }

    getCompletedGames() {
        if (!Array.isArray(this.data.completedGames)) this.data.completedGames = [];
        return this.data.completedGames;
    }

    completeGame(gameId) {
        const completedGames = this.getCompletedGames();
        if (completedGames.includes(gameId)) return false;
        completedGames.push(gameId);
        this.saveData();
        return true;
    }

    // Reset to defaults
    resetAll() {
        localStorage.removeItem(this.STORAGE_KEY);
        this.data = JSON.parse(JSON.stringify(INITIAL_DATA));
        this.saveData();
    }
}

window.appStorage = new AppStorage();
