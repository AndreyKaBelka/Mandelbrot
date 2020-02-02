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
let scheme = 0; //0 - Black\White, 1 - Colored

function def() {
    maxReal = 2;
    maxIm = 2;
    minIm = -2;
    minReal = -2;
    maxDepth = 150;
}

function init_color(){
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
}

function setup() {
    def();
    init_color();
    button_redraw = document.getElementById("redraw_btn");
    selected_maxit = document.getElementsByName("maxiter")[0];
    button_redraw.onclick = () => {
        maxDepth = int(selected_maxit.value);
        paint(minReal, maxReal, minIm, maxIm);
    }
    button_def = document.getElementById("default_btn");
    button_def.onclick = () => {
        def();
        selected_maxit.selectedIndex = 3;
        paint(minReal, maxReal, minIm, maxIm);
    }
    createCanvas(width, height);
    canvas = createImage(width, height);
    paint(minReal, maxReal, minIm, maxIm);
}

function colored(index, n) {
    switch (scheme) {
        case 0: {
            canvas.pixels[index] = map(n, 1, maxDepth, 255, 0);
            canvas.pixels[index + 1] = map(n, 1, maxDepth, 255, 0);
            canvas.pixels[index + 2] = map(n, 1, maxDepth, 255, 0);
            break;
        }
        case 1: {
            let color_ind = int(map(n, 1, maxDepth, maxmap - 1, 0));
            canvas.pixels[index] = red(colors[color_ind]);
            canvas.pixels[index + 1] = green(colors[color_ind]);
            canvas.pixels[index + 2] = blue(colors[color_ind]);
            break;
        }
    }
    canvas.pixels[index + 3] = 255;
}

function paint(minValueReal, maxValueReal, minValueIm, maxValueIm) {
    canvas.loadPixels();
    for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
            let real = map(x, 0, canvas.width, minValueReal, maxValueReal);
            let imagine = map(y, 0, canvas.height, minValueIm, maxValueIm);
            let n = mandel(1, real, imagine, real, imagine);
            let index = (x + y * canvas.height) * 4;
            colored(index, n);
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
    startX = null;
    startY = null;
    if (!(mouseX > canvas.width || mouseX < 0)) startX = mouseX;
    if (!(mouseY > canvas.height || mouseY < 0)) startY = mouseY;
}

function mouseDragged() {
    if (startX && startY) {
        stroke(0);
        noFill();
        image(canvas, 0, 0);
        w = getCoords(mouseX, canvas.width) - startX;
        h = getCoords(mouseY, canvas.height) - startY;
        rect(startX, startY, w, h);
    }
}

function mouseReleased() {
    if (startX && startY) {
        let temp1 = map(startX, 0, canvas.width, minReal, maxReal);
        let temp2 = map(startX + w, 0, canvas.width, minReal, maxReal);
        maxReal = max(temp1, temp2);
        minReal = min(temp1, temp2);
        temp1 = map(startY, 0, canvas.height, minIm, maxIm);
        temp2 = map(startY + h, 0, canvas.height, minIm, maxIm);
        maxIm = max(temp1, temp2);
        minIm = min(temp1, temp2);
        paint(minReal, maxReal, minIm, maxIm);
    }
}

function mandel(depth, real, imagine, c_real, c_imagine) {
    if (depth == maxDepth || (real * real + imagine * imagine) > 4) {
        return depth;
    }
    let newReal = real * real - imagine * imagine + c_real;
    let newImagine = 2 * real * imagine + c_imagine;
    return mandel(depth + 1, newReal, newImagine, c_real, c_imagine);
}
