var board = [];
var currentLevel = 0;
var tiles = {"puffle": null, "blank": null, "edge": null, "hard_ice": null, "ice": null, "movable_ice": null, "soft_ice": null, "water": null, "goal": null, "coin_bag": null, "lock": null, "key": null, "teleporter": null, "teleporter_used": null};

const SQSIZE = 25;
const BOARDWIDTH = 19;
const BOARDHEIGHT = 19;
const XOFFSET = 40;
const YOFFSET = 40;

function setup() {
    createCanvas(windowWidth, windowHeight);
    rectMode(CENTER)
    imageMode(CENTER)
    reset();

}

function preload() {
    for(var tile in tiles) {
        console.log("Preloading " + tile);
        tiles[tile] = loadImage("assets/tiles/" + tile + ".png");
    }
}

function draw() {
    for(var row = 0; row < BOARDHEIGHT; row++) {
        for(var col = 0; col < BOARDWIDTH; col++) {
            let tile = board[row][col];
            if(tile == null) tile = "blank";
            image(tiles[tile], col * SQSIZE + XOFFSET, row * SQSIZE + YOFFSET, SQSIZE, SQSIZE)
        }
    }
}

function reset() {
    board = levels[currentLevel].board;
}

const levels = [
    {
        board: [
            [], [], [], [], [], [], [], [], [],
            [null, "edge", "edge", "edge", "edge", "edge", "edge", "edge", "edge", "edge", "edge", "edge", "edge", "edge", "edge", "edge", null, null, null],
            [null, "edge", "goal", "ice", "ice", "ice", "ice", "ice", "ice", "ice", "ice", "ice", "ice", "ice", "puffle", "edge", null, null, null],
            [null, "edge", "edge", "edge", "edge", "edge", "edge", "edge", "edge", "edge", "edge", "edge", "edge", "edge", "edge", "edge", null, null, null],
            [], [], []
        ]
    }
]