var board = [];
var currentLevel = 0;
var tiles = {"puffle": null, "blank": null, "edge": null, "hard_ice": null, "ice": null, "movable_ice": null, "soft_ice": null, "water": null, "goal": null, "coin_bag": null, "lock": null, "key": null, "teleporter": null, "teleporter_used": null};
var pufflePosition = {};
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
            let tile;
            if(board[row] == null || board[row][col] == null) tile = "blank";
            else tile = board[row][col];
            image(tiles[tile], col * SQSIZE + XOFFSET, row * SQSIZE + YOFFSET, SQSIZE, SQSIZE)
        }
    }
}

function reset() {
    board = levels[currentLevel].board;
    // Calculate puffle's starting position based on the level. Eventually, this can be stored in the level's property.
    for(var row = 0; row < BOARDHEIGHT; row++) {
        for(var col = 0; col < BOARDWIDTH; col++) {
            if(board[row] != null && board[row][col] != null && board[row][col] == "puffle") pufflePosition = {y: row, x: col};
        }
    }
}

function keyPressed() {
    var xMovement = 0;
    var yMovement = 0;
    if(keyCode == LEFT_ARROW) xMovement = -1;
    else if(keyCode == RIGHT_ARROW) xMovement = 1;
    else if(keyCode == UP_ARROW) yMovement = -1;
    else if(keyCode == DOWN_ARROW) yMovement = 1;

    if(xMovement == 0 && yMovement == 0) return;

    // check if movement is valid
    if(board[pufflePosition.y + yMovement] == null) return;
    if(board[pufflePosition.y + yMovement][pufflePosition.x + xMovement] == null) return;
    var newTileType = board[pufflePosition.y + yMovement][pufflePosition.x + xMovement];
    if(newTileType == "edge" || newTileType == "water") return;

    // ok make movement
    board[pufflePosition.y][pufflePosition.x] = "water";
    pufflePosition.y += yMovement;
    pufflePosition.x += xMovement;
    board[pufflePosition.y][pufflePosition.x] = "puffle";
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