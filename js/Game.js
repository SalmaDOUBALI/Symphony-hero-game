import Player from './Player.js';
import Level from './Level.js';
import InputHandler from './InputHandler.js';
import Enemy from './Enemy.js';
import SoundManager from './SoundManager.js';
import Vector from './Vector.js';
import Particle from './Particle.js';

export default class Game {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.width = 800;
        this.height = 600;
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        this.input = new InputHandler();
        this.sound = new SoundManager();
        this.level = new Level(this.width, this.height);
        
        this.state = 'MENU'; 
        this.score = 0;
        this.targetScore = 10;
        this.hearts = 3;
        this.round = 1;

        this.entities = [];
        this.particles = [];
        this.enemies = [];
        
        this.setupUI();
    }

    setupUI() {
        const startBtn = document.getElementById('start-btn');
        const restartBtn = document.getElementById('restart-btn');

        startBtn.addEventListener('click', () => {
            this.sound.resume(); 
            this.startLevel(1);
        });

        restartBtn.addEventListener('click', () => {
            this.startLevel(1);
        });
    }

    startLevel(round) {
        this.round = round;
        this.level.init(round);
        this.player = new Player(100, 450);
        this.enemies = [];
        this.particles = [];
        this.score = 0;
        this.hearts = 3;
        
        if (round === 1) this.targetScore = 7;
        else this.targetScore = 10;

        this.updateUI('PLAY');
        this.sound.startMusic();
        
        if (this.spawnInterval) clearInterval(this.spawnInterval);
        this.spawnInterval = setInterval(() => this.spawnEnemy(), 2000);

        this.state = 'PLAY';
        this.loop();
    }

    spawnEnemy() {
        if (this.state !== 'PLAY') return;
        let x = Math.random() > 0.5 ? 0 : this.width;
        let y = Math.random() * this.height;
        this.enemies.push(new Enemy(x, y));
        this.sound.playEnemyNote(); 
    }

    update() {
        if (this.state !== 'PLAY') return;

        // Mise à jour Joueur
        const action = this.player.update(this.input, this.level.platforms);
        if (action === 'jump') this.sound.playJump();
        if (action === 'dash') this.sound.playDash();

        // Mise à jour Ennemis et Collisions
        this.enemies.forEach((enemy, index) => {
            enemy.update(this.player);
            
            let dist = Vector.dist(this.player.pos, enemy.pos);
            
            // --- LOGIQUE DE COLLISION FACILE ---
            if (this.player.isDashing) {
                // HITBOX GEANTE (60px) quand on attaque
                if (dist < 60) { 
                    this.enemies.splice(index, 1);
                    this.score++;
                    this.createExplosion(enemy.pos.x, enemy.pos.y, '#FFD700'); // Or
                    this.sound.playEnemyNote();
                    document.getElementById('score-val').innerText = this.score;

                    if (this.score >= this.targetScore) {
                        if (this.round === 1) this.startLevel(2);
                        else this.gameOver(true);
                    }
                }
            } else {
                // HITBOX NORMALE quand on est vulnérable
                if (dist < 30) {
                    this.enemies.splice(index, 1);
                    this.hearts--;
                    this.createExplosion(this.player.pos.x, this.player.pos.y, '#FF0000'); // Rouge
                    this.sound.playHit();
                    this.updateHearts();
                    
                    if (this.hearts <= 0) {
                        this.gameOver(false);
                    }
                }
            }
        });

        // Particules
        this.particles.forEach((p, i) => {
            p.update();
            if (p.life <= 0) this.particles.splice(i, 1);
        });
    }

    createExplosion(x, y, color) {
        for(let i=0; i<20; i++) {
            this.particles.push(new Particle(x, y, color));
        }
    }

    draw() {
        // Nettoyage de l'écran (Si ça manque, ça fait des traces ou écran noir)
        this.ctx.clearRect(0, 0, this.width, this.height);

        if (this.state === 'MENU') return;

        this.level.draw(this.ctx);
        
        this.particles.forEach(p => p.draw(this.ctx));
        this.player.draw(this.ctx);
        this.enemies.forEach(e => e.draw(this.ctx));
    }

    loop() {
        if (this.state !== 'PLAY') return;
        this.update();
        this.draw();
        requestAnimationFrame(() => this.loop());
    }

    updateHearts() {
        let h = '';
        for(let i=0; i<this.hearts; i++) h += '❤️';
        document.getElementById('hearts-container').innerText = h;
    }

    updateUI(state) {
        const menu = document.getElementById('main-menu');
        const hud = document.getElementById('hud');
        const go = document.getElementById('game-over');

        menu.classList.add('hidden');
        hud.classList.add('hidden');
        go.classList.add('hidden');

        if (state === 'MENU') menu.classList.remove('hidden');
        if (state === 'PLAY') hud.classList.remove('hidden');
        if (state === 'GAMEOVER') go.classList.remove('hidden');
    }

    gameOver(win) {
        this.state = 'GAMEOVER';
        clearInterval(this.spawnInterval);
        this.sound.stopMusic();
        this.updateUI('GAMEOVER');
        document.getElementById('go-title').innerText = win ? "YOU WON THE SYMPHONY!" : "GAME OVER";
    }
}