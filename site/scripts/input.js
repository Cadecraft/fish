"use strict";

const startInputListeners = (inputState) => {
    document.addEventListener('keydown', (e) => {
        inputState.keysDown.add(e.key);
    });
    document.addEventListener('keyup', (e) => {
        inputState.keysDown.delete(e.key);
    });
}
