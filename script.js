var board = [];
var currentLevel = 0;
var hasKey = false;
var tiles = {"puffle": null, "blank": null, "edge": null, "hard_ice": null, "ice": null, "movable_ice": null, "soft_ice": null, "water": null, "goal": null, "coin_bag": null, "lock": null, "key": null, "teleporter": null, "teleporter_used": null};
var pufflePosition = {};
const SQSIZE = 25;
const BOARDWIDTH = 19;
const BOARDHEIGHT = 15;
const XOFFSET = 100;
const YOFFSET = 100;

var score = 0;
var solved = 0;
var roundScore = 0;

function setup() {
    createCanvas(windowWidth, windowHeight);
    rectMode(CENTER)
    imageMode(CENTER)
    reset();
    let n = createButton("Reset")
    n.position(XOFFSET + ((BOARDWIDTH / 2) * SQSIZE), YOFFSET + (BOARDHEIGHT * SQSIZE) + 150)
    n.mousePressed(reset)
}

function preload() {
    for(var tile in tiles) {
        console.log("Preloading " + tile);
        tiles[tile] = loadImage("assets/tiles/" + tile + ".png");
    }
}

var water = 0;
var ice = 0;

function draw() {
    background("white");
    water = 0;
    ice = 0;
    for(var row = 0; row < BOARDHEIGHT; row++) {
        for(var col = 0; col < BOARDWIDTH; col++) {
            let tile;
            if(board[row] == null || board[row][col] == null) tile = "blank";
            else tile = board[row][col];
            if(tile == "water") water++;
            if(tile.includes("ice")) ice++;
            image(tiles[tile], col * SQSIZE + XOFFSET, row * SQSIZE + YOFFSET, SQSIZE, SQSIZE)
        }
    }

    textSize(45);
    text("LEVEL " + (currentLevel + 1) + " | " + water + " / " + (ice + water) + " | SOLVED " + solved, 25, 50);
    text("POINTS " + (score + roundScore), 250, 550);
}

function reset() {
    console.log("Resetting");
    roundScore = 0;
    board = JSON.parse(JSON.stringify(levels[currentLevel].board));
    hasKey = false;
    // Calculate puffle's starting position based on the level. Eventually, this can be stored in the level's property.
    for(var row = 0; row < BOARDHEIGHT; row++) {
        for(var col = 0; col < BOARDWIDTH; col++) {
            if(board[row] != null && board[row][col] != null && board[row][col] == "puffle") pufflePosition = {y: row, x: col};
        }
    }
}

var lastTile = null;

