
let angle = 0
function setup() {
    createCanvas(800,800)

}

function draw() {
    background(51)
    
    // noStroke()
    // fill(180, 100)

    // rect(400,400,150,150)

    // if (collision.rect(400,400,150,150,mouseX, mouseY,200,200)) {
    //     fill(255,0,0)
    // } else {fill(0,0,255)}

    // rect(mouseX, mouseY, 200,200)
    angle += 1
    push()

    box = new collision.box(new collision.vec(0,0), 200,200)
    box.rotation = angle 
    box.rotateBox()
    translate(400,400)
    
    stroke(255)
    strokeWeight(4)

    for (let i = 1; i < 5; i++) {
        point(box.getCorner(i).x,box.getCorner(i).y)
    }

    pop()

}