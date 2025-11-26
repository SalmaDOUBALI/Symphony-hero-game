export default class Level {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.platforms = [];
        this.round = 1;
    }

    init(round) {
        this.round = round;
        this.platforms = [];

        // Plateformes
        this.platforms.push({ x: 50, y: 500, w: 200, h: 20, color: '#000' });
        this.platforms.push({ x: 350, y: 400, w: 100, h: 20, color: '#000' });
        this.platforms.push({ x: 550, y: 300, w: 200, h: 20, color: '#000' });
        this.platforms.push({ x: 100, y: 200, w: 150, h: 20, color: '#000' });

        // Bords invisibles
        this.platforms.push({ x: -50, y: 0, w: 50, h: 600 }); 
        this.platforms.push({ x: 800, y: 0, w: 50, h: 600 }); 
        this.platforms.push({ x: 0, y: -50, w: 800, h: 50 }); 
        this.platforms.push({ x: 0, y: 600, w: 800, h: 50 }); 
    }

    draw(ctx) {
        // 1. Fond Papier (Rose pour Round 1, Bleu pour Round 2)
        let paperColor = this.round === 1 ? '#fff0f5' : '#e0f7fa'; 
        ctx.fillStyle = paperColor;
        ctx.fillRect(0, 0, this.width, this.height);

        // 2. LA GRANDE CLÉ DE SOL (Dessinée AVANT les lignes pour être en dessous)
        ctx.save();
        // Positionnement : plus à gauche (x=200) et bien centrée en hauteur
        ctx.translate(200, 350); 
        ctx.rotate(-0.1); // Une petite rotation élégante vers la gauche
        
        // Couleur Rose foncé très transparente (effet filigrane)
        ctx.fillStyle = 'rgba(255, 20, 147, 0.15)'; 
        
        // Police très grande (600px) et élégante
        // On essaie plusieurs polices pour être sûr que ça soit joli
        ctx.font = '600px "Segoe UI Symbol", "Apple Symbols", serif'; 
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Le caractère officiel de la Clé de Sol
        ctx.fillText('𝄞', 0, 0); 
        ctx.restore();

        // 3. Marge Rouge (Dessinée par dessus la clé)
        ctx.strokeStyle = 'rgba(255, 0, 0, 0.6)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(80, 0);
        ctx.lineTo(80, this.height);
        ctx.stroke();

        // 4. Lignes bleues du cahier
        ctx.strokeStyle = 'rgba(0, 0, 255, 0.2)';
        ctx.lineWidth = 1;
        for (let y = 0; y < this.height; y += 30) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(this.width, y);
            ctx.stroke();
        }

        // 5. Dessin des Plateformes
        ctx.fillStyle = '#111';
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.shadowBlur = 5;
        ctx.shadowOffsetY = 5;
        
        this.platforms.forEach(p => {
            if (p.color) { 
                ctx.fillRect(p.x, p.y, p.w, p.h);
            }
        });
        
        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;
    }
}