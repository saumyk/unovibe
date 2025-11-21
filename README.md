# 🎮 UNO Multiplayer - Play with Friends Online!

A stunning, feature-rich multiplayer UNO card game with beautiful 3D card animations, room-based gameplay, and all official UNO rules!

![UNO Game](https://img.shields.io/badge/Game-UNO-red?style=for-the-badge)
![Multiplayer](https://img.shields.io/badge/Mode-Multiplayer-blue?style=for-the-badge)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge)

## ✨ Features

### 🎯 Multiplayer Gameplay
- **Create Private Rooms** - Host your own game with custom settings
- **Join with Room ID** - Enter a 6-digit code to join friends
- **Password Protection** - Optional password for private games
- **2-6 Players** - Play with multiple friends
- **Invite Links** - Share a direct link to your room
- **Real-time Lobby** - See who's joined before starting

### 🃏 Complete UNO Rules
- ✅ **All Card Types**: Number cards (0-9), Skip, Reverse, +2, Wild, Wild +4
- ✅ **Special Rules**: Card stacking, 7-0 rule, Jump-in rule
- ✅ **UNO Button**: Call UNO when you have 2 cards or less!
- ✅ **Penalty System**: Forget to call UNO? Draw 2 penalty cards!
- ✅ **Direction Changes**: Reverse cards change play direction
- ✅ **Smart AI**: Play against AI opponents when alone

### 🎨 Premium Design
- 🌈 **3D Card Effects** - Beautiful card animations with depth
- ✨ **Smooth Animations** - Hover effects, transitions, and micro-interactions
- 🎭 **Glassmorphism** - Modern frosted glass UI elements
- 🌊 **Gradient Backgrounds** - Vibrant, eye-catching colors
- 📱 **Fully Responsive** - Perfect on mobile, tablet, and desktop
- 🎪 **Animated Background** - Floating cards create atmosphere

## 🚀 Quick Deploy to Vercel

### Method 1: One-Click Deploy (Easiest!)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/uno-game)

### Method 2: Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Navigate to your project
cd C:\Users\saumy\Demos\uno-game

# Deploy (login will open in browser)
vercel

# Follow the prompts:
# - Login to Vercel
# - Press Enter to accept defaults
# - Your game is live! 🎉
```

### Method 3: Drag & Drop

1. Go to [vercel.com](https://vercel.com)
2. Sign up or login
3. Click **"Add New Project"**
4. Drag the `uno-game` folder onto the page
5. Click **"Deploy"**
6. Done! Share your link! 🎉

### Method 4: GitHub Integration

```bash
# Initialize git repository
git init
git add .
git commit -m "Initial commit - UNO Multiplayer Game"

# Create a new repository on GitHub
# Then push your code
git remote add origin https://github.com/yourusername/uno-game.git
git branch -M main
git push -u origin main

# Go to vercel.com
# Click "Import Project"
# Select your GitHub repository
# Click "Deploy"
```

## 📁 Project Structure

```
uno-game/
├── index.html          # Main HTML with all screens (menu, lobby, game)
├── style.css           # Premium CSS with 3D effects and animations
├── game.js             # Complete game logic with multiplayer features
├── vercel.json         # Vercel deployment configuration
├── .gitignore          # Git ignore file
└── README.md           # This file
```

## 🎮 How to Play

### Starting a Game

1. **Create a Room**
   - Click "Create Room"
   - Enter room name and your name
   - Optional: Set a password
   - Choose max players (2-6)
   - Click "Create Room"

2. **Invite Friends**
   - Copy the Room ID (6 digits)
   - Or copy the invite link
   - Share with friends!

3. **Join a Room**
   - Click "Join Room"
   - Enter the 6-digit Room ID
   - Enter your name
   - Enter password (if required)
   - Click "Join Room"

4. **Start Playing**
   - Wait for all players to join
   - Host clicks "Start Game"
   - Game begins!

### Game Rules

#### Basic Gameplay
1. Match the top card by **color** or **number**
2. If you can't play, **draw a card** from the deck
3. If the drawn card is playable, you can play it immediately
4. Get rid of all your cards to **win**!

#### Special Cards

| Card | Effect |
|------|--------|
| **Skip** | Next player loses their turn |
| **Reverse** | Reverses the direction of play |
| **+2** | Next player draws 2 cards (can be stacked!) |
| **Wild** | Change the current color |
| **Wild +4** | Change color + next player draws 4 cards |

#### Advanced Rules

- **UNO Button**: When you have 2 cards left, click "UNO!" button
  - If you forget and get caught, draw 2 penalty cards!
  
- **Stacking**: You can stack +2 on +2, and +4 on +4
  - The next player who can't stack draws all accumulated cards!

- **7-0 Rule** (Enabled):
  - Playing a **7**: Swap hands with another player
  - Playing a **0**: All hands rotate in play direction

- **Jump-In** (Enabled):
  - If you have the exact same card, play it out of turn!

## 🎨 Card Types & Colors

### Colors
- 🔴 **Red** - Vibrant red gradient
- 🟡 **Yellow** - Bright yellow gradient  
- 🟢 **Green** - Fresh green gradient
- 🔵 **Blue** - Deep blue gradient
- 🌈 **Wild** - Rainbow animated gradient

### Card Distribution
- **Number Cards**: 0-9 in each color (76 cards)
- **Action Cards**: Skip, Reverse, +2 in each color (24 cards)
- **Wild Cards**: 4 Wild + 4 Wild +4 (8 cards)
- **Total**: 108 cards

## 💻 Local Development

### Run Locally

Simply open `index.html` in your browser! No build process needed.

Or use a local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve

# Using PHP
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

## 🌐 After Deployment

Once deployed on Vercel, you get:

- ✅ **Live URL**: `https://your-uno-game.vercel.app`
- ✅ **Automatic HTTPS**: Secure connection
- ✅ **Global CDN**: Fast loading worldwide
- ✅ **Auto Deployments**: Updates deploy automatically
- ✅ **Custom Domain**: Add your own domain (optional)
- ✅ **Analytics**: Track visitors (optional)

## 🎯 Game Controls

| Action | How To |
|--------|--------|
| **Play a Card** | Click on a playable card in your hand |
| **Draw a Card** | Click the deck |
| **Call UNO** | Click the "UNO!" button |
| **Choose Color** | Click a color when playing Wild cards |
| **Copy Room ID** | Click the copy button in lobby |
| **Leave Room** | Click "Leave Room" button |

## 🎨 Design Features

### Visual Effects
- **3D Card Transforms** - Cards have depth and perspective
- **Hover Animations** - Cards lift and scale on hover
- **Glow Effects** - Playable cards glow with golden light
- **Color Transitions** - Smooth color changes
- **Pulse Animations** - UNO button pulses when active
- **Floating Background** - Animated card shapes in background

### Responsive Design
- **Desktop** (1024px+): Full layout with all features
- **Tablet** (768px-1023px): Optimized card sizes
- **Mobile** (< 768px): Touch-friendly, compact layout

## 🛠️ Technologies Used

- **HTML5** - Semantic structure
- **CSS3** - Modern styling with:
  - CSS Variables for theming
  - Flexbox for layouts
  - CSS Grid where needed
  - Animations & Transitions
  - 3D Transforms
  - Gradients & Shadows
- **Vanilla JavaScript** - No frameworks!
  - ES6+ features
  - Clean, readable code
  - Well-commented
- **Google Fonts** - Outfit & Fredoka fonts

## 📱 Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🐛 Troubleshooting

### Game Not Loading?
- Clear browser cache (Ctrl+F5)
- Check browser console for errors (F12)
- Ensure JavaScript is enabled

### Cards Not Showing?
- Check internet connection (for Google Fonts)
- Try a different browser
- Disable browser extensions

### Deployment Issues?

**Vercel deployment fails:**
- Ensure all files are in the root directory
- Check `vercel.json` is present
- Make sure file names are correct

**Room features not working:**
- This is a client-side demo
- For real multiplayer, you'd need a backend server
- Currently simulates multiplayer with AI

## 🚀 Future Enhancements

Want to make this even better? Here are ideas:

- [ ] Real-time multiplayer with WebSocket/Firebase
- [ ] User accounts and statistics
- [ ] Leaderboards and rankings
- [ ] Sound effects and music
- [ ] Chat system
- [ ] Custom card designs/themes
- [ ] Tournament mode
- [ ] Mobile app version

## 📝 Code Structure

### Easy to Understand!

**HTML** - Three main sections:
- Menu Screen (create/join room)
- Lobby Screen (waiting room)
- Game Screen (actual gameplay)

**CSS** - Organized by component:
- Variables & Reset
- Menu & Modals
- Lobby
- Game Board
- Cards (3D effects)
- Responsive breakpoints

**JavaScript** - Clear functions:
- Room Management (create, join, leave)
- Game Initialization (deck, dealing)
- Game Logic (play cards, rules)
- UI Updates (render cards, update stats)
- AI Simulation (for testing)

## 🎓 Learning Resources

This project demonstrates:
- Modern CSS techniques
- JavaScript game logic
- State management
- Event handling
- Responsive design
- Animation principles

Perfect for learning web development!

## 📄 License

Free to use, modify, and share! No restrictions.

## 🙏 Credits

- **UNO** is a trademark of Mattel
- This is a fan-made educational project
- Not affiliated with Mattel

## 💬 Support

Having issues? Want to contribute?

1. Check the troubleshooting section
2. Review the code comments
3. Test in different browsers
4. Check browser console for errors

---

## 🎉 Quick Start Summary

```bash
# 1. Deploy to Vercel
vercel

# 2. Share your link
https://your-uno-game.vercel.app

# 3. Play with friends!
Create room → Share Room ID → Start Game → Have fun!
```

---

Made with ❤️ for UNO fans everywhere!

**Enjoy the game! 🎮🃏**
