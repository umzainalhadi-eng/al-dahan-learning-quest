// Leaderboard, Hall of Fame & Student of the Month Module
class LeaderboardManager {
    constructor() {
        this.activeFilter = 'all';
        this.searchQuery = '';
    }

    init() {
        this.renderStudentOfTheMonth();
        this.renderLeaderboard();
        this.setupFilterButtons();
    }

    renderStudentOfTheMonth() {
        const student = window.appStorage.getStudentOfTheMonth();
        const container = document.getElementById('student-of-the-month-box');
        if (!container || !student) return;

        container.innerHTML = `
            <div class="gold-card-wrapper">
                <div class="gold-shimmer-effect"></div>
                <div class="som-header">
                    <span class="golden-crown-badge">👑 وسام العرش والقدوة</span>
                    <span class="som-period">${student.month}</span>
                </div>
                
                <div class="som-body">
                    <div class="som-avatar-wrap">
                        <div class="som-avatar-frame">
                            <span class="som-avatar">${student.avatar}</span>
                        </div>
                        <div class="som-grade">${student.grade}</div>
                    </div>

                    <div class="som-details">
                        <h2 class="som-name">${student.name}</h2>
                        <div class="som-title-tag">🌟 ${student.title}</div>
                        
                        <div class="som-metrics-row">
                            <div class="som-metric">
                                <span class="som-metric-val">✨ ${student.totalPoints}</span>
                                <span class="som-metric-lbl">نقطة ذهبية</span>
                            </div>
                            <div class="som-metric">
                                <span class="som-metric-val">🎯 ${student.completedActivities}</span>
                                <span class="som-metric-lbl">نشاط مكتمل</span>
                            </div>
                            <div class="som-metric">
                                <span class="som-metric-val" id="som-claps-count">👏 ${student.claps || 140}</span>
                                <span class="som-metric-lbl">تصفيق وتحية</span>
                            </div>
                        </div>

                        <div class="som-badges-strip">
                            ${student.badges.map(b => `<span class="som-mini-badge">${b}</span>`).join('')}
                        </div>

                        <div class="teacher-endorsement-quote">
                            <div class="teacher-quote-header">
                                <span class="teacher-icon">👨‍🏫</span>
                                <strong>كلمة المعلم أ. علي دحان:</strong>
                            </div>
                            <p class="teacher-quote-body">«${student.teacherNote}»</p>
                            <div class="teacher-signature">توقيع: أ. علي دحان ✍️</div>
                        </div>

                        <div class="som-action-buttons">
                            <button id="btn-clap-student" class="btn btn-gold btn-lg">
                                👏 أرسل تشجيع وتصفيق للبطل!
                            </button>
                            <button id="btn-view-certificate" class="btn btn-outline btn-lg">
                                📜 عرض وطباعة شهادة التفوق الرسمية
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Clap Event
        const clapBtn = document.getElementById('btn-clap-student');
        if (clapBtn) {
            clapBtn.addEventListener('click', () => {
                const newClaps = window.appStorage.incrementClaps();
                const clapsEl = document.getElementById('som-claps-count');
                if (clapsEl) clapsEl.textContent = `👏 ${newClaps}`;
                window.soundEngine.applause();
                window.confettiManager.burst(window.innerWidth / 2, window.innerHeight * 0.4, 60);

                clapBtn.classList.add('animate-bounce');
                setTimeout(() => clapBtn.classList.remove('animate-bounce'), 600);
            });
        }

        // View Certificate Event
        const certBtn = document.getElementById('btn-view-certificate');
        if (certBtn) {
            certBtn.addEventListener('click', () => {
                this.showCertificateModal(student);
            });
        }
    }

    renderLeaderboard(filter = this.activeFilter) {
        this.activeFilter = filter;
        const board = window.appStorage.getLeaderboard(filter);
        const podiumContainer = document.getElementById('podium-container');
        const listContainer = document.getElementById('leaderboard-list-body');

        if (!podiumContainer || !listContainer) return;

        this.renderLeaderboardSummary(board);
        const query = this.searchQuery.toLocaleLowerCase('ar');
        const visibleBoard = query
            ? board.filter(item => `${item.name} ${item.className || ''} ${item.title || ''}`.toLocaleLowerCase('ar').includes(query))
            : board;

        // Podium for Top 3
        const top3 = board.slice(0, 3);
        podiumContainer.innerHTML = `
            <div class="podium-stage">
                <!-- 2nd Place -->
                ${top3[1] ? `
                    <div class="podium-step step-second">
                        <div class="step-avatar-box">
                            <span class="podium-rank-badge rank-2">2</span>
                            <span class="podium-avatar">${top3[1].avatar}</span>
                        </div>
                        <div class="podium-name">${top3[1].name}</div>
                        <div class="podium-points">${top3[1].points} نقطة</div>
                        <div class="podium-pillar pillar-2">🥈 المركز الثاني</div>
                    </div>
                ` : ''}

                <!-- 1st Place -->
                ${top3[0] ? `
                    <div class="podium-step step-first">
                        <div class="step-avatar-box">
                            <span class="podium-crown">👑</span>
                            <span class="podium-rank-badge rank-1">1</span>
                            <span class="podium-avatar">${top3[0].avatar}</span>
                        </div>
                        <div class="podium-name">${top3[0].name}</div>
                        <div class="podium-points">${top3[0].points} نقطة</div>
                        <div class="podium-pillar pillar-1">🥇 المركز الأول</div>
                    </div>
                ` : ''}

                <!-- 3rd Place -->
                ${top3[2] ? `
                    <div class="podium-step step-third">
                        <div class="step-avatar-box">
                            <span class="podium-rank-badge rank-3">3</span>
                            <span class="podium-avatar">${top3[2].avatar}</span>
                        </div>
                        <div class="podium-name">${top3[2].name}</div>
                        <div class="podium-points">${top3[2].points} نقطة</div>
                        <div class="podium-pillar pillar-3">🥉 المركز الثالث</div>
                    </div>
                ` : ''}
            </div>
        `;

        // Full searchable ranking
        listContainer.innerHTML = '';
        if (visibleBoard.length === 0) {
            listContainer.innerHTML = '<tr><td colspan="5" class="leaderboard-empty-state">لا توجد نتائج مطابقة للاسم.</td></tr>';
            return;
        }

        const maxPoints = Math.max(1, ...board.map(item => item.points));
        visibleBoard.forEach(item => {
            const rank = board.findIndex(entry => entry.id === item.id) + 1;
            const row = document.createElement('tr');
            const isMe = item.id === window.appStorage.getCurrentUser().id;
            if (isMe) row.className = 'current-user-row';

            row.innerHTML = `
                <td class="col-rank">
                    <span class="rank-number rank-${rank <= 3 ? rank : 'other'}">${rank}</span>
                </td>
                <td class="col-student">
                    <div class="student-info-flex">
                        <span class="table-avatar">${item.avatar}</span>
                        <div>
                            <div class="table-name font-bold">${item.name} ${isMe ? '<span class="badge-me">(أنت)</span>' : ''}</div>
                            <div class="table-title text-xs text-muted">${item.className || item.title || 'طالب متميز'}</div>
                        </div>
                    </div>
                </td>
                <td class="col-streak text-center">
                    <span class="streak-pill">🔥 ${item.streak || 1} يوم</span>
                </td>
                <td class="col-badges text-center">
                    <span class="badges-count-pill">🎖️ ${item.badgesCount} أوسمة</span>
                </td>
                <td class="col-points text-end">
                    <span class="points-text font-bold text-accent">${item.points.toLocaleString()}</span>
                    <span class="leaderboard-points-track" aria-hidden="true"><span style="width: ${(item.points / maxPoints) * 100}%"></span></span>
                </td>
            `;

            listContainer.appendChild(row);
        });
    }

    renderLeaderboardSummary(board) {
        const summary = document.getElementById('leaderboard-summary');
        if (!summary) return;
        const userId = window.appStorage.getCurrentUser().id;
        const userRank = board.findIndex(item => item.id === userId) + 1;
        const leader = board[0];
        summary.innerHTML = `
            <div class="leaderboard-summary-item">
                <span class="leaderboard-summary-label">المشاركون</span>
                <strong>${board.length} طالباً</strong>
            </div>
            <div class="leaderboard-summary-item">
                <span class="leaderboard-summary-label">المتصدر</span>
                <strong>${leader ? `${leader.avatar} ${leader.name}` : 'لا يوجد ترتيب بعد'}</strong>
            </div>
            <div class="leaderboard-summary-item is-current-rank">
                <span class="leaderboard-summary-label">مركزك</span>
                <strong>${userRank ? `#${userRank} من ${board.length}` : 'غير مدرج'}</strong>
            </div>
        `;
    }

    setupFilterButtons() {
        const filterBtns = document.querySelectorAll('.leaderboard-filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                window.soundEngine.click();
                this.renderLeaderboard(btn.dataset.filter);
            });
        });

        const searchInput = document.getElementById('leaderboard-search');
        if (searchInput) {
            searchInput.addEventListener('input', event => {
                this.searchQuery = event.target.value.trim();
                this.renderLeaderboard(this.activeFilter);
            });
        }
    }

    showCertificateModal(student) {
        let modal = document.getElementById('certificate-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'certificate-modal';
            modal.className = 'modal-backdrop';
            document.body.appendChild(modal);
        }

        modal.innerHTML = `
            <div class="modal-dialog cert-modal-card">
                <button class="modal-close-btn" id="btn-close-cert">&times;</button>
                <div class="certificate-frame" id="printable-certificate">
                    <div class="cert-border-outer">
                        <div class="cert-border-inner">
                            <div class="cert-header">
                                <div class="cert-logo-circle">🌟</div>
                                <h1 class="cert-main-title">شهادة تفوق وإلهام</h1>
                                <p class="cert-subtitle">تمنح للطالب المثالي لشهر ${student.month}</p>
                            </div>

                            <div class="cert-body">
                                <p class="cert-intro">يسر إدارة المنصة والمعلم أن يشهدوا بأن الطالب المبدع:</p>
                                <div class="cert-recipient-name">${student.name}</div>
                                <p class="cert-grade">${student.grade}</p>
                                <p class="cert-praise">
                                    قد استحق بجدارة لقب <strong>«طالب الشهر المثالي»</strong> تقديراً لشغفه العلمي، ومشاركته الفعالة في الأنشطة الأسبوعية، وحسن خلقه وروح المبادرة المتميزة.
                                </p>
                            </div>

                            <div class="cert-footer">
                                <div class="cert-signature-box">
                                    <div class="sig-title">معلم المادة ورائد النشاط</div>
                                    <div class="sig-name">أ. علي دحان</div>
                                    <div class="sig-mark">✍️ أ. علي دحان (معتمد)</div>
                                </div>
                                <div class="cert-seal-box">
                                    <div class="golden-seal">
                                        <span>ختم التميز</span>
                                        <span>⭐ 2026 ⭐</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="cert-actions-row">
                    <button class="btn btn-primary" onclick="window.print()">🖨️ طباعة الشهادة</button>
                    <button class="btn btn-outline" id="btn-dismiss-cert">إغلاق</button>
                </div>
            </div>
        `;

        modal.classList.remove('hidden');
        window.soundEngine.levelUp();

        const closeBtn = document.getElementById('btn-close-cert');
        const dismissBtn = document.getElementById('btn-dismiss-cert');
        const closeModal = () => modal.classList.add('hidden');

        if (closeBtn) closeBtn.onclick = closeModal;
        if (dismissBtn) dismissBtn.onclick = closeModal;
    }
}

window.leaderboardManager = new LeaderboardManager();
