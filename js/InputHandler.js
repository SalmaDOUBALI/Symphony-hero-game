export default class InputHandler {
    constructor() {
        this.keys = {};
        
        window.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            // Prévenir le scroll avec espace
            if(e.code === 'Space') e.preventDefault();
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
    }

    isDown(code) {
        return this.keys[code] === true;
    }
    
    // Support WASD et Flèches
    get AxisX() {
        if (this.isDown('ArrowRight') || this.isDown('KeyD')) return 1;
        if (this.isDown('ArrowLeft') || this.isDown('KeyA')) return -1;
        return 0;
    }
    
    get JumpPressed() {
        return this.isDown('ArrowUp') || this.isDown('KeyW') || this.isDown('Space');
    }

    get DashPressed() {
        return this.isDown('ShiftLeft') || this.isDown('ShiftRight');
    }
}