
let s1;
let s2;

function setup() {
    createCanvas(800,800)

    s1 = collision.generateRect(100, 100, 200, 200)
    s2 = collision.generateRect(250, 290, 150, 150)

    s1.setRotationCenter()
    s2.setRotationCenter()

    s1.rotate(0)
    s2.rotate(13)

}   

function draw() {
    background(51)
    fill(180, 100)
    stroke(255)

    if (collision.sat(s1, s2)) {fill(255, 0, 0, 100)}

    drawShape(s1)
    drawShape(s2)
    noLoop()

}


function drawShape(s) {
    beginShape()

    for (let i = 0; i < s.vertices.length; i++) {
        vertex(s.vertices[i].x,s.vertices[i].y)
    }

    endShape(CLOSE)

}
