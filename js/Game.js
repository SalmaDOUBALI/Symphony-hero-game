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
        this.round = 1; // Niveau actuel

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
        this.player = new Player(100, 450); // Reset position joueur
        this.enemies = [];
        this.particles = [];
        this.score = 0;
        this.hearts = 3;
        
        // --- OBJECTIFS DE SCORE PAR NIVEAU ---
        if (round === 1) this.targetScore = 7;
        else if (round === 2) this.targetScore = 12; // Un peu plus long
        else if (round === 3) this.targetScore = 15; // Challenge final

        this.updateUI('PLAY');
        this.sound.startMusic();
        
        // Reset du spawner
        if (this.spawnInterval) clearInterval(this.spawnInterval);
        
        // Les ennemis arrivent plus vite aux niveaux supérieurs
        let spawnSpeed = 2000;
        if (round === 2) spawnSpeed = 1800;
        if (round === 3) spawnSpeed = 1500;

        this.spawnInterval = setInterval(() => this.spawnEnemy(), spawnSpeed);

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

        const action = this.player.update(this.input, this.level.platforms);
        if (action === 'jump') this.sound.playJump();
        if (action === 'dash') this.sound.playDash();

        this.enemies.forEach((enemy, index) => {
            enemy.update(this.player);
            
            let dist = Vector.dist(this.player.pos, enemy.pos);
            
            // --- LOGIQUE COLLISION ---
            if (this.player.isDashing) {
                // HITBOX ATTACK (LARGE)
                if (dist < 60) { 
                    this.enemies.splice(index, 1);
                    this.score++;
                    this.createExplosion(enemy.pos.x, enemy.pos.y, '#FFD700'); 
                    this.sound.playEnemyNote();
                    document.getElementById('score-val').innerText = this.score + " / " + this.targetScore;

                    // --- GESTION DES NIVEAUX ---
                    if (this.score >= this.targetScore) {
                        if (this.round === 1) {
                            this.levelTransition(2); // Go Niveau 2
                        } else if (this.round === 2) {
                            this.levelTransition(3); // Go Niveau 3
                        } else {
                            this.gameOver(true); // VICTOIRE FINALE
                        }
                    }
                }
            } else {
                // HITBOX DAMAGE (PETITE)
                if (dist < 30) {
                    this.enemies.splice(index, 1);
                    this.hearts--;
                    this.createExplosion(this.player.pos.x, this.player.pos.y, '#FF0000'); 
                    this.sound.playHit();
                    this.updateHearts();
                    
                    if (this.hearts <= 0) {
                        this.gameOver(false);
                    }
                }
            }
        });

        this.particles.forEach((p, i) => {
            p.update();
            if (p.life <= 0) this.particles.splice(i, 1);
        });
    }

    levelTransition(nextRound) {
        // Petite pause ou effet visuel avant de changer
        // Pour l'instant on change direct, mais on reset tout propre
        this.startLevel(nextRound);
    }

    createExplosion(x, y, color) {
        for(let i=0; i<20; i++) {
            this.particles.push(new Particle(x, y, color));
        }
    }

    draw() {
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

        if (state === 'MENU') {
            menu.classList.remove('hidden');
            document.querySelector('.title').innerText = "SYMPHONY HERO";
        }
        if (state === 'PLAY') {
            hud.classList.remove('hidden');
            document.getElementById('score-val').innerText = "0 / " + this.targetScore;
            this.updateHearts();
        }
        if (state === 'GAMEOVER') go.classList.remove('hidden');
    }

    gameOver(win) {
        this.state = 'GAMEOVER';
        clearInterval(this.spawnInterval);
        this.sound.stopMusic();
        this.updateUI('GAMEOVER');
        document.getElementById('go-title').innerText = win ? "SYMPHONY COMPLETE!" : "GAME OVER";
    }
}