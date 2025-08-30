# ⚡ Reaction Speed Game

A fast-paced browser-based mini-game where players click on randomly spawning targets before time runs out. Built with vanilla JavaScript, featuring smooth animations and progressive difficulty.

## 🎮 [Play Live Demo](https://your-netlify-url.netlify.app)

![Game Screenshot](https://via.placeholder.com/800x400/1e293b/ffffff?text=Reaction+Speed+Game)

## ✨ Features

- **Multiple Target Shapes** - Circles, squares, and triangles
- **Progressive Difficulty** - Faster spawning as you level up
- **Smooth Animations** - CSS-powered visual effects
- **Mobile Responsive** - Touch-friendly design
- **Local High Scores** - Persistent score tracking
- **Pause/Resume** - Take breaks when needed
- **Keyboard Controls** - Spacebar to start, Escape to pause

## 🎯 How to Play

1. Click **START GAME** to begin
2. Click the colored targets before they disappear
3. Each hit gives you points and bonus time
4. Missing targets reduces your time
5. Level up every 100 points for faster gameplay
6. Game ends when time runs out

## 🛠️ Tech Stack

- **HTML5** - Semantic structure
- **CSS3** - Animations and responsive design
- **Vanilla JavaScript** - Game logic and interactions
- **Tailwind CSS** - Utility-first styling
- **Font Awesome** - Icons

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/Algoraver22/lsoys_task.git

# Navigate to project directory
cd lsoys_task

# Open in browser
start index.html
```

## 📁 Project Structure

```
lsoys_task/
├── index.html          # Main game interface
├── styles.css          # Custom animations & responsive design
├── game.js            # Core game logic
└── README.md          # This file
```

## 🎮 Game Mechanics

- **Starting Time**: 5 seconds
- **Bonus Time**: +0.8s per successful hit (max 8s)
- **Time Penalty**: -0.3s for missed targets
- **Scoring**: Level × 10 points per hit
- **Level Up**: Every 100 points
- **Difficulty**: Faster spawning at higher levels

## 🎨 Key Features

### Animations
- Glowing title effect
- Target pulse animation
- Spawn effects with rotation
- Hit/miss feedback animations
- Score popup effects

### Responsive Design
- Mobile-optimized touch targets
- Tablet and phone breakpoints
- Scalable UI elements

## 🔧 Development

The game uses a class-based architecture with clean separation of concerns:

- **ReactionSpeedGame** - Main game class
- **Event-driven** - Keyboard and mouse interactions
- **Performance optimized** - Efficient DOM manipulation
- **Mobile-first** - Touch-friendly design

## 📱 Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
- Mobile browsers



## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - feel free to use this project for learning or personal use.

## 🎯 Future Enhancements

- [ ] Sound effects
- [ ] Power-ups system
- [ ] Multiplayer mode
- [ ] Achievement system
- [ ] Particle effects
- [ ] Different game modes

---

