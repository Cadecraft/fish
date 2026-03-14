const runGame = () => {
    // Set up state
    const gameState = {
        x: 10,
    };

    const inputState = {
        keysDown: new Set(),
    };

    // Start helpers
    startInputListeners(inputState);

    // Game loop
    const gameLoop = (delta) => {
        console.log('Game loop called with delta: ' + delta);

        render(gameState);

        // TODO: take action on input
        // TODO: refactor taking action on input
        if (inputIsPressed(inputState, 'left')) {
            console.log('movelf');
            gameState.x -= 2;
        } if (inputIsPressed(inputState, 'right')) {
            gameState.x += 2;
        }
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
