
// shape objects
let shape1, shape2;
let angle = 0

function setup() {
    createCanvas(800,800)

    // creating a the shapes
    shape1 = collision.gen.createRect(300,100,300,200)
    shape2 = collision.gen.createTriangle(100,10,random(100, 400),random(200, 300))

    // setting the rotation center to be the triangle's center and saving it's vertices
    shape2.setRotationCenter()
    shape2.save()

}


function draw() {
    background(51)
    angle += 1

    // rotating the orignal vertices of the triangle
    shape2.load()
    shape2.rotate(angle)
    
    // styling
    fill(180,100)
    stroke(255)

    // checking for collision between the two shapes.
    if (collision.polyPoly(shape1, shape2)) {
        fill(255,0,0,150)
    }

    // drawing the shapes
    shape1.drawShape()
    shape2.drawShape()
}



