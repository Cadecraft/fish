const inputIsPressed = (inputState, action) => {
    return inputState.keysDown.has(KEYS[action]);
}

const unpressInput = (inputState, action) => {
    inputState.keysDown.delete(KEYS[action]);
}

const handleInput = (gameState, inputState) => {
    if (inputIsPressed(inputState, 'left')) {
        gameState.lureX -= 8;
    }
    if (inputIsPressed(inputState, 'right')) {
        gameState.lureX += 8;
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
        gameState.depth += 4;
    }
}
