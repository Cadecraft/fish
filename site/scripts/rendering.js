"use strict";

// Page data
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;
ctx.font = "18px Datatype";

const COLORS = {
    sky: "#85b4e2",
    water: "#4065bd",
    red: "red",
    line: "#c5d1db",
};

const IMAGE_FILENAMES = {
    clouds: 'clouds.png',
    land: 'land.png',
    fisherUnreleased1: 'fisher_unreleased1.png',
    fisherUnreleased2: 'fisher_unreleased2.png',
    fisher: 'fisher.png',
    waves: 'waves.png',
    waves2: 'waves2.png',
    hook: 'hook.png',
    seabg: 'seabg.png',
};

const SKY_HEIGHT = 180;

const imageCache = {};

const setupImages = () => {
    for (const fishName of Object.keys(FISHES)) {
        const fishId = `fish_${fishName}`;
        IMAGE_FILENAMES[fishId] = `${fishId}.png`;
    }

    for (const [key, filename] of Object.entries(IMAGE_FILENAMES)) {
        const image = document.createElement('img');
        image.src = `assets/textures/${filename}`;
        imageCache[key] = image;
    }
}

const drawImageAt = (ctx, image, x, y, w, h) => {
    ctx.drawImage(image, Math.floor(x), Math.floor(y), Math.ceil(w), Math.ceil(h));
}

const drawPixelArtAt = (ctx, image, x, y) => {
    ctx.drawImage(image, Math.floor(x), Math.floor(y), Math.ceil(image.width * 2), Math.ceil(image.height * 2));
}

const renderBg = (state, ctx) => {
    ctx.fillStyle = COLORS.water;
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Sea (always)
    const seaScrollHeight = -1 * (state.depth) % GAME_HEIGHT;
    const seaOffset = state.status === 'home' ? -1 * (Date.now() % 2000) / 1000 : 0;
    drawPixelArtAt(ctx, imageCache.seabg, 0, seaScrollHeight + seaOffset);
    drawPixelArtAt(ctx, imageCache.seabg, 0, seaScrollHeight + seaOffset + GAME_HEIGHT);

    if (state.depth < SKY_HEIGHT + imageCache.land.height * 2) {
        const waterLine = SKY_HEIGHT - state.depth;
        ctx.fillStyle = COLORS.sky;
        ctx.fillRect(0, 0, GAME_WIDTH, Math.floor(waterLine));
        // Clouds
        const cloudAnimPercent = (Date.now() % 60000) / 60000;
        drawPixelArtAt(ctx, imageCache.clouds, cloudAnimPercent * GAME_WIDTH, -1 * state.depth);
        drawPixelArtAt(ctx, imageCache.clouds, cloudAnimPercent * GAME_WIDTH - GAME_WIDTH, -1 * state.depth);
        const waveAnimPercent = (Date.now() % 120000) / 120000;
        const waveAnimFrame = (Date.now() % 2500) < 1250;
        const waveImage = waveAnimFrame ? imageCache.waves : imageCache.waves2;
        drawPixelArtAt(ctx, waveImage, waveAnimPercent * GAME_WIDTH, waterLine - 6);
        drawPixelArtAt(ctx, waveImage, waveAnimPercent * GAME_WIDTH - GAME_WIDTH, waterLine - 6);
        // Land
        drawPixelArtAt(ctx, imageCache.land, 0, waterLine - 52);
        // Fisher
        if (state.status === 'home') {
            const fisherAnimFrame = (Date.now() % 1000) < 500;
            const fisherImage = fisherAnimFrame ? imageCache.fisherUnreleased1 : imageCache.fisherUnreleased2;
            drawPixelArtAt(ctx, fisherImage, 84, waterLine - 138);
        } else {
            drawPixelArtAt(ctx, imageCache.fisher, 84, waterLine - 138);
            ctx.strokeStyle = COLORS.line;
            ctx.beginPath();
            ctx.moveTo(114, waterLine - 124);
            ctx.lineTo(state.lureXglide, waterLine);
            ctx.stroke();
        }
    }
}

const renderLure = (state, ctx) => {
    const waterLine = SKY_HEIGHT - state.depth;
    const stringTop = Math.max(waterLine, 0);
    const lureY = Math.max(waterLine, LURE_Y_OFFSET);
    ctx.strokeStyle = COLORS.line;
    ctx.beginPath();
    ctx.moveTo(state.lureXglide, stringTop);
    ctx.lineTo(state.lureX, lureY);
    ctx.stroke();
    drawPixelArtAt(ctx, imageCache.hook, state.lureX - 18, lureY);
}

const renderFish = (state, ctx) => {
    for (const fish of state.fishes) {
        drawPixelArtAt(ctx, imageCache[`fish_${fish.type}`], fish.x, fish.depth - state.depth);
    }
}

// UI definitions
const uiDepth = document.getElementById('depth');
const uiHint = document.getElementById('hint');

const renderUI = (state) => {
    const depthMeters = Math.round(state.depth / 32);
    const depthText = depthMeters <= 0 ? '' : `Depth: ${depthMeters}m`;
    uiDepth.innerText = depthText;

    if (state.status === 'home') {
        uiHint.innerText = '[space] start';
    } else if (state.status === 'fishing' && depthMeters > 5 && depthMeters < 30) {
        uiHint.innerText = '[a] left, [d] right';
    } else {
        uiHint.innerText = '';
    }
}

const render = (state) => {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;

    const animationMs = Date.now();

    renderBg(state, ctx);
    
    if (state.status === 'fishing') {
        renderLure(state, ctx);
    }

    renderFish(state, ctx);

    renderUI(state);
}
