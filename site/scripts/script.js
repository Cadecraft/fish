const runGame = () => {
    // Set up state
    const gameState = {
        /** 'home' | 'fishing' */
        status: 'home',
        depth: 0,
        lureX: 100
    };
    const inputState = {
        keysDown: new Set(),
    };

    // Start helpers
    startInputListeners(inputState);
    setupImages();

    // Game loop
    const gameLoop = (delta) => {
        render(gameState);
        updateState(gameState, inputState);
    }

    // Start rendering
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
}

runGame();
