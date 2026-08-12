// Game Core Logic

class TypingGame {
    constructor() {
        this.isRunning = false;
        this.currentText = '';
        this.userInput = '';
        this.startTime = null;
        this.difficulty = 'normal';
        this.timeLimit = 60;
        this.timeRemaining = 60;
        this.correctChars = 0;
        this.totalChars = 0;
        this.combo = 0;
        this.wpm = 0;
        this.accuracy = 100;
        this.gameResults = null;
        
        this.setupEventListeners();
        this.loadUserData();
    }
    
    setupEventListeners() {
        // Difficulty Selection
        document.querySelectorAll('.diff-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.selectDifficulty(e.target));
        });
        
        // Game Controls
        document.getElementById('startBtn').addEventListener('click', () => this.start());
        document.getElementById('resetBtn').addEventListener('click', () => this.reset());
        document.getElementById('quitBtn').addEventListener('click', () => this.quit());
        
        // Game Input
        document.getElementById('gameInput').addEventListener('input', (e) => this.handleInput(e));
        
        // Play Again & Back to Menu
        document.getElementById('playAgainBtn').addEventListener('click', () => this.start());
        document.getElementById('backToMenuBtn').addEventListener('click', () => this.hideGameOverModal());
        
        // Theme Toggle
        document.getElementById('themeToggle').addEventListener('click', () => this.toggleTheme());
        
        // Settings
        document.getElementById('settingsBtn').addEventListener('click', () => this.showSettings());
        document.getElementById('saveSettings').addEventListener('click', () => this.saveSettings());
        
