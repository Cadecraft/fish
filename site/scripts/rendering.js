// Page data
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;
ctx.font = "18px Datatype";

const COLORS = {
    sky: "#85b4e2",
    water: "#4065bd",
    red: "red",
};

const IMAGE_FILENAMES = {
    clouds: 'clouds.png',
    land: 'land.png',
};

const imageCache = {};

const setupImages = () => {
    for (const [key, filename] of Object.entries(IMAGE_FILENAMES)) {
        const image = document.createElement('img');
        image.src = `assets/textures/${filename}`;
        imageCache[key] = image;
    }
}

const drawImageAt = (ctx, image, x, y, w, h) => {
    ctx.drawImage(image, Math.floor(x), Math.floor(y), Math.ceil(w), Math.ceil(h));
}

const renderBg = (state, ctx) => {
    ctx.fillStyle = COLORS.water;
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    const skyHeight = 180;

    if (state.depth < skyHeight + imageCache.land.height * 2) {
        const waterLine = skyHeight - state.depth;
        ctx.fillStyle = COLORS.sky;
        ctx.fillRect(0, 0, GAME_WIDTH, waterLine);
        // Clouds
        const animPercent = (Date.now() % 60000) / 60000;
        drawImageAt(ctx, imageCache.clouds, animPercent * GAME_WIDTH, -1 * state.depth, GAME_WIDTH, skyHeight);
        drawImageAt(ctx, imageCache.clouds, animPercent * GAME_WIDTH - GAME_WIDTH, -1 * state.depth, GAME_WIDTH, skyHeight);
        // Land
        drawImageAt(ctx, imageCache.land, 0, waterLine - 52, imageCache.land.width * 2, imageCache.land.height * 2);
    }
}

const renderUI = (state) => {
    const depthMeters = Math.round(state.depth / 32);
    const depthText = depthMeters <= 0 ? '' : `Depth: ${depthMeters}m`;
    document.getElementById('depth').innerText = depthText;
}

const render = (state) => {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;

    const animationMs = Date.now();

    renderBg(state, ctx);

    // Demo square
    ctx.fillStyle = COLORS.red;
    ctx.fillRect(state.x, state.x, 30, 30);

    renderUI(state);
}
