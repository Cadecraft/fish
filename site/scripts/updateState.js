"use strict";

const inputIsPressed = (inputState, action) => {
    return inputState.keysDown.has(KEYS[action]);
}

const unpressInput = (inputState, action) => {
    inputState.keysDown.delete(KEYS[action]);
}

const startFishing = (gameState) => {
    gameState.status = 'fishing';
    gameState.startTime = Date.now();
}

const handleInput = (gameState, inputState) => {
    // TODO: handle based on the DELTA
    if (inputIsPressed(inputState, 'left')) {
        gameState.lureX = Math.max(8, gameState.lureX - 8);
    }
    if (inputIsPressed(inputState, 'right')) {
        gameState.lureX = Math.min(GAME_WIDTH - 8, gameState.lureX + 8);
    }
    if (inputIsPressed(inputState, 'start')) {
        // TODO: more checks
        if (gameState.status === 'home') {
            startFishing(gameState);
            unpressInput(inputState, 'start')
        }
    }
}

const spawnFish = (gameState, fishType) => {
    gameState.fishes.push({
        type: fishType,
        x: 100,
        depth: gameState.depth + GAME_HEIGHT,
    });
}

const cullFishes = (gameState) => {
    gameState.fishes = gameState.fishes.filter((fih) => fih.depth >= gameState.depth);
}

const updateState = (gameState, inputState) => {
    handleInput(gameState, inputState);

    // TODO: handle based on the DELTA

    if (gameState.status === 'fishing') {
        console.assert(gameState.startTime);
        const speed = Math.min(4, 1 + gameState.depth / 20);
        gameState.depth += Math.max(speed);
        gameState.lureXglide = Math.round((gameState.lureX + gameState.lureXglide) / 2);

        if (Date.now() > gameState.nextSpawnTime) {
            spawnFish(gameState, 'silver');
            gameState.nextSpawnTime = Date.now() + 1000;
            cullFishes(gameState);
        }

        // TODO: make fish swim
    }
}
