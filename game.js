// Main game class - keeps everything organized
class ReactionSpeedGame {
    constructor() {
        // Game state variables
        this.score = 0;
        this.level = 1;
        this.timeLeft = 5.0; // increased from 3 - was too hard!
        this.gameActive = false;
        this.isPaused = false;
        this.targets = []; // array to track all active targets
        this.gameTimer = null;
        this.spawnTimer = null;
        this.bestScore = localStorage.getItem('reactionSpeedBest') || 0; // persistent high score
        
        // Different target shapes and colors to keep it interesting
        this.targetTypes = ['circle', 'square', 'triangle'];
        this.colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b'];
        
        this.initializeElements();
        this.bindEvents();
        this.updateBestScore();
    }

    // Grab all the DOM elements we need - doing this once at startup
    initializeElements() {
        this.startScreen = document.getElementById('startScreen');
        this.gameScreen = document.getElementById('gameScreen');
        this.gameOverScreen = document.getElementById('gameOverScreen');
        this.pauseScreen = document.getElementById('pauseScreen');
        this.gameArea = document.getElementById('gameArea');
        this.scoreElement = document.getElementById('score');
        this.levelElement = document.getElementById('level');
        this.timerElement = document.getElementById('timer');
        this.finalScoreElement = document.getElementById('finalScore');
        this.bestScoreElement = document.getElementById('bestScore');
        this.newRecordElement = document.getElementById('newRecord');
        this.instructionElement = document.getElementById('instruction');
    }

