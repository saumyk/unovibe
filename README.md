# 🎮 UNO Card Game

A beautiful, interactive web-based UNO card game that you can play in your browser!

## 🚀 Quick Deploy to Vercel

### Method 1: Using Vercel CLI (Easiest)

1. **Install Vercel CLI** (if you haven't already):
   ```bash
   npm install -g vercel
   ```

2. **Navigate to your project folder**:
   ```bash
   cd C:\Users\saumy\Demos\uno-game
   ```

3. **Deploy to Vercel**:
   ```bash
   vercel
   ```
   
4. **Follow the prompts**:
   - Login to your Vercel account (it will open a browser)
   - Press Enter to accept default settings
   - Your game will be deployed! 🎉

### Method 2: Using Vercel Website

1. Go to [vercel.com](https://vercel.com)
2. Sign up or login
3. Click "Add New Project"
4. Click "Import Git Repository" OR drag and drop your `uno-game` folder
5. Click "Deploy"
6. Done! Your game is live! 🎉

## 📁 Project Structure

```
uno-game/
├── index.html      # Main HTML file (game structure)
├── style.css       # All styling and animations
├── game.js         # Game logic and rules
├── vercel.json     # Vercel configuration
└── README.md       # This file
```

## 🎯 How to Play

1. **Start the Game**: Click "Start Game" button
2. **Match Cards**: Click on cards in your hand that match the current card's color or number
3. **Draw Cards**: Click the deck to draw a card if you can't play
4. **Wild Cards**: Choose a color when you play a Wild or +4 card
5. **Win**: Get rid of all your cards to win!

## 🃏 Card Types

- **Number Cards (0-9)**: Match by color or number
- **Skip**: Skip the next player's turn
- **Reverse**: Reverse the direction of play
- **+2**: Next player draws 2 cards
- **Wild**: Change the color
- **+4**: Change color and next player draws 4 cards

## 🎨 Features

✅ Beautiful, modern design with gradients and animations  
✅ Fully responsive (works on mobile and desktop)  
✅ Smooth card animations and hover effects  
✅ Color picker for Wild cards  
✅ Real-time game statistics  
✅ Win detection  
✅ Easy to deploy on Vercel  

## 🛠️ Technologies Used

- **HTML5**: Structure
- **CSS3**: Styling with modern features (gradients, animations, flexbox)
- **Vanilla JavaScript**: Game logic (no frameworks needed!)
- **Google Fonts**: Outfit font family

## 💻 Local Development

To run locally, simply:

1. Open `index.html` in your web browser
2. Or use a local server:
   ```bash
   npx serve
   ```

## 🌐 After Deployment

Once deployed, Vercel will give you:
- A live URL (like `https://your-uno-game.vercel.app`)
- Automatic HTTPS
- Global CDN for fast loading
- Automatic deployments when you update files

## 📝 Notes for Beginners

- **No build process needed**: This is pure HTML/CSS/JS, so it deploys instantly
- **No dependencies**: No npm packages to install
- **No server required**: This is a static website
- **Free hosting**: Vercel's free tier is perfect for this project

## 🎮 Game Controls

- **Click cards** in your hand to play them
- **Click the deck** to draw a card
- **Click color buttons** when playing Wild cards
- **Start button** to begin a new game

## 🐛 Troubleshooting

**Game not loading?**
- Make sure all files are in the same folder
- Check browser console for errors (F12)

**Deployment issues?**
- Make sure `vercel.json` is in the root folder
- Ensure all files are uploaded

## 📄 License

Free to use and modify!

---

Made with ❤️ for UNO fans everywhere!
