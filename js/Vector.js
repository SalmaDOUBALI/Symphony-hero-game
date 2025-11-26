export default class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    add(v) { this.x += v.x; this.y += v.y; return this; }
    sub(v) { this.x -= v.x; this.y -= v.y; return this; }
    mult(n) { this.x *= n; this.y *= n; return this; }
    mag() { return Math.sqrt(this.x * this.x + this.y * this.y); }
    
    normalize() {
        let m = this.mag();
        if (m > 0) this.mult(1 / m);
        return this;
    }

    limit(max) {
        if (this.mag() > max) {
            this.normalize();
            this.mult(max);
        }
        return this;
    }

    copy() { return new Vector(this.x, this.y); }
    
    static sub(v1, v2) { return new Vector(v1.x - v2.x, v1.y - v2.y); }
    static dist(v1, v2) { return v1.copy().sub(v2).mag(); }
}