function keyPressed() {
    var xMovement = 0;
    var yMovement = 0;
    if(keyCode == LEFT_ARROW) xMovement = -1;
    else if(keyCode == RIGHT_ARROW) xMovement = 1;
    else if(keyCode == UP_ARROW) yMovement = -1;
    else if(keyCode == DOWN_ARROW) yMovement = 1;

    if(xMovement == 0 && yMovement == 0) return;

    // check if movement is valid
    if(validateMove(xMovement, yMovement) != true) return;
    var newTileType = board[pufflePosition.y + yMovement][pufflePosition.x + xMovement];
    if(newTileType == "key") hasKey = true;

    if(newTileType == "movable_ice") {
        let startY = pufflePosition.y + yMovement;
        let startX = pufflePosition.x + xMovement;
        if(keyCode == UP_ARROW) {
            // Iterate upwards, look for spot where it can move to
            for(var newY = startY; newY > 0 && newY < BOARDHEIGHT; newY--) {
                console.log("FIND: " + newY + " (" + board[newY][startX] + ")");
                if(board[newY][startX].includes("ice") == false && newY == startY) return; // can't move the ice at all... reject movement.
                if(board[newY][startX].includes("ice") == false) {
                    console.log("Stopping iteration at " + newY);
                    break; // previous iteration had the final one
                }
            }
            if(startY - newY == 1) return;
            board[startY][startX] = "ice";
            board[newY+1][startX] = "movable_ice";
        }
        else if(keyCode == DOWN_ARROW) {
            // Iterate downwards, look for spot where it can move to
            for(var newY = startY; newY > 0 && newY < BOARDHEIGHT; newY++) {
                console.log("FIND: " + newY + " (" + board[newY][startX] + ")");
                if(board[newY][startX].includes("ice") == false && newY == startY) return; // can't move the ice at all... reject movement.
                if(board[newY][startX].includes("ice") == false) {
                    console.log("Stopping iteration at " + newY);
                    break; // previous iteration had the final one
                }
            }
            if(newY - startY == 1) return;
            board[startY][startX] = "ice";
            board[newY-1][startX] = "movable_ice";
        }
        else if(keyCode == LEFT_ARROW) {
            // Iterate leftwards, look for spot where it can move to
            for(var newX = startX; newX > 0 && newX < BOARDWIDTH; newX--) {
                console.log("FIND: " + newX + " (" + board[startY][newX] + ")");
                if(board[startY][newX].includes("ice") == false && newX == startX) return; // can't move the ice at all... reject movement.
                if(board[startY][newX].includes("ice") == false) {
                    console.log("Stopping iteration at " + newX);
                    break; // previous iteration had the final one
                }
            }
            if(startX - newX == 1) return;
            board[startY][startX] = "ice";
            board[startY][newX+1] = "movable_ice";
        }
        else if(keyCode == RIGHT_ARROW) {
            // Iterate leftwards, look for spot where it can move to
            for(var newX = startX; newX > 0 && newX < BOARDWIDTH; newX++) {
                console.log("FIND: " + newX + " (" + board[startY][newX] + ")");
                if(board[startY][newX].includes("ice") == false && newX == startX) return; // can't move the ice at all... reject movement.
                if(board[startY][newX].includes("ice") == false) {
                    console.log("Stopping iteration at " + newX);
                    break; // previous iteration had the final one
                }
            }
            if(newX - startX == 1) return;
            board[startY][startX] = "ice";
            board[startY][newX-1] = "movable_ice";
        }
        

    }

    if(newTileType == "coin_bag") roundScore += 50;

    // ok make movement
    if(lastTile == "hard_ice") board[pufflePosition.y][pufflePosition.x] = "ice";
    else board[pufflePosition.y][pufflePosition.x] = "water";
    pufflePosition.y += yMovement;
    pufflePosition.x += xMovement;
    board[pufflePosition.y][pufflePosition.x] = "puffle";

    roundScore++;

    lastTile = newTileType;

    if(newTileType == "goal") {
        currentLevel++;
        score += roundScore;
        if(water == (ice + water)) solved++;
        return reset();
    }

    setTimeout(() => {
        if(validateMove(1, 0) != true && validateMove(-1, 0) != true && validateMove(0, 1) != true && validateMove(0, -1) != true) return reset();
    }, 250);
}

