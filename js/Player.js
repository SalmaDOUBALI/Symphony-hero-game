import Vector from './Vector.js';

export default class Player {
    constructor(x, y) {
        this.pos = new Vector(x, y);
        this.vel = new Vector(0, 0);
        this.acc = new Vector(0, 0);
        this.width = 30;
        this.height = 30;
        this.speed = 0.8;
        
        this.jumpForce = 18; 
        this.grounded = false;
        
        // Dash
        this.canDash = true;
        this.isDashing = false;
        this.dashTimer = 0;
        this.dashCooldown = 0;

        // Mémoire de direction (1 = Droite, -1 = Gauche)
        // Par défaut, on regarde à droite
        this.lastDir = 1; 

        // Couleurs
        this.normalColor = '#000'; 
        this.dashColor = '#00BFFF'; 
    }

    update(input, platforms) {
        // Mise à jour de la direction du regard (si on bouge horizontalement)
        if (input.AxisX !== 0) {
            this.lastDir = input.AxisX;
        }

        // --- GESTION DU DASH ---
        if (this.isDashing) {
            // Friction très faible pour glisser loin (0.98 au lieu de 0.96)
            this.vel.mult(0.98); 
            this.dashTimer--;
            
            if (this.dashTimer <= 0) {
                this.isDashing = false;
                this.vel.mult(0.5); // Freinage fin de dash
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

            // Dash Trigger
            if (input.DashPressed && this.canDash && this.dashCooldown <= 0) {
                this.startDash(input);
                return 'dash';
            }
        }

        // Physique
        this.vel.add(this.acc);
        // Vitesse max très élevée pendant le dash
        this.vel.limit(this.isDashing ? 30 : 10); 
        this.pos.add(this.vel);
        this.acc.mult(0); 

        if (this.dashCooldown > 0) this.dashCooldown--;

        // Collisions
        this.grounded = false;
        platforms.forEach(p => this.resolvePlatformCollision(p));

        // Limites écran
        if (this.pos.x < 0) this.pos.x = 0;
        if (this.pos.x > 800 - this.width) this.pos.x = 800 - this.width;
        if (this.pos.y > 600) this.pos.y = 0; 
        
        return null;
    }

    startDash(input) {
        this.isDashing = true;
        this.canDash = false; 
        
        // --- REGLAGES DASH ---
        // Durée : 35 frames (très long, plus d'une demi-seconde d'attaque)
        this.dashTimer = 35; 
        this.dashCooldown = 50; 
        
        // --- CALCUL DIRECTION ---
        let dirX = input.AxisX;
        let dirY = 0;

        // Si on appuie sur Haut
        if (input.JumpPressed) dirY = -1; 
        
        // Si on ne bouge pas horizontalement, on utilise la DERNIÈRE direction connue
        // (C'est ça qui te permet de dasher sans appuyer sur les flèches)
        if (dirX === 0) {
            // Si on n'appuie pas non plus sur haut, on dash tout droit devant
            if (dirY === 0) {
                dirX = this.lastDir; 
            }
        }

        // Application de la vitesse
        // .mult(28) = Vitesse de départ très rapide
        this.vel = new Vector(dirX, dirY).normalize().mult(28);
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
        
        // Aura
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#00BFFF'; 

        if (this.isDashing) {
            ctx.shadowBlur = 60; // Grosse aura
            ctx.fillStyle = '#00BFFF';
            ctx.rotate(Math.random() * 0.5 - 0.25);
            
            // Effet de trainée (vitesse visuelle)
            ctx.scale(1.2, 0.8); 
        } else {
            ctx.fillStyle = '#000';
        }

        ctx.fillRect(-this.width/2, -this.height/2, this.width, this.height);

        // Yeux (regardent dans la direction du mouvement)
        let eyeOffset = this.lastDir * 4; // Décalage des yeux selon la direction
        
        ctx.fillStyle = this.isDashing ? 'black' : 'white';
        // Oeil gauche
        ctx.fillRect(-8 + eyeOffset, -5, 6, 6);
        // Oeil droit
        ctx.fillRect(2 + eyeOffset, -5, 6, 6);

        ctx.restore();
    }
}