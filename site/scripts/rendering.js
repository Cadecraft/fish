// TODO: load images

// Page data
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext("2d");

const render = (state) => {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;

    // Bg
    ctx.fillStyle = COLORS.sky;
    ctx.fillRect(0, 0, width, height);

    // Demo square
    ctx.fillStyle = COLORS.red;
    ctx.fillRect(state.x, state.x, 30, 30);

    // TODO: render loop
}
