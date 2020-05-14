const PNG = require("png-js");

const BOARDWIDTH = 19;
const BOARDHEIGHT = 15;

PNG.decode("level.png", function(pixelsRaw) {
    let pixels = [];
    for(var i = 0; i < pixelsRaw.length; i += 4) {
        pixels.push({r: pixelsRaw[i], g: pixelsRaw[i+1], b: pixelsRaw[i+2]})
    }

    var cumulative = 0;
    let board = [];

    for(var row = 0; row < BOARDHEIGHT; row++) {
        board[row] = new Array(BOARDWIDTH);
        for(var col = 0; col < BOARDWIDTH; col++) {
            let pixel = pixels[cumulative];
            if(pixel.r == 255 && pixel.g == 0 && pixel.b == 0) board[row][col] = "puffle"; // red
            else if(pixel.r == 0 && pixel.g == 255 && pixel.b == 255) board[row][col] = "ice"; // aqua
            else if(pixel.r == 0 && pixel.g == 148 && pixel.b == 255) board[row][col] = "hard_ice"; // slightly darker aqua
            else if(pixel.r == 255 && pixel.g == 106 && pixel.b == 0) board[row][col] = "coin_bag"; // orange
            else if(pixel.r == 76 && pixel.g == 255 && pixel.b == 0) board[row][col] = "goal"; // the green that's next to yellow
            else if(pixel.r == 0 && pixel.g == 0 && pixel.b == 0) board[row][col] = "edge";
            else board[row][col] = null;
            cumulative++;
        }
    }
    console.log(JSON.stringify({board: board}));
})