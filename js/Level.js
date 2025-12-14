export default class Level {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.platforms = [];
        this.round = 1;
        
        // Configuration actuelle (couleurs)
        this.currentPaperColor = '#fff0f5';
        this.currentClefColor = 'rgba(255, 20, 147, 0.15)'; 
    }

    init(round) {
        this.round = round;
        this.platforms = [];

        // --- CONFIGURATION DES 3 NIVEAUX ---

        if (round === 1) {
            // NIVEAU 1 : Rose - Facile
            this.currentPaperColor = '#fff0f5'; // Rose pâle
            this.currentClefColor = 'rgba(255, 105, 180, 0.15)'; // HotPink
            
            // Sol standard
            this.platforms.push({ x: 50, y: 500, w: 200, h: 20, color: '#000' });
            this.platforms.push({ x: 550, y: 500, w: 200, h: 20, color: '#000' });
            // Milieu
            this.platforms.push({ x: 300, y: 350, w: 200, h: 20, color: '#000' });
            // Haut
            this.platforms.push({ x: 100, y: 200, w: 150, h: 20, color: '#000' });
            this.platforms.push({ x: 550, y: 200, w: 150, h: 20, color: '#000' });
        } 
        else if (round === 2) {
            // NIVEAU 2 : Bleu - Plateformes en escalier
            this.currentPaperColor = '#e0f7fa'; // Cyan très pâle
            this.currentClefColor = 'rgba(0, 191, 255, 0.15)'; // DeepSkyBlue
            
            // Escalier montant
            this.platforms.push({ x: 50, y: 550, w: 100, h: 20, color: '#000' });
            this.platforms.push({ x: 200, y: 450, w: 100, h: 20, color: '#000' });
            this.platforms.push({ x: 350, y: 350, w: 100, h: 20, color: '#000' });
            this.platforms.push({ x: 500, y: 250, w: 100, h: 20, color: '#000' });
            this.platforms.push({ x: 650, y: 150, w: 100, h: 20, color: '#000' });
            
            // Une grande barre en bas pour se rattraper
            this.platforms.push({ x: 150, y: 580, w: 500, h: 20, color: '#000' });
        } 
        else if (round === 3) {
            // NIVEAU 3 : Jaune/Or - Difficile (Plateformes petites et dispersées)
            this.currentPaperColor = '#fff9c4'; // Jaune pâle
            this.currentClefColor = 'rgba(255, 215, 0, 0.15)'; // Gold
            
            // Plateformes centrales
            this.platforms.push({ x: 350, y: 550, w: 100, h: 20, color: '#000' });
            this.platforms.push({ x: 350, y: 100, w: 100, h: 20, color: '#000' });
            
            // Cotés
            this.platforms.push({ x: 50, y: 300, w: 100, h: 20, color: '#000' });
            this.platforms.push({ x: 650, y: 300, w: 100, h: 20, color: '#000' });
            
            // Diagonales
            this.platforms.push({ x: 200, y: 450, w: 80, h: 20, color: '#000' });
            this.platforms.push({ x: 520, y: 450, w: 80, h: 20, color: '#000' });
            this.platforms.push({ x: 200, y: 200, w: 80, h: 20, color: '#000' });
            this.platforms.push({ x: 520, y: 200, w: 80, h: 20, color: '#000' });
        }

        // --- Bords invisibles (communs à tous les niveaux) ---
        this.platforms.push({ x: -50, y: 0, w: 50, h: 600 }); 
        this.platforms.push({ x: 800, y: 0, w: 50, h: 600 }); 
        this.platforms.push({ x: 0, y: -50, w: 800, h: 50 }); 
        this.platforms.push({ x: 0, y: 600, w: 800, h: 50 }); 
    }

    draw(ctx) {
        // 1. Fond Papier Dynamique
        ctx.fillStyle = this.currentPaperColor;
        ctx.fillRect(0, 0, this.width, this.height);

        // 2. LA GRANDE CLÉ DE SOL (Couleur dynamique)
        ctx.save();
        ctx.translate(200, 350); 
        ctx.rotate(-0.1); 
        ctx.fillStyle = this.currentClefColor; 
        ctx.font = '600px "Segoe UI Symbol", "Apple Symbols", serif'; 
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('𝄞', 0, 0); 
        ctx.restore();

        // 3. Marge Rouge
        ctx.strokeStyle = 'rgba(255, 0, 0, 0.6)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(80, 0);
        ctx.lineTo(80, this.height);
        ctx.stroke();

        // 4. Lignes bleues
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