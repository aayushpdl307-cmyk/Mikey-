// Shop System

class Shop {
    constructor() {
        this.items = [];
        this.inventory = StorageManager.get('inventory') || [];
        this.setupEventListeners();
        this.initializeItems();
        this.displayItems();
    }
    
    setupEventListeners() {
        document.querySelectorAll('.shop-tab').forEach(tab => {
            tab.addEventListener('click', (e) => this.switchCategory(e.target));
        });
    }
    
    initializeItems() {
        this.items = [
            // Power-ups
            { id: 1, name: 'Speed Boost', icon: '⚡', category: 'powerups', price: 50, description: '+50% WPM for 1 game', effect: 'speedBoost' },
            { id: 2, name: 'Focus Mode', icon: '🎯', category: 'powerups', price: 75, description: 'Hide incorrect characters', effect: 'focusMode' },
            { id: 3, name: 'Time Freeze', icon: '⏱️', category: 'powerups', price: 100, description: 'Pause timer for 5 seconds', effect: 'timeFreeze' },
            { id: 4, name: 'Double Coins', icon: '💰', category: 'powerups', price: 80, description: '2x coin earnings for 1 game', effect: 'doubleCoins' },
            
            // Skins
            { id: 5, name: 'Dark Matter', icon: '🌑', category: 'skins', price: 120, description: 'Premium dark theme', effect: 'darkSkin' },
            { id: 6, name: 'Ocean Wave', icon: '🌊', category: 'skins', price: 120, description: 'Calming blue theme', effect: 'oceanSkin' },
            { id: 7, name: 'Fire Phoenix', icon: '🔥', category: 'skins', price: 150, description: 'Intense red/orange theme', effect: 'fireSkin' },
            { id: 8, name: 'Forest Green', icon: '🌲', category: 'skins', price: 120, description: 'Natural green theme', effect: 'forestSkin' },
            
            // Boosters
            { id: 9, name: 'Combo Multiplier', icon: '📈', category: 'boosters', price: 90, description: 'Increases combo rewards by 25%', effect: 'comboMultiplier', duration: 'permanent' },
            { id: 10, name: 'XP Booster', icon: '⭐', category: 'boosters', price: 100, description: '+50% XP gains for 7 days', effect: 'xpBooster', duration: '7 days' },
            { id: 11, name: 'Coin Multiplier', icon: '💸', category: 'boosters', price: 110, description: '+75% coin earnings for 7 days', effect: 'coinMultiplier', duration: '7 days' }
        ];
    }
    
    displayItems(category = 'powerups') {
        const shopItems = document.getElementById('shopItems');
        shopItems.innerHTML = '';
        
        const filteredItems = this.items.filter(item => item.category === category);
        const userData = StorageManager.get('userData') || { coins: 0 };
        document.getElementById('shopBalance').textContent = userData.coins;
        
        filteredItems.forEach(item => {
            const owned = this.inventory.includes(item.id);
            const html = `
                <div class="shop-item ${owned ? 'owned' : ''}">
                    <div class="shop-item-icon">${item.icon}</div>
                    <div class="shop-item-name">${item.name}</div>
                    <div class="shop-item-desc">${item.description}</div>
                    <div class="shop-item-price">💰 ${item.price}</div>
                    <button class="btn ${owned ? 'btn-secondary' : 'btn-primary'}" 
                            onclick="shop.purchaseItem(${item.id})" 
                            ${owned ? 'disabled' : ''}>
                        ${owned ? 'Owned' : 'Buy'}
                    </button>
                </div>
            `;
            shopItems.innerHTML += html;
        });
    }
    
    switchCategory(tab) {
        document.querySelectorAll('.shop-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.displayItems(tab.dataset.category);
    }
    
    purchaseItem(itemId) {
        const item = this.items.find(i => i.id === itemId);
        if (!item) return;
        
        const userData = StorageManager.get('userData') || { coins: 0 };
        
        if (userData.coins < item.price) {
            Notification.error('Not enough coins!');
            return;
        }
        
        if (this.inventory.includes(itemId)) {
            Notification.info('You already own this item!');
            return;
        }
        
        // Deduct coins
        userData.coins -= item.price;
        StorageManager.set('userData', userData);
        
        // Add to inventory
        this.inventory.push(itemId);
        StorageManager.set('inventory', this.inventory);
        
        // Update UI
        document.getElementById('coinCount').textContent = userData.coins;
        Notification.success(`Purchased ${item.name}!`);
        
        // Refresh display
        this.displayItems(document.querySelector('.shop-tab.active').dataset.category);
    }
}

const shop = new Shop();
