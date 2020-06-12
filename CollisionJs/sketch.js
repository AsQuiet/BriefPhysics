
// shape objects
let shape1, shape2;

function setup() {
    createCanvas(800,800)

    // creating a rectangle
    shape1 = collision.gen.createRect(100,100,300,200)

    // creating a circle
    shape2 = collision.gen.createCircle(150,100,60)
}


function draw() {
    background(51)

    // styling
    fill(180,100)
    stroke(255)

    // drawing the shapes
    shape1.drawShape()
    shape2.drawShape()

    // checking for collision
    console.log(collision.polyPoly(shape1, shape2))

    // loop isn't required
    noLoop()
}


