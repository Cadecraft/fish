const inputIsPressed = (inputState, action) => {
    return inputState.keysDown.has(KEYS[action])
}

const updateState = (gameState, inputState) => {
    // TODO: take action on input
    // TODO: refactor taking action on input
    if (inputIsPressed(inputState, 'left')) {
        gameState.x -= 2;
        gameState.depth -= 4;
    } if (inputIsPressed(inputState, 'right')) {
        gameState.x += 2;
        gameState.depth += 4;
    }
}
