// Toggle this to enable/disable debug visuals
const DEBUG = false;

// Toggle this to enable/disable background music
const MUSIC_ENABLED = true;

const config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1536,
        height: 1024,
    },
    backgroundColor: "#1a0d2e",
    scene: {
        preload: preload,
        create: create,
        update: update,
    },
};

function preload() {
    // Load Google Font
    this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
    
    // Load party background from Pexels
    this.load.image('party_bg', 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg');
    
    // Load party screen frame
    this.load.image('party_screen', 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg');
    
    // Load birthday person images
    this.load.image('birthday_person', 'https://images.pexels.com/photos/1729931/pexels-photo-1729931.jpeg');
    this.load.image('birthday_surprised', 'https://images.pexels.com/photos/1729931/pexels-photo-1729931.jpeg');
    
    // Load party crowd images (using various party/celebration photos)
    const partyImages = [
        'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg',
        'https://images.pexels.com/photos/1157557/pexels-photo-1157557.jpeg',
        'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg',
        'https://images.pexels.com/photos/1190299/pexels-photo-1190299.jpeg',
        'https://images.pexels.com/photos/1157394/pexels-photo-1157394.jpeg',
        'https://images.pexels.com/photos/1157395/pexels-photo-1157395.jpeg',
        'https://images.pexels.com/photos/1157396/pexels-photo-1157396.jpeg',
        'https://images.pexels.com/photos/1157397/pexels-photo-1157397.jpeg',
        'https://images.pexels.com/photos/1157398/pexels-photo-1157398.jpeg',
        'https://images.pexels.com/photos/1157399/pexels-photo-1157399.jpeg',
        'https://images.pexels.com/photos/1157400/pexels-photo-1157400.jpeg',
        'https://images.pexels.com/photos/1157401/pexels-photo-1157401.jpeg',
        'https://images.pexels.com/photos/1157402/pexels-photo-1157402.jpeg',
        'https://images.pexels.com/photos/1157403/pexels-photo-1157403.jpeg',
        'https://images.pexels.com/photos/1157404/pexels-photo-1157404.jpeg',
        'https://images.pexels.com/photos/1157405/pexels-photo-1157405.jpeg',
        'https://images.pexels.com/photos/1157406/pexels-photo-1157406.jpeg',
        'https://images.pexels.com/photos/1157407/pexels-photo-1157407.jpeg',
        'https://images.pexels.com/photos/1157408/pexels-photo-1157408.jpeg',
        'https://images.pexels.com/photos/1157409/pexels-photo-1157409.jpeg'
    ];
    
    // Load party crowd images
    for (let i = 1; i <= 20; i++) {
        this.load.image(`party${i}`, partyImages[i - 1]);
    }
    
    // Load party photographer
    this.load.image('photographer', 'https://images.pexels.com/photos/1264210/pexels-photo-1264210.jpeg');
    
    // Load background music (birthday party music)
    this.load.audio('party_music', 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav');
    
    // Load celebration sound effect
    this.load.audio('celebration', 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav');
}

function create() {
    // Add party background
    const bg = this.add.image(0, 0, 'party_bg').setOrigin(0, 0);
    const scaleX = this.cameras.main.width / bg.width;
    const scaleY = this.cameras.main.height / bg.height;
    const scale = Math.max(scaleX, scaleY);
    bg.setScale(scale).setScrollFactor(0);

    // Party screen configuration (like a photo booth screen)
    const SCREEN_CONFIG = {
        x: 600,
        y: 150,
        width: 320,
        height: 180,
    };

    // Create party screen frame
    const screen = this.add.rectangle(
        SCREEN_CONFIG.x, 
        SCREEN_CONFIG.y, 
        SCREEN_CONFIG.width, 
        SCREEN_CONFIG.height, 
        0x000000, 
        0.8
    ).setOrigin(0, 0).setStrokeStyle(4, 0xffd700);

    // Screen area dimensions
    const innerX = SCREEN_CONFIG.x + 10;
    const innerY = SCREEN_CONFIG.y + 10;
    const innerW = SCREEN_CONFIG.width - 20;
    const innerH = SCREEN_CONFIG.height - 20;

    // Create screen zone
    const screenZone = this.add.zone(innerX, innerY, innerW, innerH).setOrigin(0, 0);
    this.partyScreen = screenZone;
    screenZone.setDepth(5);
    screen.setDepth(10);
    screenZone.setInteractive({ cursor: 'pointer' });

    // Render texture for the party screen
    const screenRT = this.add.renderTexture(innerX, innerY, innerW, innerH)
        .setOrigin(0, 0)
        .setDepth(6);

    // Game state
    this.score = 0;
    const scoreText = this.add.text(16, 16, 'Score: 0', {
        fontSize: '32px',
        color: '#ffd700',
        fontFamily: '"Press Start 2P", monospace',
    }).setDepth(100);

    // Add background music
    const partyMusic = this.sound.add('party_music', { loop: true, volume: 0.3 });
    const celebrationSound = this.sound.add('celebration', { volume: 0.8 });

    // Music toggle
    let musicPlaying = false;
    const musicToggle = this.add.text(this.cameras.main.width - 16, 16, '♪ OFF', {
        fontSize: '24px',
        color: '#ffd700',
        fontFamily: '"Press Start 2P", monospace',
    }).setOrigin(1, 0).setDepth(100).setInteractive({ cursor: 'pointer' }).setVisible(false);

    musicToggle.on('pointerdown', () => {
        musicPlaying = !musicPlaying;
        if (musicPlaying) {
            partyMusic.play();
            musicToggle.setText('♪ ON');
        } else {
            partyMusic.stop();
            musicToggle.setText('♪ OFF');
        }
    });

    // Create intro screen
    const createIntroScreen = () => {
        const introScreen = this.add.container(this.cameras.main.width / 2, this.cameras.main.height / 2);
        introScreen.setDepth(200);

        const modalWidth = 850;
        const modalHeight = 520;
        const introBg = this.add.rectangle(0, 0, modalWidth, modalHeight, 0x1a0d2e, 0.95);
        introBg.setStrokeStyle(4, 0xffd700);
        introScreen.add(introBg);

        // Title with birthday theme
        const titleText = this.add.text(0, -90, 'FIND THE\nBIRTHDAY PERSON!', {
            fontSize: '48px',
            color: '#ffd700',
            fontFamily: '"Press Start 2P", monospace',
            align: 'center',
            lineSpacing: 16
        }).setOrigin(0.5);
        introScreen.add(titleText);

        // Birthday-themed instructions
        const instructionText = this.add.text(0, 5, 'Search the party crowd for the birthday person!\nMove your mouse to look around\nHold them in view for 1 second to celebrate!', {
            fontSize: '20px',
            color: '#ffffff',
            fontFamily: '"Press Start 2P", monospace',
            align: 'center',
            lineSpacing: 12
        }).setOrigin(0.5);
        introScreen.add(instructionText);

        // Birthday attribution
        const attribution = this.add.text(0, 60, '🎂 HAPPY BIRTHDAY GAME 🎂', {
            fontSize: '16px',
            color: '#ff69b4',
            fontFamily: '"Press Start 2P", monospace',
            align: 'center'
        }).setOrigin(0.5);
        introScreen.add(attribution);

        const closeIntro = () => {
            introScreen.destroy();
            musicToggle.setVisible(true);
            if (MUSIC_ENABLED) {
                partyMusic.play();
                musicPlaying = true;
                musicToggle.setText('♪ ON');
            }
        };

        // X button
        const xButton = this.add.text(modalWidth / 2 - 30, -modalHeight / 2 + 30, 'X', {
            fontSize: '28px',
            color: '#ffffff',
            fontFamily: '"Press Start 2P", monospace',
        }).setOrigin(0.5).setInteractive({ cursor: 'pointer' });
        xButton.on('pointerdown', closeIntro);
        introScreen.add(xButton);

        // Close button
        const closeButton = this.add.text(0, modalHeight / 2 - 65, 'START PARTY!', {
            fontSize: '28px',
            color: '#ff69b4',
            fontFamily: '"Press Start 2P", monospace',
        }).setOrigin(0.5).setInteractive({ cursor: 'pointer' });
        closeButton.on('pointerdown', closeIntro);
        introScreen.add(closeButton);
    };

    setTimeout(createIntroScreen, 500);

    const scene = this;

    // Party crowd management
    const regularKeys = Array.from({ length: 20 }, (_, i) => `party${i + 1}`);
    
    // Create party background source
    const partySource = this.add.image(0, 0, 'party_bg')
        .setOrigin(0, 0)
        .setScale(2)
        .setVisible(false);

    const bigW = partySource.displayWidth;
    const bigH = partySource.displayHeight;
    const maxOffsetX = bigW - innerW;
    const maxOffsetY = bigH - innerH;

    // Overlay configuration
    const OVERLAY_SCALE = 0.15;
    const BIRTHDAY_SCALE = 0.12;
    const baseOverlayW = 200; // Approximate width
    const OVERLAY_SIZE = baseOverlayW * OVERLAY_SCALE;
    const MIN_DIST = OVERLAY_SIZE * 1.5;

    const TARGET_W = 200 * BIRTHDAY_SCALE;
    const TARGET_H = 200 * BIRTHDAY_SCALE;
    const VISIBLE_THRESHOLD = 0.8;

    const regularOverlays = [];
    const targetOverlays = [];

    // Game state
    this.isLocked = false;
    this.fullTargetVisible = false;
    this.targetHoldTime = 0;

    // Party zones (where people can be found)
    const partyZones = [
        {
            x: 0,
            y: this.cameras.main.height * 0.2,
            width: this.cameras.main.width,
            height: this.cameras.main.height * 0.6,
        },
    ];

    if (DEBUG) {
        partyZones.forEach((z) => {
            this.add.rectangle(z.x, z.y, z.width, z.height, 0x00ff00, 0.15)
                .setOrigin(0, 0)
                .setDepth(80);
        });
    }

    function randomPosInZones() {
        return {
            x: Math.random() * scene.cameras.main.width,
            y: Math.random() * scene.cameras.main.height,
        };
    }

    function generatePositions(count, minDist, width, height, maxAttempts = 10000) {
        const pts = [];
        let attempts = 0;
        while (pts.length < count && attempts < maxAttempts) {
            const { x, y } = randomPosInZones();
            let ok = true;
            for (const p of pts) {
                const dx = p.x - x;
                const dy = p.y - y;
                if (dx * dx + dy * dy < minDist * minDist) {
                    ok = false;
                    break;
                }
            }
            if (ok) pts.push({ x, y });
            attempts++;
        }
        while (pts.length < count) {
            const { x, y } = randomPosInZones();
            pts.push({ x, y });
        }
        return pts;
    }

    function resetBoard() {
        regularOverlays.length = 0;
        targetOverlays.length = 0;

        const positions = generatePositions(21, MIN_DIST, scene.cameras.main.width, scene.cameras.main.height);
        const shuffledPartyKeys = [...regularKeys];
        Phaser.Utils.Array.Shuffle(shuffledPartyKeys);

        positions.forEach((pos, idx) => {
            if (idx === 0) {
                targetOverlays.push({ ...pos, key: 'birthday_person' });
            } else {
                const key = shuffledPartyKeys[idx - 1];
                regularOverlays.push({ ...pos, key });
            }
        });
    }

    // Add photographer
    const photographer = this.add.image(100, this.cameras.main.height - 10, 'photographer')
        .setOrigin(-1.2, 1)
        .setScale(0.4)
        .setDepth(50);

    // Viewfinder for photographer
    const VIEWFINDER_CONFIG = {
        x: 1120,
        y: 476,
        width: 230,
        height: 114,
    };

    const viewfinderRT = this.add.renderTexture(
        VIEWFINDER_CONFIG.x,
        VIEWFINDER_CONFIG.y,
        VIEWFINDER_CONFIG.width,
        VIEWFINDER_CONFIG.height
    ).setOrigin(0, 0).setDepth(47);

    this.viewfinderRT = viewfinderRT;

    function updateScreen(offsetX, offsetY) {
        scene.fullTargetVisible = false;
        screenRT.clear();
        screenRT.draw(partySource, -offsetX, -offsetY);

        scene.viewfinderRT.clear();
        scene.viewfinderRT.draw(partySource, -offsetX, -offsetY);

        // Draw regular party guests
        regularOverlays.forEach((o) => {
            const partyX = (o.x / scene.cameras.main.width) * maxOffsetX;
            const partyY = (o.y / scene.cameras.main.height) * maxOffsetY;

            const localX = partyX - offsetX;
            const localY = partyY - offsetY;
            if (localX + OVERLAY_SIZE > -OVERLAY_SIZE && localX < innerW && localY + OVERLAY_SIZE > -OVERLAY_SIZE && localY < innerH) {
                const tmp = scene.add.rectangle(localX, localY, OVERLAY_SIZE, OVERLAY_SIZE, 0x4169e1, 0.7)
                    .setOrigin(0, 0);
                screenRT.draw(tmp);
                scene.viewfinderRT.draw(tmp);
                tmp.destroy();
            }
        });

        // Draw birthday person
        targetOverlays.forEach((t) => {
            const partyX = (t.x / scene.cameras.main.width) * maxOffsetX;
            const partyY = (t.y / scene.cameras.main.height) * maxOffsetY;

            const localX = partyX - offsetX;
            const localY = partyY - offsetY;
            const isOnScreen = localX + TARGET_W > 0 && localX < innerW && localY + TARGET_H > 0 && localY < innerH;

            const visibleLeft = Math.max(0, localX);
            const visibleTop = Math.max(0, localY);
            const visibleRight = Math.min(innerW, localX + TARGET_W);
            const visibleBottom = Math.min(innerH, localY + TARGET_H);
            const visibleW = Math.max(0, visibleRight - visibleLeft);
            const visibleH = Math.max(0, visibleBottom - visibleTop);
            const visibleArea = visibleW * visibleH;
            const totalArea = TARGET_W * TARGET_H;
            const fullyVisible = (visibleArea / totalArea) >= VISIBLE_THRESHOLD;

            if (isOnScreen) {
                // Draw birthday person with special birthday colors
                const tmpT = scene.add.rectangle(localX, localY, TARGET_W, TARGET_H, 0xff69b4, 0.9)
                    .setOrigin(0, 0)
                    .setStrokeStyle(3, 0xffd700);
                
                // Add birthday hat indicator
                const hat = scene.add.triangle(localX + TARGET_W/2, localY, 0, 20, -15, -10, 15, -10, 0xffd700)
                    .setOrigin(0.5, 1);
                
                screenRT.draw(tmpT);
                screenRT.draw(hat);
                scene.viewfinderRT.draw(tmpT);
                scene.viewfinderRT.draw(hat);
                tmpT.destroy();
                hat.destroy();

                if (t.key === 'birthday_person' && fullyVisible) {
                    scene.fullTargetVisible = true;
                }
            }
        });
    }

    resetBoard();
    updateScreen(0, 0);

    this.lastOffsetX = 0;
    this.lastOffsetY = 0;

    this.input.on('pointermove', (pointer) => {
        if (scene.isLocked) return;

        const zone = partyZones[0];
        const halfViewW = innerW / 2;
        const halfViewH = innerH / 2;

        const clampedX = Math.max(zone.x + halfViewW,
            Math.min(pointer.x, zone.x + zone.width - halfViewW));
        const clampedY = Math.max(zone.y + halfViewH,
            Math.min(pointer.y, zone.y + zone.height - halfViewH));

        const normX = (clampedX - zone.x - halfViewW) / (zone.width - innerW);
        const normY = (clampedY - zone.y - halfViewH) / (zone.height - innerH);

        const offsetX = Math.max(0, Math.min(normX * maxOffsetX, maxOffsetX));
        const offsetY = Math.max(0, Math.min(normY * maxOffsetY, maxOffsetY));

        this.lastOffsetX = offsetX;
        this.lastOffsetY = offsetY;

        updateScreen(offsetX, offsetY);
    });

    // Win handler
    this.triggerWin = () => {
        this.isLocked = true;

        celebrationSound.play();

        this.score += 10;
        scoreText.setText(`Score: ${this.score}`);

        // Birthday celebration text
        const celebrationText = this.add.text(this.cameras.main.width / 2, 100, '🎂 HAPPY BIRTHDAY! 🎂', {
            fontSize: '32px',
            color: '#ffd700',
            fontFamily: '"Press Start 2P", monospace',
            align: 'center'
        }).setOrigin(0.5).setDepth(200);

        // Confetti effect
        const confetti = [];
        for (let i = 0; i < 20; i++) {
            const piece = this.add.rectangle(
                Math.random() * this.cameras.main.width,
                -20,
                10, 10,
                Phaser.Utils.Array.GetRandom([0xff69b4, 0xffd700, 0x00ff88, 0x4169e1])
            ).setDepth(150);
            confetti.push(piece);

            this.tweens.add({
                targets: piece,
                y: this.cameras.main.height + 50,
                rotation: Math.PI * 4,
                duration: 3000 + Math.random() * 2000,
                ease: 'Power2',
                onComplete: () => piece.destroy()
            });
        }

        // Fade out celebration text
        this.tweens.add({
            targets: celebrationText,
            alpha: 0,
            y: 50,
            duration: 3000,
            ease: 'Power2',
            onComplete: () => celebrationText.destroy()
        });

        // Change birthday person to surprised and reset
        targetOverlays.forEach((t) => (t.key = 'birthday_surprised'));
        updateScreen(this.lastOffsetX, this.lastOffsetY);

        setTimeout(() => {
            this.isLocked = false;
            resetBoard();
            updateScreen(this.lastOffsetX, this.lastOffsetY);
        }, 3000);
    };
}

function update(time, delta) {
    if (this.isLocked) return;

    if (this.fullTargetVisible) {
        this.targetHoldTime += delta;
        if (this.targetHoldTime >= 1000) {
            this.triggerWin();
            this.targetHoldTime = 0;
        }
    } else {
        this.targetHoldTime = 0;
    }
}

// Initialize the game
const game = new Phaser.Game(config);