        // Menu Navigation
        document.querySelectorAll('.menu-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchPage(e.target));
        });
        
        // Modal Close
        document.querySelectorAll('.close').forEach(closeBtn => {
            closeBtn.addEventListener('click', (e) => {
                e.target.closest('.modal').classList.remove('active');
            });
        });
        
        // Logout
        document.getElementById('logoutBtn').addEventListener('click', () => this.logout());
    }
    
    selectDifficulty(btn) {
        document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.difficulty = btn.dataset.difficulty;
        
        // Set time limit based on difficulty
        const timeLimits = { easy: 60, normal: 60, hard: 45, extreme: 30 };
        this.timeLimit = timeLimits[this.difficulty];
        this.timeRemaining = this.timeLimit;
        document.getElementById('timer').textContent = `${this.timeLimit}s`;
    }
    
    start() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.userInput = '';
        this.correctChars = 0;
        this.totalChars = 0;
        this.combo = 0;
        this.startTime = Date.now();
        
        // Generate random text
        this.generateText();
        
        // Update UI
        document.getElementById('startBtn').disabled = true;
        document.getElementById('startBtn').textContent = 'Game Running...';
        document.getElementById('resetBtn').disabled = false;
        document.getElementById('quitBtn').disabled = false;
        document.getElementById('gameInput').disabled = false;
        document.getElementById('gameInput').focus();
        document.querySelectorAll('.diff-btn').forEach(btn => btn.disabled = true);
        
        // Start timer
        Timer.start(this.timeLimit, (remaining) => {
            this.timeRemaining = remaining;
            document.getElementById('timer').textContent = `${remaining}s`;
        }, () => this.endGame());
        
        SoundManager.play('gameStart');
    }
    
    generateText() {
        const wordList = WordLists[this.difficulty];
        let text = '';
        for (let i = 0; i < 50; i++) {
            text += wordList[Math.floor(Math.random() * wordList.length)] + ' ';
        }
        this.currentText = text.trim();
        this.displayText();
    }
    
    displayText() {
        const display = document.getElementById('textDisplay');
        display.innerHTML = '';
        
        for (let i = 0; i < this.currentText.length; i++) {
            const span = document.createElement('span');
            span.className = 'char';
            span.textContent = this.currentText[i];
            
            if (i < this.userInput.length) {
                if (this.userInput[i] === this.currentText[i]) {
                    span.classList.add('correct');
                } else {
                    span.classList.add('incorrect');
                }
            } else if (i === this.userInput.length) {
                span.classList.add('current');
            }
            
            display.appendChild(span);
        }
    }
    
    handleInput(e) {
        if (!this.isRunning) return;
        
        this.userInput = e.target.value;
        this.updateStats();
        this.displayText();
    }
    
    updateStats() {
        const timeElapsed = (Date.now() - this.startTime) / 1000;
        
        // Calculate correct characters
        this.correctChars = 0;
        for (let i = 0; i < Math.min(this.userInput.length, this.currentText.length); i++) {
            if (this.userInput[i] === this.currentText[i]) {
                this.correctChars++;
            }
        }
        
        this.totalChars = this.userInput.length;
        
        // Calculate WPM
        if (timeElapsed > 0) {
            this.wpm = GameStats.calculateWPM(this.correctChars, timeElapsed);
        }
        
        // Calculate Accuracy
        this.accuracy = GameStats.calculateAccuracy(this.correctChars, this.totalChars);
        
        // Update Combo
        if (this.userInput.length > 0 && this.userInput[this.userInput.length - 1] === this.currentText[this.userInput.length - 1]) {
            this.combo++;
        } else if (this.userInput.length > 0) {
            this.combo = 0;
        }
        
        // Update UI
        document.getElementById('wpm').textContent = this.wpm;
        document.getElementById('accuracy').textContent = this.accuracy + '%';
        document.getElementById('combo').textContent = this.combo + 'x';
    }
    
    endGame() {
        this.isRunning = false;
        Timer.stop();
        
        // Calculate final stats
        const score = GameStats.calculateScore(this.wpm, this.accuracy);
        const coins = GameStats.calculateCoins(this.wpm, this.accuracy, this.difficulty);
        const xp = GameStats.calculateXP(this.wpm, this.accuracy, this.difficulty);
        
        // Store results
        this.gameResults = {
            wpm: this.wpm,
            accuracy: this.accuracy,
            score: score,
            coins: coins,
            xp: xp,
            difficulty: this.difficulty,
            timestamp: new Date().toISOString()
        };
        
        // Update user data
        this.updateUserData(coins, xp);
        
        // Save game session
        this.saveGameSession();
        
        // Show results
        this.showGameOverModal();
        
        SoundManager.play('gameEnd');
    }
    
    showGameOverModal() {
        const modal = document.getElementById('gameOverModal');
        document.getElementById('finalWPM').textContent = this.gameResults.wpm;
        document.getElementById('finalAccuracy').textContent = this.gameResults.accuracy + '%';
        document.getElementById('finalScore').textContent = this.gameResults.score;
        document.getElementById('finalCoins').textContent = this.gameResults.coins;
        
        modal.classList.add('active');
        Notification.success(`Great job! You earned ${this.gameResults.coins} coins!`);
    }
    
    hideGameOverModal() {
        document.getElementById('gameOverModal').classList.remove('active');
        this.reset();
    }
    
    reset() {
        Timer.reset();
        this.isRunning = false;
        this.userInput = '';
        this.correctChars = 0;
        this.totalChars = 0;
        this.combo = 0;
        this.wpm = 0;
        this.accuracy = 100;
        this.currentText = '';
        
        document.getElementById('gameInput').disabled = true;
        document.getElementById('gameInput').value = '';
        document.getElementById('startBtn').disabled = false;
        document.getElementById('startBtn').textContent = 'Start Game';
        document.getElementById('resetBtn').disabled = true;
        document.getElementById('quitBtn').disabled = true;
        document.querySelectorAll('.diff-btn').forEach(btn => btn.disabled = false);
        
        document.getElementById('wpm').textContent = '0';
        document.getElementById('accuracy').textContent = '100%';
        document.getElementById('combo').textContent = '0x';
        document.getElementById('timer').textContent = `${this.timeLimit}s`;
        document.getElementById('textDisplay').innerHTML = '<p>Click start to begin typing...</p>';
    }
    
    quit() {
        if (confirm('Are you sure you want to quit? Your progress will not be saved.')) {
            this.reset();
        }
    }
    
    toggleTheme() {
        document.body.classList.toggle('dark-theme');
        StorageManager.set('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
    }
    
    showSettings() {
        document.getElementById('settingsModal').classList.add('active');
    }
    
    saveSettings() {
        const soundEnabled = document.getElementById('soundToggle').checked;
        const wordSet = document.getElementById('wordSet').value;
        
        StorageManager.set('soundEnabled', soundEnabled);
        StorageManager.set('wordSet', wordSet);
        
        SoundManager.enabled = soundEnabled;
        Notification.success('Settings saved!');
        document.getElementById('settingsModal').classList.remove('active');
    }
    
    switchPage(btn) {
        document.querySelectorAll('.menu-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const page = btn.dataset.page;
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.getElementById(page + 'Page').classList.add('active');
        
        if (page === 'leaderboard') {
            leaderboard.loadLeaderboard('global');
        } else if (page === 'stats') {
            updateStatistics();
        } else if (page === 'achievements') {
            achievements.loadAchievements();
        } else if (page === 'profile') {
            loadProfile();
        }
    }
    
    loadUserData() {
        const userData = StorageManager.get('userData');
        if (userData) {
            document.getElementById('coinCount').textContent = userData.coins;
            document.getElementById('xpCount').textContent = userData.xp;
            document.getElementById('levelCount').textContent = userData.level;
        }
    }
    
    updateUserData(coins, xp) {
        let userData = StorageManager.get('userData') || { coins: 0, xp: 0, level: 1 };
        userData.coins += coins;
        userData.xp += xp;
        
        // Level up calculation
        const xpPerLevel = 1000;
        userData.level = Math.floor(userData.xp / xpPerLevel) + 1;
        
        StorageManager.set('userData', userData);
        this.loadUserData();
    }
    
    saveGameSession() {
        let sessions = StorageManager.get('gameSessions') || [];
        sessions.push(this.gameResults);
        StorageManager.set('gameSessions', sessions);
    }
    
    logout() {
        if (confirm('Are you sure you want to logout?')) {
            StorageManager.clear();
            window.location.reload();
        }
    }
}

// Initialize game
const game = new TypingGame();
