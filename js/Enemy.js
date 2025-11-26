import Vector from './Vector.js';

export default class Enemy {
    constructor(x, y, type = 'note') {
        this.pos = new Vector(x, y);
        this.vel = new Vector(Math.random()*2-1, Math.random()*2-1);
        this.acc = new Vector(0, 0);
        this.maxSpeed = 3;
        this.maxForce = 0.1;
        this.r = 20; // Rayon
        this.type = type; // 'note'
        this.angle = 0;
    }

    seek(targetPos) {
        let desired = Vector.sub(targetPos, this.pos);
        desired.normalize();
        desired.mult(this.maxSpeed);
        let steer = Vector.sub(desired, this.vel);
        steer.limit(this.maxForce);
        this.acc.add(steer);
    }

    update(target) {
        this.seek(new Vector(target.pos.x + 15, target.pos.y + 15));

        this.vel.add(this.acc);
        this.vel.limit(this.maxSpeed);
        this.pos.add(this.vel);
        this.acc.mult(0);

        // Rotation fluide vers le mouvement
        this.angle = Math.atan2(this.vel.y, this.vel.x);
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.pos.x, this.pos.y);
        
        // Effet brillant
        ctx.shadowColor = '#000';
        ctx.shadowBlur = 10;
        
        ctx.fillStyle = 'black';
        
        // Dessin d'une note de musique
        ctx.beginPath();
        ctx.ellipse(0, 0, 10, 8, -0.2, 0, Math.PI*2);
        ctx.fill();
        
        // La tige de la note
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'black';
        ctx.beginPath();
        ctx.moveTo(8, -2);
        ctx.lineTo(8, -25);
        
        // La queue de la note (flag)
        if (this.type === 'note') {
            ctx.bezierCurveTo(8, -15, 18, -15, 18, -5);
        }
        ctx.stroke();

        // Yeux "Hazard"
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(-3, 0, 2, 0, Math.PI*2);
        ctx.arc(3, 0, 2, 0, Math.PI*2);
        ctx.fill();

        ctx.restore();
    }
}