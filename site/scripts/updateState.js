"use strict";

const inputIsPressed = (inputState, action) => {
    return inputState.keysDown.has(KEYS[action]);
}

const unpressInput = (inputState, action) => {
    inputState.keysDown.delete(KEYS[action]);
}

const startFishing = (gameState) => {
    gameState.status = 'descending';
    gameState.startTime = Date.now();
}

const handleInput = (gameState, inputState, delta) => {
    // TODO: handle based on the DELTA
    const accel = delta * 0.6;
    if (gameState.status === 'ascending' || gameState.status === 'descending') {
        if (inputIsPressed(inputState, 'left')) {
            gameState.lureX = Math.max(8, gameState.lureX - accel);
        }
        if (inputIsPressed(inputState, 'right')) {
            gameState.lureX = Math.min(GAME_WIDTH - 8, gameState.lureX + accel);
        }
    } else if (gameState.status === 'home') {
        if (inputIsPressed(inputState, 'start')) {
            // TODO: more checks
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
        direction: -1,
        taken: false,
    });
}

const cullFishes = (gameState) => {
    if (gameState.status === 'ascending') {
        const fishExists = (fih) => fih.depth < gameState.depth + GAME_HEIGHT || fih.taken;
        gameState.fishes = gameState.fishes.filter(fishExists);
    }
}

const handleFishCollision = (gameState, fish) => {
    if (gameState.status === 'descending') {
        gameState.status = 'ascending'
    }
    // TODO: handle the fish further?
    fish.taken = true;
}

const calcCollisions = (gameState) => {
    const depthMargin = 20;
    const xMargin = 1;
    gameState.fishes.forEach((fish) => {
        const inDepthRange = fish.depth > gameState.depth - depthMargin && fish.depth < gameState.depth + depthMargin;
        if (!inDepthRange || fish.taken) {
            return;
        }
        const inXRange = gameState.lureX > fish.x - xMargin - FISHES[fish.type].width / 2 && gameState.lureX < fish.x + xMargin + FISHES[fish.type].width / 2;
        if (inXRange) {
            console.log('collided');
            handleFishCollision(gameState, fish);
        }
    });
}

const updateState = (gameState, inputState, delta) => {
    handleInput(gameState, inputState, delta);

    if (gameState.status === 'descending') {
        console.assert(gameState.startTime);
        const sinkSpeedRaw = Math.min(0.3, 0.1 + gameState.depth / 300);
        const sinkSpeedAdjusted = delta * sinkSpeedRaw;
        gameState.depth += sinkSpeedAdjusted;

        if (Date.now() > gameState.nextSpawnTime) {
            spawnFish(gameState, 'silver');
            gameState.nextSpawnTime = Date.now() + 100;
            cullFishes(gameState);
        }
    }

    if (gameState.status === 'ascending') {
        const riseSpeedRaw = 0.3;
        const riseSpeedAdjusted = delta * riseSpeedRaw;
        gameState.depth -= riseSpeedAdjusted;

        if (gameState.depth < 0) {
            // TODO: end game, reset state
            gameState.depth = 0;
            gameState.status = 'home';
        }
    }

    if (gameState.status === 'descending' || gameState.status === 'ascending') {
        gameState.lureXglide = Math.round((gameState.lureX + gameState.lureXglide) / 2);
        gameState.fishes.forEach((fish) => {
            if (fish.x < 8) {
                fish.direction = 1;
            } else if (fish.x > GAME_WIDTH - 8) {
                fish.direction = -1;
            }
            const fishSpeedAdj = delta * fish.direction * FISHES[fish.type].speed;
            fish.x += fishSpeedAdj;
        });

        calcCollisions(gameState);
    }
}
