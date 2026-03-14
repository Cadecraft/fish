// TODO: refactor constants
const CANVAS_WIDTH = 330;
const CANVAS_HEIGHT = 540;
const COLORS = {
    sky: "#85b4e2"
};

// TODO: load images

// Page data
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext("2d");

// TODO: helpers

// TODO: render loop
const render = () => {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    // Bg
    ctx.fillStyle = COLORS.sky;
    ctx.fillRect(0, 0, width, height);
}

const gameLoop = (delta) => {
    console.log('Game loop called with delta: ' + delta);

    render();

    // TODO: state/keyboard loop
}

// Rendering helpers
const renderState = {
    lastTime: null,
};
const handleNextFrame = (time) => {
    if (renderState.lastTime !== null) {
        const delta = time - renderState.lastTime;
        gameLoop(delta);
    }

    renderState.lastTime = time;
    window.requestAnimationFrame(handleNextFrame);
}

window.requestAnimationFrame(handleNextFrame);
