// Main Application Initialization

document.addEventListener('DOMContentLoaded', () => {
    // Load theme preference
    if (StorageManager.get('theme') === 'dark') {
        document.body.classList.add('dark-theme');
    }
    
    // Check authentication
    const token = StorageManager.get('token');
    if (!token) {
        showAuthModal();
    } else {
        game.loadUserData();
        updateStatistics();
        loadProfile();
        achievements.loadAchievements();
    }
    
    // Add keyboard shortcut animations
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            game.showSettings();
        }
    });
});

function showAuthModal() {
    const modal = document.getElementById('authModal');
    const form = document.getElementById('authForm');
    const toggle = document.getElementById('authToggle');
    let isLogin = true;
    
    form.onsubmit = async (e) => {
        e.preventDefault();
        const email = document.getElementById('authEmail').value;
        const password = document.getElementById('authPassword').value;
        const username = document.getElementById('authUsername').value;
        
        if (isLogin) {
            // Simulate login
            const token = 'token_' + Math.random().toString(36).substr(2, 9);
            StorageManager.set('token', token);
            StorageManager.set('userEmail', email);
            StorageManager.set('joinDate', new Date().toLocaleDateString());
            StorageManager.set('userData', { coins: 100, xp: 0, level: 1 });
            
            Notification.success('Login successful!');
            modal.classList.remove('active');
            game.loadUserData();
        } else {
            // Simulate signup
            const token = 'token_' + Math.random().toString(36).substr(2, 9);
            StorageManager.set('token', token);
            StorageManager.set('userEmail', email);
            StorageManager.set('joinDate', new Date().toLocaleDateString());
            StorageManager.set('userData', { coins: 100, xp: 0, level: 1 });
            
            Notification.success('Account created successfully!');
            modal.classList.remove('active');
            game.loadUserData();
        }
    };
    
    toggle.onclick = (e) => {
        e.preventDefault();
        isLogin = !isLogin;
        document.getElementById('authTitle').textContent = isLogin ? 'Login' : 'Sign Up';
        document.getElementById('authUsername').style.display = isLogin ? 'none' : 'block';
        document.querySelector('.auth-content button').textContent = isLogin ? 'Login' : 'Sign Up';
        toggle.innerHTML = isLogin ? `Don't have an account? <a href="#">Sign up</a>` : `Already have an account? <a href="#">Login</a>`;
    };
    
    modal.classList.add('active');
}

// Add CSS for animations
const style = document.createElement('style');
style.innerHTML = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    .page.active {
        animation: fadeIn 0.3s ease;
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);
