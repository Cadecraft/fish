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

const spawnFish = (gameState) => {
    // TODO: better RNG/fish generation
    const validFishTypes = Object.fromEntries(Object.entries(FISHES).filter(([_, f]) => (
        gameState.depth >= f.spawnDepthMin && (!f.spawnDepthMax || gameState.depth <= f.spawnDepthMax)
    )));

    const fishType = Object.keys(validFishTypes)[Math.floor(Math.random() * Object.keys(validFishTypes).length)]
    const x = Math.random() * GAME_WIDTH;
    const dir = Math.floor(Math.random() * 2) === 0 ? -1 : 1;
    gameState.fishes.push({
        type: fishType,
        x,
        depth: gameState.depth + GAME_HEIGHT,
        direction: dir,
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
            handleFishCollision(gameState, fish);
        }
    });
}

const endGame = (gameState) => {
    const fishTypeCounts = {};
    const fishTypesCaught = gameState.fishes.filter(f => f.taken).map(f => f.type);
    fishTypesCaught.forEach(t => { fishTypeCounts[t] = (fishTypeCounts[t] ?? 0) + 1; });
    const results = {
        fishTypeCounts
    };
    const lastGame = { ...gameState, results, lastGame: null };
    const newGameState = {
        ...structuredClone(DEFAULT_GAME_STATE),
        status: 'results',
        lastGame
    };
    Object.assign(gameState, newGameState);
    if (USE_DEBUG_SETUP) {
        console.log('[dbg] ended game, new state: ' + JSON.stringify(gameState));
    }
}

const handleInput = (gameState, inputState, delta) => {
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
            startFishing(gameState);
            unpressInput(inputState, 'start')
        }
    } else if (gameState.status === 'results') {
        if (inputIsPressed(inputState, 'start')) {
            gameState.status = 'home';
            unpressInput(inputState, 'start')
        }
    }
}

const updateState = (gameState, inputState, delta) => {
    handleInput(gameState, inputState, delta);

    if (gameState.status === 'descending') {
        console.assert(gameState.startTime);
        const sinkSpeedRaw = Math.min(0.3, 0.1 + gameState.depth / 300);
        const sinkSpeedAdjusted = delta * sinkSpeedRaw;
        gameState.depth += sinkSpeedAdjusted;
        gameState.maxDepth = gameState.depth;

        if (Date.now() > gameState.nextSpawnTime) {
            const delay = Math.random() * 150 + 220;
            spawnFish(gameState);
            gameState.nextSpawnTime = Date.now() + delay;
            cullFishes(gameState);
        }
    }

    if (gameState.status === 'ascending') {
        const riseSpeedRaw = 0.3;
        const riseSpeedAdjusted = delta * riseSpeedRaw;
        gameState.depth -= riseSpeedAdjusted;

        if (gameState.depth < 0) {
            endGame(gameState);
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
