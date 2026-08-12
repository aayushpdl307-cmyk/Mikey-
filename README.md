# Typing Game 🎮

A feature-rich typing speed game with shop system, coin economy, level progression, scoring, and leaderboards.

## Features

✨ **Core Gameplay**
- Real-time typing challenges
- Multiple difficulty levels (Easy, Normal, Hard, Extreme)
- Speed progression system
- WPM (Words Per Minute) tracking
- Accuracy percentage calculation
- Combo system with multipliers

💰 **Economy System**
- Coin earnings from games
- Shop with purchasable items
- Power-ups and boosters
- Skin/theme purchases
- Daily rewards

📊 **Progression & Stats**
- Level system with XP
- User profiles with statistics
- Game history tracking
- Achievement system
- Leaderboard rankings (Global, Weekly, Daily)

🎯 **Additional Features**
- Sound effects (toggleable)
- Keyboard shortcuts
- Responsive design (Mobile-friendly)
- Dark/Light themes
- Settings & customization
- Statistics dashboard

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (or SQLite for local development)
- **Authentication**: JWT tokens

## Installation

### Prerequisites
- Node.js (v14+)
- MongoDB (or local SQLite)
- npm or yarn

### Setup

```bash
# Clone the repository
git clone https://github.com/aayushpdl307-cmyk/Mikey-.git
cd Mikey-

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Start the development server
npm run dev
```

## Project Structure

```
Mikey-/
├── frontend/
│   ├── index.html
│   ├── css/
│   │   ├── style.css
│   │   └── themes.css
│   └── js/
│       ├── game.js
│       ├── shop.js
│       ├── leaderboard.js
│       ├── user.js
│       └── utils.js
├── backend/
│   ├── server.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── game.js
│   │   ├── shop.js
│   │   ├── leaderboard.js
│   │   └── user.js
│   ├── models/
│   │   ├── User.js
│   │   ├── GameSession.js
│   │   ├── ShopItem.js
│   │   └── Leaderboard.js
│   ├── middleware/
│   │   └── auth.js
│   └── config/
│       └── database.js
├── package.json
├── .env.example
└── README.md
```

## Usage

1. **Sign Up / Login** - Create an account or log in
2. **Play Game** - Start typing the displayed text
3. **Earn Coins** - Based on WPM and accuracy
4. **Level Up** - Unlock new difficulties and features
5. **Visit Shop** - Purchase power-ups, skins, and boosters
6. **Check Leaderboard** - Compete with other players
7. **View Stats** - Track your progress over time

## Game Modes

- **Classic Mode**: Standard typing challenge
- **Timed Mode**: Race against the clock
- **Zen Mode**: No time limit, focus on accuracy
- **Challenge Mode**: Daily/Weekly challenges with rewards

## API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Game
- `POST /api/game/start` - Start a new game session
- `POST /api/game/end` - Submit game results
- `GET /api/game/stats` - Get user game statistics

### Shop
- `GET /api/shop/items` - Get all shop items
- `POST /api/shop/purchase` - Purchase an item
- `GET /api/shop/inventory` - Get user inventory

### Leaderboard
- `GET /api/leaderboard/global` - Global leaderboard
- `GET /api/leaderboard/weekly` - Weekly leaderboard
- `GET /api/leaderboard/daily` - Daily leaderboard

### User
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `GET /api/user/achievements` - Get user achievements

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Author

Created with ❤️ by aayushpdl307-cmyk
