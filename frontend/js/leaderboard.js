// Leaderboard System

class Leaderboard {
    constructor() {
        this.currentType = 'global';
        this.leaderboardData = {
            global: [
                { rank: 1, name: 'TypeMaster', wpm: 145, accuracy: 98, score: 8900, games: 156 },
                { rank: 2, name: 'SpeedDemon', wpm: 138, accuracy: 97, score: 8450, games: 142 },
                { rank: 3, name: 'FingerFlash', wpm: 132, accuracy: 96, score: 8100, games: 135 },
                { rank: 4, name: 'KeyStrokeKing', wpm: 125, accuracy: 95, score: 7800, games: 128 },
                { rank: 5, name: 'AccuracyAce', wpm: 118, accuracy: 99, score: 7500, games: 120 },
                { rank: 6, name: 'TypingTitan', wpm: 112, accuracy: 94, score: 7200, games: 115 },
                { rank: 7, name: 'VelocityViper', wpm: 108, accuracy: 93, score: 6900, games: 110 },
                { rank: 8, name: 'RapidReader', wpm: 102, accuracy: 92, score: 6600, games: 105 },
                { rank: 9, name: 'WordWizard', wpm: 98, accuracy: 91, score: 6300, games: 100 },
                { rank: 10, name: 'ChampionChars', wpm: 95, accuracy: 90, score: 6000, games: 95 }
            ],
            weekly: [
                { rank: 1, name: 'SpeedDemon', wpm: 142, accuracy: 97, score: 1250, games: 15 },
                { rank: 2, name: 'TypeMaster', wpm: 139, accuracy: 98, score: 1180, games: 14 },
                { rank: 3, name: 'KeyStrokeKing', wpm: 128, accuracy: 95, score: 950, games: 12 }
            ],
            daily: [
                { rank: 1, name: 'TypeMaster', wpm: 148, accuracy: 98, score: 320, games: 3 },
                { rank: 2, name: 'FingerFlash', wpm: 135, accuracy: 96, score: 280, games: 3 },
                { rank: 3, name: 'SpeedDemon', wpm: 140, accuracy: 97, score: 275, games: 2 }
            ]
        };
        
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        document.querySelectorAll('.lb-tab').forEach(tab => {
            tab.addEventListener('click', (e) => this.switchLeaderboard(e.target));
        });
    }
    
    switchLeaderboard(tab) {
        document.querySelectorAll('.lb-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.currentType = tab.dataset.type;
        this.loadLeaderboard(this.currentType);
    }
    
    loadLeaderboard(type) {
        const tbody = document.getElementById('leaderboardBody');
        tbody.innerHTML = '';
        
        const data = this.leaderboardData[type] || [];
        
        data.forEach((entry, index) => {
            const row = `
                <tr ${index === 0 ? 'style="background: linear-gradient(135deg, #ffd700, #ffed4e); font-weight: 600;"' : ''}>
                    <td>
                        <span class="rank-badge">${entry.rank}</span>
                    </td>
                    <td>${entry.name}</td>
                    <td>${entry.wpm}</td>
                    <td>${entry.accuracy}%</td>
                    <td>${entry.score}</td>
                    <td>${entry.games}</td>
                </tr>
            `;
            tbody.innerHTML += row;
        });
    }
}

const leaderboard = new Leaderboard();
