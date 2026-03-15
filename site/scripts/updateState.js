const inputIsPressed = (inputState, action) => {
    return inputState.keysDown.has(KEYS[action]);
}

const unpressInput = (inputState, action) => {
    inputState.keysDown.delete(KEYS[action]);
}

const handleInput = (gameState, inputState) => {
    if (inputIsPressed(inputState, 'left')) {
        gameState.lureX = Math.max(8, gameState.lureX - 8);
    }
    if (inputIsPressed(inputState, 'right')) {
        gameState.lureX = Math.min(GAME_WIDTH - 8, gameState.lureX + 8);
    }
    if (inputIsPressed(inputState, 'start')) {
        // TODO: more checks
        if (gameState.status === 'home') {
            gameState.status = 'fishing';
            unpressInput(inputState, 'start')
        }
    }
}

const updateState = (gameState, inputState) => {
    handleInput(gameState, inputState);

    if (gameState.status === 'fishing') {
        const speed = Math.min(4, 1 + gameState.depth / 20);
        gameState.depth += Math.max(speed);
    }
}
