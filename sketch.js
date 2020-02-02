let width = 800;
let height = 800;
let maxDepth;
let colors = [];
let startX;
let startY;
let w;
let h;
let canvas;
let maxReal;
let minReal;
let maxIm;
let minIm;
let maxmap;

function def() {
    maxReal = 2;
    maxIm = 2;
    minIm = -2;
    minReal = -2;
    maxDepth = 40;
}

function setup() {
    def();
    let maxi = 8;
    let maxj = 8;
    let maxk = 4;
    maxmap = maxi * maxj * maxk;
    for (let i = 0; i < maxi; i++) {
        for (let j = 0; j < maxj; j++) {
            for (let k = 0; k < maxk; k++) {
                colors.push(color(floor((255 / maxi) * i), floor((255 / maxj) * j), floor((255 / maxk) * k)));
            }
        }
    }
    createCanvas(width, height);
    canvas = createImage(width, height);
    paint(minReal, maxReal, minIm, maxIm);
}


function paint(minValueReal, maxValueReal, minValueIm, maxValueIm) {
    canvas.loadPixels();
    for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
            let real = map(x, 0, canvas.width, minValueReal, maxValueReal);
            let imagine = map(y, 0, canvas.height, minValueIm, maxValueIm);
            let n = mandel(1, real, imagine, real, imagine);
            let color_ind = int(map(n, 1, maxDepth, maxmap-1, 0));
            let index = (x + y * canvas.height) * 4;
            canvas.pixels[index] = red(colors[color_ind]);
            canvas.pixels[index + 1] = green(colors[color_ind]);
            canvas.pixels[index + 2] = blue(colors[color_ind]);
            // canvas.pixels[index] = map(n, 1, maxDepth, 255, 0);
            // canvas.pixels[index + 1] = map(n, 1, maxDepth, 255, 0);
            // canvas.pixels[index + 2] = map(n, 1, maxDepth, 255, 0);
            canvas.pixels[index + 3] = 255;
        }
    }
    canvas.updatePixels();
    image(canvas, 0, 0);
}

function getCoords(value, maxval) {
    if (value > maxval) {
        return maxval;
    } else if (value < 0) {
        return 0;
    }
    return value;
}

function mousePressed() {
    startX = getCoords(mouseX, canvas.width);
    startY = getCoords(mouseY, canvas.height);
}

function mouseDragged() {
    stroke(0);
    noFill();
    image(canvas, 0, 0);
    w = getCoords(mouseX, canvas.width) - startX;
    h = getCoords(mouseY, canvas.height) - startY;
    rect(startX, startY, w, h);
}

function mouseReleased() {
    let temp1 = map(startX, 0, canvas.width, minReal, maxReal);
    let temp2 = map(startX + w, 0, canvas.width, minReal, maxReal);
    maxReal = max(temp1,temp2);
    minReal = min(temp1,temp2);
    temp1 = map(startY, 0, canvas.height, minIm, maxIm);
    temp2 = map(startY + h, 0, canvas.height, minIm, maxIm);
    maxIm = max(temp1,temp2);
    minIm = min(temp1,temp2);
    paint(minReal, maxReal, minIm, maxIm);
}

function mandel(depth, real, imagine, c_real, c_imagine) {
    if (depth == maxDepth || (real * real + imagine * imagine) > 4) {
        return depth;
    }
    let newReal = real * real - imagine * imagine + c_real;
    let newImagine = 2 * real * imagine + c_imagine;
    return mandel(depth + 1, newReal, newImagine, c_real, c_imagine);
}
