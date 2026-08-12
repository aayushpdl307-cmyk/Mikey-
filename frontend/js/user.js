// User Profile & Statistics

function updateStatistics() {
    const sessions = StorageManager.get('gameSessions') || [];
    
    if (sessions.length === 0) {
        document.getElementById('totalGames').textContent = '0';
        document.getElementById('avgWPM').textContent = '0';
        document.getElementById('bestWPM').textContent = '0';
        document.getElementById('avgAccuracy').textContent = '0%';
        document.getElementById('totalCoinsEarned').textContent = '0';
        document.getElementById('totalXP').textContent = '0';
        return;
    }
    
    const totalGames = sessions.length;
    const avgWPM = Math.round(sessions.reduce((sum, s) => sum + s.wpm, 0) / totalGames);
    const bestWPM = Math.max(...sessions.map(s => s.wpm));
    const avgAccuracy = Math.round(sessions.reduce((sum, s) => sum + s.accuracy, 0) / totalGames);
    const totalCoins = sessions.reduce((sum, s) => sum + s.coins, 0);
    const totalXP = sessions.reduce((sum, s) => sum + s.xp, 0);
    
    document.getElementById('totalGames').textContent = totalGames;
    document.getElementById('avgWPM').textContent = avgWPM;
    document.getElementById('bestWPM').textContent = bestWPM;
    document.getElementById('avgAccuracy').textContent = avgAccuracy + '%';
    document.getElementById('totalCoinsEarned').textContent = totalCoins;
    document.getElementById('totalXP').textContent = totalXP;
}

function loadProfile() {
    const userData = StorageManager.get('userData') || { coins: 0, xp: 0, level: 1 };
    const userEmail = StorageManager.get('userEmail') || 'user@example.com';
    const joinDate = StorageManager.get('joinDate') || new Date().toLocaleDateString();
    
    document.getElementById('profileUsername').textContent = userEmail.split('@')[0] || 'User';
    document.getElementById('profileLevel').textContent = `Level ${userData.level}`;
    document.getElementById('profileJoinDate').textContent = `Joined: ${joinDate}`;
    document.getElementById('emailInput').value = userEmail;
    
    document.getElementById('profileForm').onsubmit = (e) => {
        e.preventDefault();
        const bio = document.getElementById('bioInput').value;
        StorageManager.set('userBio', bio);
        Notification.success('Profile updated!');
    };
}

class Achievements {
    constructor() {
        this.achievements = [
            { id: 1, name: 'First Type', icon: '✍️', description: 'Complete your first game', unlocked: false },
            { id: 2, name: 'Speed Demon', icon: '⚡', description: 'Reach 100+ WPM', unlocked: false },
            { id: 3, name: 'Accuracy Master', icon: '🎯', description: 'Achieve 99% accuracy', unlocked: false },
            { id: 4, name: 'Coin Collector', icon: '💰', description: 'Earn 1000 coins', unlocked: false },
            { id: 5, name: 'Level Up', icon: '📈', description: 'Reach Level 5', unlocked: false },
            { id: 6, name: 'Combo King', icon: '👑', description: 'Reach 100 char combo', unlocked: false },
            { id: 7, name: 'Leaderboard', icon: '🏆', description: 'Get in top 10 leaderboard', unlocked: false },
            { id: 8, name: 'Shopaholic', icon: '🛍️', description: 'Purchase 5 items from shop', unlocked: false },
            { id: 9, name: 'Consistent', icon: '📊', description: 'Play 10 games', unlocked: false },
            { id: 10, name: 'Legend', icon: '⭐', description: 'Reach 150+ WPM', unlocked: false }
        ];
    }
    
    loadAchievements() {
        const container = document.getElementById('achievementsGrid');
        container.innerHTML = '';
        
        this.achievements.forEach(achievement => {
            const html = `
                <div class="achievement ${achievement.unlocked ? 'unlocked' : ''}">
                    <div class="achievement-icon">${achievement.icon}</div>
                    <div class="achievement-name">${achievement.name}</div>
                    <div class="achievement-desc">${achievement.description}</div>
                </div>
            `;
            container.innerHTML += html;
        });
    }
    
    unlockAchievement(id) {
        const achievement = this.achievements.find(a => a.id === id);
        if (achievement && !achievement.unlocked) {
            achievement.unlocked = true;
            Notification.success(`🎉 Achievement Unlocked: ${achievement.name}!`);
            StorageManager.set('achievements', this.achievements);
        }
    }
}

const achievements = new Achievements();
