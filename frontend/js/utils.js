// Utility Functions

// Local Storage Manager
const StorageManager = {
    set: (key, value) => {
        localStorage.setItem(key, JSON.stringify(value));
    },
    get: (key) => {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    },
    remove: (key) => {
        localStorage.removeItem(key);
    },
    clear: () => {
        localStorage.clear();
    }
};

// API Call Wrapper
const API = {
    baseURL: 'http://localhost:5000/api',
    
    call: async (endpoint, method = 'GET', data = null) => {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${StorageManager.get('token')}`
            }
        };
        
        if (data) {
            options.body = JSON.stringify(data);
        }
        
        try {
            const response = await fetch(`${API.baseURL}${endpoint}`, options);
            
            if (response.status === 401) {
                StorageManager.remove('token');
                window.location.href = '/';
                return null;
            }
            
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            return null;
        }
    },
    
    get: (endpoint) => API.call(endpoint, 'GET'),
    post: (endpoint, data) => API.call(endpoint, 'POST', data),
    put: (endpoint, data) => API.call(endpoint, 'PUT', data),
    delete: (endpoint) => API.call(endpoint, 'DELETE')
};

// Notification System
const Notification = {
    show: (message, type = 'info') => {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#667eea'};
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 2000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    },
    
    success: (message) => Notification.show(message, 'success'),
    error: (message) => Notification.show(message, 'error'),
    info: (message) => Notification.show(message, 'info')
};

// Sound Manager
const SoundManager = {
    enabled: StorageManager.get('soundEnabled') !== false,
    
    play: (soundName) => {
        if (!SoundManager.enabled) return;
        
        // Placeholder for sound effects
        console.log('Playing sound:', soundName);
    },
    
    toggle: () => {
        SoundManager.enabled = !SoundManager.enabled;
        StorageManager.set('soundEnabled', SoundManager.enabled);
    }
};

// Word Lists for Different Difficulties
const WordLists = {
    easy: [
        'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i',
        'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at'
    ],
    normal: [
        'about', 'after', 'again', 'before', 'between', 'different', 'during',
        'example', 'following', 'general', 'information', 'language', 'method',
        'number', 'other', 'people', 'problem', 'process', 'product', 'program'
    ],
    hard: [
        'absolutely', 'achievement', 'acknowledge', 'administrator', 'agriculture',
        'architecture', 'assumption', 'atmosphere', 'availability', 'bibliography',
        'bureaucracy', 'calculation', 'category', 'characteristic', 'combination'
    ],
    extreme: [
        'ambidextrous', 'pseudonymous', 'onomatopoeia', 'antidisestablishmentarianism',
        'floccinaucinilicilification', 'incomprehensibility', 'serendipity',
        'sesquipedalian', 'pneumonoultramicroscopicsilicovolcanoconiosis', 'supercalifragilisticexpialidocious'
    ]
};

// Calculate WPM and Accuracy
const GameStats = {
    calculateWPM: (correctChars, timeInSeconds) => {
        const minutes = timeInSeconds / 60;
        const words = correctChars / 5; // Average word length is 5 characters
        return Math.round(words / minutes);
    },
    
    calculateAccuracy: (correctChars, totalChars) => {
        if (totalChars === 0) return 100;
        return Math.round((correctChars / totalChars) * 100);
    },
    
    calculateScore: (wpm, accuracy, timeBonus = 1) => {
        return Math.round(wpm * (accuracy / 100) * timeBonus);
    },
    
    calculateCoins: (wpm, accuracy, difficulty = 'normal') => {
        const baseCoins = 10;
        const difficultyMultiplier = {
            easy: 1,
            normal: 1.5,
            hard: 2,
            extreme: 3
        };
        const accuracyBonus = accuracy / 100;
        const wpmBonus = Math.floor(wpm / 10);
        
        return Math.round(
            (baseCoins + wpmBonus) * difficultyMultiplier[difficulty] * accuracyBonus
        );
    },
    
    calculateXP: (wpm, accuracy, difficulty = 'normal') => {
        const baseXP = 50;
        const difficultyMultiplier = {
            easy: 1,
            normal: 1.5,
            hard: 2,
            extreme: 3
        };
        
        return Math.round(baseXP * difficultyMultiplier[difficulty] * (accuracy / 100));
    }
};

// Timer Utility
const Timer = {
    interval: null,
    
    start: (duration, onTick, onComplete) => {
        let remaining = duration;
        
        Timer.interval = setInterval(() => {
            remaining--;
            onTick(remaining);
            
            if (remaining <= 0) {
                clearInterval(Timer.interval);
                onComplete();
            }
        }, 1000);
    },
    
    stop: () => {
        if (Timer.interval) {
            clearInterval(Timer.interval);
        }
    },
    
    reset: () => {
        Timer.stop();
        Timer.interval = null;
    }
};

// DOM Utilities
const DOM = {
    show: (element) => {
        if (typeof element === 'string') {
            element = document.getElementById(element);
        }
        if (element) element.style.display = 'block';
    },
    
    hide: (element) => {
        if (typeof element === 'string') {
            element = document.getElementById(element);
        }
        if (element) element.style.display = 'none';
    },
    
    toggle: (element) => {
        if (typeof element === 'string') {
            element = document.getElementById(element);
        }
        if (element) element.style.display = element.style.display === 'none' ? 'block' : 'none';
    },
    
    addClass: (element, className) => {
        if (typeof element === 'string') {
            element = document.getElementById(element);
        }
        if (element) element.classList.add(className);
    },
    
    removeClass: (element, className) => {
        if (typeof element === 'string') {
            element = document.getElementById(element);
        }
        if (element) element.classList.remove(className);
    },
    
    toggleClass: (element, className) => {
        if (typeof element === 'string') {
            element = document.getElementById(element);
        }
        if (element) element.classList.toggle(className);
    }
};

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { StorageManager, API, Notification, SoundManager, WordLists, GameStats, Timer, DOM };
}
