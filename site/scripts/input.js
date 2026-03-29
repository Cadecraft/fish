"use strict";

const startInputListeners = (inputState) => {
    const touches = new Map();

    const canvasElem = document.getElementById('canvas');

    document.addEventListener('keydown', (e) => {
        inputState.keysDown.add(KEYS[e.key]);
    });
    document.addEventListener('keyup', (e) => {
        inputState.keysDown.delete(KEYS[e.key]);
    });

    const handleTouchStart = (e) => {
        e.preventDefault();
        const canvasLeft = canvasElem.getBoundingClientRect().left;

        for (const changedTouch of e.changedTouches) {
            const touchX = changedTouch.pageX - canvasLeft;
            if (touchX < GAME_WIDTH / 2) {
                inputState.keysDown.add('left');
                inputState.keysDown.delete('right');
            } else {
                inputState.keysDown.add('right');
                inputState.keysDown.delete('left');
            }
            inputState.keysDown.add('start');
            touches.set(changedTouch.identifier, touchX);
        }
    }

    const handleTouchEnd = (e) => {
        e.preventDefault();
        for (const changedTouch of e.changedTouches) {
            inputState.keysDown.delete('right');
            inputState.keysDown.delete('left');
            inputState.keysDown.delete('start');
            ongoingTouches.delete(changedTouch.identifier);
        }
    }

    canvasElem.addEventListener("touchstart", handleTouchStart);
    canvasElem.addEventListener("touchend", handleTouchEnd);
}
