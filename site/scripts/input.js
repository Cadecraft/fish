const startInputListeners = (inputState) => {
    document.addEventListener('keydown', (e) => {
        inputState.keysDown.add(e.key);
        console.log(inputState.keysDown);
    });
    document.addEventListener('keyup', (e) => {
        inputState.keysDown.delete(e.key);
        console.log(inputState.keysDown);
    });
}

const inputIsPressed = (inputState, action) => {
    console.log('check has ' + KEYS[action]);
    return inputState.keysDown.has(KEYS[action])
}
