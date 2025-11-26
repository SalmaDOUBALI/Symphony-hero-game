import Vector from './Vector.js';

export default class Player {
    constructor(x, y) {
        this.pos = new Vector(x, y);
        this.vel = new Vector(0, 0);
        this.acc = new Vector(0, 0);
        this.width = 30;
        this.height = 30;
        this.speed = 0.8;
        
        // SAUT RÉGLÉ PLUS HAUT
        this.jumpForce = 18; 
        this.grounded = false;
        
        // Dash
        this.canDash = true;
        this.isDashing = false;
        this.dashTimer = 0;
        this.dashCooldown = 0;

        // Couleurs
        this.normalColor = '#000'; 
        this.dashColor = '#00BFFF'; // DeepSkyBlue pour le dash
    }

    update(input, platforms) {
        // --- GESTION DU DASH ---
        if (this.isDashing) {
            this.vel.mult(0.96); 
            this.dashTimer--;
            
            if (this.dashTimer <= 0) {
                this.isDashing = false;
                this.vel.mult(0.5); 
            }
        } else {
            // --- MOUVEMENT NORMAL ---
            if (input.AxisX !== 0) {
                this.acc.x = input.AxisX * this.speed;
            } else {
                this.vel.x *= 0.8; 
            }
            
            this.acc.y = 0.6; // Gravité

            // Saut
            if (input.JumpPressed && this.grounded) {
                this.vel.y = -this.jumpForce;
                this.grounded = false;
                return 'jump';
            }

            // Dash
            if (input.DashPressed && this.canDash && this.dashCooldown <= 0) {
                this.startDash(input);
                return 'dash';
            }
        }

        // Physique
        this.vel.add(this.acc);
        this.vel.limit(this.isDashing ? 25 : 10); 
        this.pos.add(this.vel);
        this.acc.mult(0); 

        if (this.dashCooldown > 0) this.dashCooldown--;

        // Collisions
        this.grounded = false;
        platforms.forEach(p => this.resolvePlatformCollision(p));

        // Limites
        if (this.pos.x < 0) this.pos.x = 0;
        if (this.pos.x > 800 - this.width) this.pos.x = 800 - this.width;
        if (this.pos.y > 600) this.pos.y = 0; 
        
        return null;
    }

    startDash(input) {
        this.isDashing = true;
        this.canDash = false; 
        
        // DASH PLUS LONG (plus facile pour toucher)
        this.dashTimer = 25; 
        this.dashCooldown = 45; 
        
        let dirX = input.AxisX;
        let dirY = 0;
        if (input.JumpPressed) dirY = -1; 
        if (dirX === 0 && dirY === 0) dirX = 1; 

        this.vel = new Vector(dirX, dirY).normalize().mult(25);
    }

    resolvePlatformCollision(rect) {
        if (this.pos.x < rect.x + rect.w &&
            this.pos.x + this.width > rect.x &&
            this.pos.y < rect.y + rect.h &&
            this.pos.y + this.height > rect.y) {
                
            let overlapX = (this.width + rect.w) / 2 - Math.abs((this.pos.x + this.width/2) - (rect.x + rect.w/2));
            let overlapY = (this.height + rect.h) / 2 - Math.abs((this.pos.y + this.height/2) - (rect.y + rect.h/2));

            if (overlapX < overlapY) {
                if (this.pos.x < rect.x) this.pos.x -= overlapX;
                else this.pos.x += overlapX;
                this.vel.x = 0;
            } else {
                if (this.pos.y < rect.y) {
                    this.pos.y -= overlapY;
                    this.grounded = true;
                    this.canDash = true; 
                } else {
                    this.pos.y += overlapY;
                }
                this.vel.y = 0;
            }
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.pos.x + this.width/2, this.pos.y + this.height/2);
        
        // --- AURA BLEU CIEL PERMANENTE ---
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#00BFFF'; // Bleu Ciel

        if (this.isDashing) {
            ctx.shadowBlur = 50; // Ça brille fort !
            ctx.fillStyle = '#00BFFF';
            ctx.rotate(Math.random() * 0.5 - 0.25);
        } else {
            ctx.fillStyle = '#000';
        }

        ctx.fillRect(-this.width/2, -this.height/2, this.width, this.height);

        // Yeux
        ctx.fillStyle = this.isDashing ? 'black' : 'white';
        ctx.fillRect(-8, -5, 6, 6);
        ctx.fillRect(2, -5, 6, 6);

        ctx.restore();
    }
}