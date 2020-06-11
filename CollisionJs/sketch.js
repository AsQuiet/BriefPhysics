
let sq;
let sq2;

function setup() {
    createCanvas(800,800)

}

function draw() {
    background(51)
    
    sq = collision.generateRect(100, 100, 200, 200)
    sq2 = collision.generateRect(mouseX, mouseY, 100, 100)
    sq.setRotationCenter()
    sq.rotate(45)
    beginShape()
    for (let i = 0; i < sq2.vertices.length; i++) {vertex(sq2.getVertices(i).x,sq2.getVertices(i).y)}
    endShape(CLOSE)

    beginShape()
    for (let i = 0; i < sq.vertices.length; i++) {vertex(sq.getVertices(i).x,sq.getVertices(i).y)}
    endShape(CLOSE)

    console.log(collision.rectRectRot(100, 100, 200, 200, 45, mouseX, mouseY, 100, 100, 0))
    
}