    // Set up all the event listeners
    bindEvents() {
        document.getElementById('startBtn').addEventListener('click', () => this.startGame());
        document.getElementById('restartBtn').addEventListener('click', () => this.startGame());
        document.getElementById('menuBtn').addEventListener('click', () => this.showMenu());
        document.getElementById('pauseBtn').addEventListener('click', () => this.togglePause());
        document.getElementById('resumeBtn').addEventListener('click', () => this.togglePause());
        
        // Added keyboard shortcuts because why not?
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && !this.gameActive) {
                e.preventDefault();
                this.startGame();
            } else if (e.code === 'Escape' && this.gameActive) {
                this.togglePause();
            }
        });
    }

    // Reset everything and start a new game
    startGame() {
        this.score = 0;
        this.level = 1;
        this.timeLeft = 5.0;
        this.gameActive = true;
        this.isPaused = false;
        this.targets = []; // clear any leftover targets
        
        this.showScreen('gameScreen');
        this.updateUI();
        this.instructionElement.textContent = 'Get Ready...';
        
        // Give player a second to get ready
        setTimeout(() => {
            this.instructionElement.textContent = '';
            this.startGameLoop();
        }, 1000);
    }

    // Main game timer - runs every 100ms for smooth countdown
    startGameLoop() {
        this.gameTimer = setInterval(() => {
            if (!this.isPaused) {
                this.timeLeft -= 0.1;
                this.updateTimer();
                
                if (this.timeLeft <= 0) {
                    this.gameOver();
                }
            }
        }, 100);
        
        this.spawnTarget();
    }

    spawnTarget() {
        if (!this.gameActive || this.isPaused) return;
        
        const target = this.createTarget();
        this.targets.push(target);
        this.gameArea.appendChild(target);
        
        // Spawn targets faster as level increases, but not too crazy
        const spawnDelay = Math.max(800 - (this.level * 50), 300);
        this.spawnTimer = setTimeout(() => this.spawnTarget(), spawnDelay);
        
        // Auto-remove targets that aren't clicked in time
        setTimeout(() => {
            if (target.parentNode && !target.classList.contains('target-hit')) {
                this.missTarget(target);
            }
        }, Math.max(3000 - (this.level * 100), 1200)); // targets stay longer at first
    }

    // Create a new target with random properties
    createTarget() {
        const target = document.createElement('div');
        const type = this.targetTypes[Math.floor(Math.random() * this.targetTypes.length)];
        const size = Math.random() * 30 + 40; // random size between 40-70px
        
        target.className = `target target-spawn ${type}`;
        target.style.width = `${size}px`;
        target.style.height = `${size}px`;
        
        // Make sure targets don't spawn outside the game area
        const maxX = this.gameArea.offsetWidth - size;
        const maxY = this.gameArea.offsetHeight - size;
        target.style.left = `${Math.random() * maxX}px`;
        target.style.top = `${Math.random() * maxY}px`;
        
        // Triangles have fixed color, others get random colors
        if (type !== 'triangle') {
            const color = this.colors[Math.floor(Math.random() * this.colors.length)];
            target.style.background = `radial-gradient(circle, ${color}, ${this.darkenColor(color, 20)})`;
        }
        
        target.addEventListener('click', () => this.hitTarget(target));
        
        return target;
    }

    // Player successfully clicked a target!
    hitTarget(target) {
        if (!this.gameActive || this.isPaused || target.classList.contains('target-hit')) return; // ignore if already hit
        
        target.classList.add('target-hit');
        this.score += this.level * 10; // higher levels = more points
        this.timeLeft = Math.min(this.timeLeft + 0.8, 8.0); // reward with bonus time
        
        // Show that satisfying +points popup
        this.showScorePopup(target, `+${this.level * 10}`);
        
        // Level up system - every 100 points gets harder
        if (this.score > 0 && this.score % 100 === 0) {
            this.level++;
            this.showScorePopup(target, `LEVEL ${this.level}!`);
        }
        
        this.updateUI();
        
        setTimeout(() => {
            if (target.parentNode) {
                target.parentNode.removeChild(target);
            }
        }, 300);
    }

    // Target disappeared without being clicked - ouch!
    missTarget(target) {
        if (!target.parentNode) return;
        
        target.classList.add('target-miss');
        this.timeLeft -= 0.3; // punishment for missing
        
        setTimeout(() => {
            if (target.parentNode) {
                target.parentNode.removeChild(target);
            }
        }, 500);
    }

    showScorePopup(target, text) {
        const popup = document.createElement('div');
        popup.className = 'score-popup';
        popup.textContent = text;
        popup.style.left = target.style.left;
        popup.style.top = target.style.top;
        
        this.gameArea.appendChild(popup);
        
        setTimeout(() => {
            if (popup.parentNode) {
                popup.parentNode.removeChild(popup);
            }
        }, 1000);
    }

    togglePause() {
        if (!this.gameActive) return;
        
        this.isPaused = !this.isPaused;
        
        if (this.isPaused) {
            this.showScreen('pauseScreen');
        } else {
            this.showScreen('gameScreen');
        }
    }

    // Game ended - clean up and show results
    gameOver() {
        this.gameActive = false;
        clearInterval(this.gameTimer); // stop the main timer
        clearTimeout(this.spawnTimer); // stop spawning new targets
        
        // Remove any remaining targets from the screen
        this.targets.forEach(target => {
            if (target.parentNode) {
                target.parentNode.removeChild(target);
            }
        });
        this.targets = [];
        
        // Did we beat the high score? Always exciting!
        const isNewRecord = this.score > this.bestScore;
        if (isNewRecord) {
            this.bestScore = this.score;
            localStorage.setItem('reactionSpeedBest', this.bestScore);
            this.newRecordElement.classList.remove('hidden');
        } else {
            this.newRecordElement.classList.add('hidden');
        }
        
        this.finalScoreElement.textContent = this.score;
        this.updateBestScore();
        this.showScreen('gameOverScreen');
    }

    showMenu() {
        this.gameActive = false;
        this.isPaused = false;
        clearInterval(this.gameTimer);
        clearTimeout(this.spawnTimer);
        
        // Clear game area
        this.gameArea.innerHTML = '<div id="instruction" class="absolute inset-0 flex items-center justify-center text-white text-xl font-bold">Get Ready...</div>';
        this.instructionElement = document.getElementById('instruction');
        
        this.showScreen('startScreen');
    }

    showScreen(screenId) {
        const screens = ['startScreen', 'gameScreen', 'gameOverScreen', 'pauseScreen'];
        screens.forEach(screen => {
            document.getElementById(screen).classList.add('hidden');
        });
        document.getElementById(screenId).classList.remove('hidden');
    }

    updateUI() {
        this.scoreElement.textContent = this.score;
        this.levelElement.textContent = this.level;
    }

    updateTimer() {
        this.timerElement.textContent = this.timeLeft.toFixed(1);
        
        // Warning color when time is low
        if (this.timeLeft <= 1.0) {
            this.timerElement.classList.add('timer-warning');
        } else {
            this.timerElement.classList.remove('timer-warning');
        }
    }

    updateBestScore() {
        this.bestScoreElement.textContent = this.bestScore;
    }

    // Utility function to make colors darker - used for gradients
    darkenColor(color, percent) {
        const num = parseInt(color.replace("#", ""), 16); // convert hex to number
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) - amt;
        const G = (num >> 8 & 0x00FF) - amt;
        const B = (num & 0x0000FF) - amt;
        return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
    }
}

// Start everything up when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new ReactionSpeedGame(); // let's go!
});