function validateMove(xMovement, yMovement) {
    if(board[pufflePosition.y + yMovement] == null) return false;
    if(board[pufflePosition.y + yMovement][pufflePosition.x + xMovement] == null) return false;
    var newTileType = board[pufflePosition.y + yMovement][pufflePosition.x + xMovement];
    if(newTileType == "edge" || newTileType == "water") return false;
    if(newTileType == "lock" && hasKey == false) return false;
    return true;
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
    },
    {"board":[[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,"edge","edge","edge",null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,"edge","goal","edge",null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,"edge","ice","edge",null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,"edge","ice","edge",null,null,null],[null,"edge","edge","edge","edge","edge","edge","edge",null,"edge","edge","edge","edge","edge","ice","edge",null,null,null],[null,"edge","puffle","ice","ice","ice","ice","edge",null,"edge","ice","ice","ice","ice","ice","edge",null,null,null],[null,"edge","edge","edge","edge","edge","ice","edge","edge","edge","ice","edge","edge","edge","edge","edge",null,null,null],[null,null,null,null,null,"edge","ice","ice","ice","ice","ice","edge",null,null,null,null,null,null,null],[null,null,null,null,null,"edge","edge","edge","edge","edge","edge","edge",null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null]]},
    {"board":[[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,"edge","edge","edge",null,null,null,null,null,null,null,null,"edge","edge","edge",null,null,null],[null,null,"edge","goal","edge",null,null,null,null,null,null,null,null,"edge","puffle","edge",null,null,null],[null,null,"edge","ice","edge",null,null,null,null,"edge","edge","edge","edge","edge","ice","edge",null,null,null],[null,null,"edge","ice","edge","edge","edge","edge","edge","edge","ice","ice","edge","edge","ice","edge",null,null,null],[null,null,"edge","ice","ice","ice","ice","ice","ice","ice","ice","ice","ice","ice","ice","edge",null,null,null],[null,null,"edge","ice","ice","edge","edge","ice","ice","edge","edge","edge","edge","ice","ice","edge",null,null,null],[null,null,"edge","edge","edge","edge","edge","edge","edge","edge",null,null,"edge","edge","edge","edge",null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null]]},
    {"board":[[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,"edge","edge","edge","edge","edge",null,null,null,null,null,null,"edge","edge","edge","edge","edge",null,null],[null,"edge","ice","ice","ice","edge","edge","edge","edge","edge","edge","edge","edge","ice","ice","ice","edge",null,null],[null,"edge","ice","edge","ice","edge","edge","ice","ice","ice","ice","edge","edge","ice","edge","ice","edge",null,null],[null,"edge","ice","ice","ice","ice","ice","ice","ice","ice","ice","ice","ice","ice","ice","ice","edge",null,null],[null,"edge","edge","ice","edge","edge","edge","edge","ice","ice","edge","edge","edge","edge","ice","edge","edge",null,null],[null,null,"edge","ice","edge",null,"edge","ice","ice","ice","ice","edge",null,"edge","ice","edge",null,null,null],[null,null,"edge","puffle","edge",null,"edge","coin_bag","ice","ice","ice","edge",null,"edge","goal","edge",null,null,null],[null,null,"edge","edge","edge",null,"edge","edge","edge","edge","edge","edge",null,"edge","edge","edge",null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null]]},
    {"board":[[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,"edge","edge","edge",null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,"edge","puffle","edge",null,null,null,null],[null,null,null,null,"edge","edge","edge","edge","edge","edge","edge","edge","edge","ice","edge","edge","edge",null,null],[null,"edge","edge","edge","edge","ice","ice","ice","ice","ice","ice","ice","ice","ice","ice","ice","edge",null,null],[null,"edge","goal","ice","ice","ice","ice","ice","ice","coin_bag","ice","ice","ice","ice","ice","ice","edge",null,null],[null,"edge","edge","edge","ice","ice","ice","ice","ice","ice","ice","ice","ice","ice","ice","ice","edge",null,null],[null,null,null,"edge","edge","edge","edge","edge","edge","edge","edge","edge","edge","edge","edge","edge","edge",null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null]]},
    {"board":[[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,"edge","edge","edge",null,null,null],[null,null,null,null,null,null,"edge","edge","edge","edge","edge",null,null,"edge","goal","edge",null,null,null],[null,null,null,"edge","edge","edge","edge","ice","ice","ice","edge","edge","edge","edge","ice","edge","edge","edge",null],[null,"edge","edge","edge","ice","ice","ice","ice","ice","ice","ice","ice","ice","edge","ice","ice","ice","edge",null],[null,"edge","puffle","ice","ice","ice","ice","ice","ice","ice","ice","ice","ice","edge","ice","ice","ice","edge",null],[null,"edge","edge","edge","edge","ice","ice","ice","edge","ice","coin_bag","ice","ice","ice","ice","ice","ice","edge",null],[null,null,null,null,"edge","edge","edge","edge","edge","edge","edge","edge","edge","edge","edge","edge","edge","edge",null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null]]},
    {"board":[[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,"edge","edge","edge","edge","edge","edge","edge","edge","edge","edge","edge","edge","edge","edge","edge",null,null,null],[null,"edge","ice","ice","ice","ice","ice","ice","ice","ice","ice","ice","ice","ice","ice","edge",null,null,null],[null,"edge","ice","edge","edge","edge","edge","edge","edge","edge","edge","edge","edge","edge","ice","edge","edge","edge","edge"],[null,"edge","ice","edge","edge","edge","goal","ice","ice","ice","ice","ice","ice","ice","hard_ice","ice","ice","ice","edge"],[null,"edge","ice","edge","edge","edge","edge","edge","edge","edge","edge","edge","edge","edge","ice","edge","edge","ice","edge"],[null,"edge","ice","edge","edge","edge","edge","edge","edge","edge","edge","edge","edge","edge","puffle","edge","edge","ice","edge"],[null,"edge","ice","edge","edge","edge","edge","edge","edge","edge","edge","edge","edge","edge","edge","edge","edge","ice","edge"],[null,"edge","ice","edge","edge","ice","ice","ice","ice","ice","edge","coin_bag","ice","edge","edge","edge","edge","ice","edge"],[null,"edge","ice","ice","ice","ice","ice","ice","ice","ice","ice","ice","ice","ice","ice","ice","ice","ice","edge"],[null,"edge","edge","edge","edge","edge","edge","edge","ice","ice","ice","ice","ice","ice","edge","edge","edge","edge","edge"],[null,null,null,null,null,null,null,"edge","edge","edge","edge","edge","edge","edge","edge",null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null]]},
    {"board":[[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],["edge","edge","edge","edge","edge",null,null,null,"edge","edge","edge","edge","edge",null,null,null,null,null,null],["edge","ice","ice","ice","edge","edge","edge","edge","edge","ice","ice","ice","edge",null,null,null,null,null,null],["edge","ice","edge","ice","edge","edge","puffle","edge","edge","ice","edge","ice","edge",null,null,null,null,null,null],["edge","ice","ice","hard_ice","ice","ice","hard_ice","ice","ice","hard_ice","ice","ice","edge","edge","edge","edge",null,null,null],["edge","edge","edge","ice","edge","edge","ice","edge","edge","ice","edge","edge","edge","edge","goal","edge",null,null,null],[null,"edge","edge","ice","edge","edge","ice","edge","edge","ice","edge","edge","edge","edge","ice","edge","edge",null,null],[null,"edge","ice","ice","ice","ice","hard_ice","ice","ice","hard_ice","ice","ice","edge","edge","ice","ice","edge",null,null],[null,"edge","coin_bag","ice","ice","edge","ice","edge","edge","ice","edge","ice","edge","ice","ice","ice","edge",null,null],[null,"edge","ice","ice","ice","ice","ice","edge","edge","ice","ice","ice","edge","ice","edge","edge","edge",null,null],[null,"edge","ice","edge","edge","edge","edge","edge","edge","edge","edge","edge","edge","ice","ice","ice","edge",null,null],[null,"edge","ice","ice","ice","ice","ice","ice","ice","ice","ice","ice","ice","ice","ice","ice","edge",null,null],[null,"edge","edge","edge","edge","edge","edge","edge","edge","edge","edge","edge","edge","edge","edge","edge","edge",null,null]]},
    {"board":[[null,null,"edge","edge","edge","edge","edge","edge","edge","edge","edge","edge","edge","edge","edge","edge","edge","edge",null],[null,"edge","edge","ice","ice","ice","ice","ice","ice","ice","ice","ice","ice","ice","ice","ice","ice","edge",null],[null,"edge","ice","ice","edge","edge","edge","edge","hard_ice","hard_ice","ice","ice","ice","ice","hard_ice","ice","ice","edge",null],[null,"edge","ice","ice","ice","hard_ice","coin_bag","ice","ice","ice","ice","ice","ice","ice","hard_ice","ice","ice","edge",null],[null,"edge","edge","edge","ice","hard_ice","edge","edge","edge","ice","edge","edge","edge","edge","ice","edge","edge","edge",null],[null,null,null,"edge","ice","hard_ice","edge","edge","edge","goal","edge","ice","ice","edge","ice","edge",null,null,null],[null,"edge","edge","edge","ice","hard_ice","edge","edge","edge","edge","edge","ice","ice","edge","ice","edge",null,null,null],[null,"edge","ice","ice","ice","ice","ice","edge","edge","edge","edge","ice","ice","edge","puffle","edge",null,null,null],[null,"edge","ice","edge","edge","edge","ice","ice","ice","ice","ice","ice","ice","edge","edge","edge",null,null,null],[null,"edge","ice","edge","edge","edge","ice","ice","ice","ice","ice","edge","ice","edge",null,null,null,null,null],[null,"edge","ice","ice","ice","ice","ice","edge","edge","edge","ice","ice","ice","edge",null,null,null,null,null],[null,"edge","edge","edge","edge","edge","edge","edge",null,"edge","edge","edge","edge","edge",null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null]]},
    {"board":[["edge","edge","edge","edge","edge","edge","edge","edge","edge","edge","edge","edge","edge","edge","edge","edge","edge","edge","edge"],["edge","key","ice","ice","ice","ice","ice","ice","ice","ice","ice","ice","ice","ice","ice","ice","ice","ice","edge"],["edge","ice","ice","ice","hard_ice","hard_ice","hard_ice","hard_ice","hard_ice","hard_ice","hard_ice","hard_ice","ice","ice","ice","ice","hard_ice","ice","edge"],["edge","ice","ice","ice","ice","ice","ice","ice","ice","ice","ice","ice","ice","ice","ice","ice","hard_ice","ice","edge"],["edge","ice","ice","ice","ice","ice","ice","edge","edge","edge","edge","edge","edge","ice","ice","ice","hard_ice","ice","edge"],["edge","ice","ice","ice","ice","ice","ice","edge","edge","puffle","edge","edge","hard_ice","hard_ice","coin_bag","ice","hard_ice","ice","edge"],["edge","ice","ice","ice","ice","ice","ice","edge","edge","ice","edge","edge","hard_ice","hard_ice","ice","ice","ice","ice","edge"],["edge","ice","ice","ice","ice","ice","ice","ice","ice","ice","ice","ice","ice","ice","ice","ice","ice","ice","edge"],["edge","ice","ice","ice","ice","ice","ice","ice","ice","ice","ice","ice","ice","ice","ice","ice","ice","ice","edge"],["edge","ice","ice","ice","ice","ice","ice","edge","edge","edge","ice","ice","ice","ice","edge","edge","edge","ice","edge"],["edge","ice","ice","ice","ice","ice","ice","ice","ice","ice","hard_ice","hard_ice","hard_ice","hard_ice","lock","ice","edge","ice","edge"],["edge","ice","ice","edge","edge","ice","ice","edge","edge","edge","ice","ice","ice","ice","edge","goal","edge","ice","edge"],["edge","ice","ice","edge","edge","hard_ice","hard_ice","ice","ice","edge","ice","ice","ice","ice","edge","edge","edge","ice","edge"],["edge","ice","ice","ice","ice","ice","ice","ice","ice","ice","ice","ice","ice","ice","ice","ice","ice","ice","edge"],["edge","edge","edge","edge","edge","edge","edge","edge","edge","edge","edge","edge","edge","edge","edge","edge","edge","edge","edge"]]},
    {"board":[[null,null,null,null,null,null,null,null,null,null,null,null,null,null,"edge","edge","edge",null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,"edge","goal","edge",null,null],[null,null,null,null,null,null,null,null,null,null,null,null,"edge","edge","edge","ice","edge","edge","edge"],[null,null,"edge","edge","edge","edge","edge","edge","edge","edge","edge","edge","edge","hard_ice","ice","hard_ice","ice","hard_ice","edge"],[null,null,"edge","ice","ice","ice","ice","ice","ice","ice","ice","edge","edge","hard_ice","edge","ice","edge","hard_ice","edge"],[null,null,"edge","ice","ice","ice","edge","edge","edge","edge","ice","ice","edge","ice","ice","hard_ice","ice","ice","edge"],[null,null,"edge","ice","ice","ice","ice","hard_ice","ice","edge","ice","ice","edge","edge","edge","ice","edge","edge","edge"],[null,"edge","edge","edge","hard_ice","ice","edge","ice","ice","edge","ice","ice","hard_ice","ice","edge","ice","edge","edge","edge"],[null,"edge","ice","ice","hard_ice","edge","edge","edge","ice","edge","edge","edge","ice","edge","edge","lock","edge","edge","edge"],[null,"edge","ice","edge","ice","ice","key","edge","hard_ice","ice","ice","ice","ice","edge","ice","hard_ice","hard_ice","hard_ice","edge"],[null,"edge","ice","edge","ice","edge","ice","edge","hard_ice","edge","ice","ice","ice","edge","ice","edge","edge","hard_ice","edge"],[null,"edge","ice","ice","hard_ice","edge","ice","edge","ice","edge","ice","ice","ice","edge","ice","puffle","edge","hard_ice","edge"],[null,"edge","edge","edge","ice","ice","hard_ice","hard_ice","ice","edge","ice","ice","ice","edge","edge","edge","edge","hard_ice","edge"],[null,null,null,"edge","ice","ice","edge","ice","coin_bag","edge","ice","ice","hard_ice","hard_ice","hard_ice","hard_ice","hard_ice","hard_ice","edge"],[null,null,null,"edge","edge","edge","edge","edge","edge","edge","edge","edge","edge","edge","edge","edge","edge","edge","edge"]]},
    {"board":[[null,null,null,null,null,null,"edge","edge","edge","edge",null,"edge","edge","edge","edge","edge","edge",null,null],[null,null,null,null,null,null,"edge","ice","ice","edge","edge","edge","ice","ice","edge","puffle","edge",null,null],[null,null,null,null,null,null,"edge","ice","hard_ice","ice","ice","ice","hard_ice","ice","edge","ice","edge",null,null],[null,null,null,null,null,"edge","edge","edge","ice","edge","edge","edge","ice","edge","edge","ice","edge","edge",null],["edge","edge","edge","edge","edge","edge","ice","ice","hard_ice","edge","edge","edge","ice","ice","ice","hard_ice","ice","edge",null],["edge","ice","ice","edge","edge","edge","ice","edge","ice","edge","ice","edge","ice","edge","edge","ice","edge","edge",null],["edge","ice","hard_ice","ice","ice","ice","hard_ice","ice","hard_ice","ice","hard_ice","edge","hard_ice","ice","ice","hard_ice","edge",null,null],["edge","ice","hard_ice","ice","ice","ice","ice","edge","ice","edge","coin_bag","edge","ice","edge","edge","ice","edge",null,null],["edge","ice","hard_ice","hard_ice","edge","hard_ice","hard_ice","ice","hard_ice","ice","hard_ice","ice","hard_ice","ice","edge","ice","edge","edge","edge"],["edge","ice","hard_ice","hard_ice","edge","ice","ice","edge","ice","edge","ice","edge","ice","edge","edge","ice","ice","ice","edge"],["edge","ice","hard_ice","hard_ice","edge","edge","ice","ice","hard_ice","ice","hard_ice","ice","hard_ice","ice","edge","edge","edge","lock","edge"],["edge","ice","hard_ice","hard_ice","edge","edge","ice","ice","edge","edge","ice","edge","ice","ice","edge","goal","ice","ice","edge"],["edge","ice","hard_ice","hard_ice","ice","edge","edge","edge","edge","edge","edge","edge","edge","edge","edge","edge","edge","edge","edge"],["edge","ice","ice","ice","key","edge",null,null,null,null,null,null,null,null,null,null,null,null,null],["edge","edge","edge","edge","edge","edge",null,null,null,null,null,null,null,null,null,null,null,null,null]]},
    {"board":[[null,null,null,null,null,null,null,"edge","edge","edge","edge",null,"edge","edge","edge",null,null,null,null],[null,null,"edge","edge","edge","edge","edge","edge","ice","ice","edge","edge","edge","ice","edge",null,null,null,null],[null,null,"edge","ice","ice","edge","ice","ice","ice","hard_ice","ice","ice","hard_ice","hard_ice","edge",null,null,null,null],[null,null,"edge","ice","ice","ice","ice","ice","ice","ice","edge","edge","ice","ice","edge",null,null,null,null],[null,null,"edge","ice","edge","edge","edge","ice","ice","ice","ice","ice","ice","ice","edge","edge",null,null,null],[null,null,"edge","ice","edge","soft_ice","edge","edge","edge","edge","edge","hard_ice","hard_ice","hard_ice","ice","edge",null,null,null],[null,null,"edge","hard_ice","ice","ice","ice","ice","ice","ice","ice","hard_ice","ice","ice","edge","edge",null,null,null],[null,null,"edge","ice","edge","ice","edge","edge","ice","coin_bag","ice","hard_ice","hard_ice","hard_ice","edge",null,null,null,null],["edge","edge","edge","ice","edge","ice","edge","ice","ice","ice","ice","ice","ice","hard_ice","edge",null,null,null,null],["edge","key","edge","ice","edge","movable_ice","edge","ice","ice","ice","ice","hard_ice","hard_ice","hard_ice","edge",null,null,null,null],["edge","hard_ice","edge","ice","edge","ice","edge","edge","edge","edge","edge","hard_ice","ice","edge","edge","edge","edge","edge",null],["edge","hard_ice","edge","ice","hard_ice","ice","edge","goal","ice","ice","lock","hard_ice","edge","edge","ice","puffle","ice","edge",null],["edge","hard_ice","edge","edge","hard_ice","edge","edge","edge","edge","edge","edge","ice","ice","ice","hard_ice","ice","ice","edge",null],["edge","hard_ice","hard_ice","hard_ice","hard_ice","edge",null,null,null,null,"edge","edge","edge","edge","edge","edge","edge","edge",null],["edge","edge","edge","edge","edge","edge",null,null,null,null,null,null,null,null,null,null,null,null,null]]},
    {"board":[["edge","edge","edge","edge","edge","edge",null,null,null,"edge","edge","edge","edge",null,null,null,null,null,null],["edge","ice","ice","ice","ice","edge",null,null,null,"edge","ice","ice","edge","edge","edge",null,null,null,null],["edge","ice","ice","ice","ice","edge","edge","edge",null,"edge","ice","ice","ice","ice","edge",null,null,null,null],["edge","edge","ice","ice","ice","ice","coin_bag","edge","edge","edge","ice","ice","ice","ice","edge","edge",null,null,null],[null,"edge","ice","ice","ice","ice","hard_ice","ice","ice","edge","ice","ice","ice","hard_ice","ice","edge","edge",null,null],[null,"edge","ice","edge","edge","ice","ice","edge","ice","edge","edge","ice","ice","ice","hard_ice","ice","edge",null,null],["edge","edge","ice","ice","edge","ice","ice","ice","hard_ice","ice","ice","ice","ice","ice","ice","edge","edge","edge",null],["edge","ice","ice","ice","edge","ice","ice","hard_ice","ice","ice","ice","ice","ice","ice","ice","ice","key","edge",null],["edge","ice","ice","ice","edge","ice","edge","movable_ice","edge","edge","edge","ice","edge","ice","ice","ice","ice","edge",null],["edge","ice","ice","edge","edge","ice","ice","ice","ice","ice","edge","hard_ice","ice","ice","ice","edge","edge","edge",null],["edge","edge","ice","edge","edge","edge","edge","edge","edge","ice","edge","ice","ice","ice","hard_ice","ice","edge",null,null],[null,"edge","ice","edge","edge","edge","edge","puffle","ice","ice","edge","ice","ice","hard_ice","ice","edge","edge",null,null],[null,"edge","ice","lock","ice","goal","edge","ice","ice","ice","edge","ice","ice","ice","edge","edge",null,null,null],[null,"edge","soft_ice","edge","edge","edge","edge","ice","ice","ice","edge","edge","ice","ice","edge",null,null,null,null],[null,"edge","edge","edge",null,null,"edge","edge","edge","edge","edge","edge","edge","edge","edge",null,null,null,null]]},
    {"board":[["edge","edge","edge","edge","edge","edge","edge","edge","edge","edge","edge","edge","edge","edge","edge","edge","edge","edge","edge"],["edge",null,null,null,null,null,null,null,null,"edge","hard_ice","hard_ice","edge","hard_ice","hard_ice",null,null,null,"edge"],["edge",null,"edge",null,null,null,null,null,null,null,"hard_ice","hard_ice","hard_ice","hard_ice",null,"edge",null,null,"edge"],["edge",null,null,null,null,null,null,null,null,null,"hard_ice","hard_ice","hard_ice","hard_ice",null,"edge","lock","edge","edge"],["edge",null,null,null,"edge",null,null,null,null,null,"hard_ice","hard_ice","hard_ice","hard_ice",null,"edge",null,"puffle","edge"],["edge",null,null,null,null,null,"hard_ice","hard_ice","hard_ice","coin_bag","hard_ice",null,null,null,null,"edge","edge","edge","edge"],["edge",null,null,null,null,null,"hard_ice",null,"hard_ice","hard_ice","hard_ice",null,null,null,null,null,null,null,"edge"],["edge",null,null,null,null,null,"hard_ice",null,null,null,null,null,null,null,null,null,null,null,"edge"],["edge","edge","hard_ice","hard_ice","hard_ice","movable_ice",null,null,null,null,null,null,"hard_ice",null,null,null,null,null,"edge"],["edge","key","hard_ice","hard_ice","hard_ice","hard_ice",null,null,null,null,null,null,null,null,null,null,null,null,"edge"],["edge",null,null,"edge",null,null,null,null,null,null,null,null,null,null,"edge","edge",null,null,"edge"],["edge",null,null,null,null,null,null,null,null,null,null,null,null,null,"edge","edge","edge","edge","edge"],["edge",null,"edge",null,"edge","puffle","edge",null,"edge",null,null,null,null,null,null,null,null,null,"edge"],["edge",null,null,null,"edge","edge","edge",null,null,null,null,null,null,null,null,null,null,null,"edge"],["edge","edge","edge","edge","edge","edge","edge","edge","edge","edge","edge","edge","edge","edge","edge","edge","edge","edge","edge"]]},
    {"board":[["edge","edge","edge","edge","edge","edge","edge","edge","edge","edge","edge","edge","edge","edge","edge","edge","edge","edge","edge"],["edge","ice","ice","hard_ice","ice","ice","ice","edge","edge","ice","ice","ice","ice","edge","ice","ice","ice","ice","edge"],["edge","ice","edge","ice","ice","ice","ice","ice","ice","ice","ice","ice","ice","ice","hard_ice","ice","ice","ice","edge"],["edge","ice","ice","ice","edge","edge","ice","ice","ice","ice","edge","edge","edge","ice","ice","edge","edge","edge","edge"],["edge","edge","edge","ice","edge","edge","edge","ice","ice","ice","edge","edge","edge","ice","ice","ice","ice","puffle","edge"],["edge","edge","ice","ice","edge","edge","edge","ice","edge","ice","edge","edge","ice","ice","movable_ice","ice","ice","edge","edge"],["edge","edge","ice","ice","ice","ice","ice","hard_ice","ice","hard_ice","ice","ice","ice","ice","ice","ice","ice","edge","edge"],["edge","edge","edge","ice","ice","ice","edge","ice","edge","ice","edge","ice","ice","ice","ice","ice","ice","ice","edge"],["edge","edge","edge","ice","ice","hard_ice","ice","hard_ice","ice","hard_ice","ice","ice","ice","ice","ice","ice","ice","ice","edge"],["edge","ice","ice","ice","ice","coin_bag","edge","ice","edge","ice","edge","edge","edge","edge","edge","edge","edge","edge","edge"],["edge","ice","ice","hard_ice","ice","ice","ice","hard_ice","ice","hard_ice","ice","ice","edge","ice","ice","ice","ice","hard_ice","edge"],["edge","ice","ice","ice","edge","ice","ice","hard_ice","ice","hard_ice","ice","ice","edge","lock","edge","goal","edge","hard_ice","edge"],["edge","ice","ice","ice","ice","ice","ice","ice","edge","ice","ice","ice","ice","hard_ice","edge","edge","edge","hard_ice","edge"],["edge","ice","ice","edge","ice","ice","ice","ice","edge","ice","edge","ice","ice","hard_ice","hard_ice","hard_ice","hard_ice","key","edge"],["edge","edge","edge","edge","edge","edge","edge","edge","edge","edge","edge","edge","edge","edge","edge","edge","edge","edge","edge"]]},

]