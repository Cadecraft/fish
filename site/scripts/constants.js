"use strict";

const GAME_WIDTH = 330;
const GAME_HEIGHT = 540;
/** Maps game action identifiers to the keys that trigger them */
const KEYS = {
    'left': 'a',
    'right': 'd',
    'start': ' ',
};

const FISHES = {
    'silver': {
        speed: 8,
    },
};

const LURE_Y_OFFSET = 130;
