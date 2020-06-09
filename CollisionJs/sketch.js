
function setup() {
    createCanvas(800,800)

}

function draw() {
    background(51)
    

    // // drawing the first rectangle
    // push()
    // angleMode(DEGREES)
    // translate(200,200)
    // rotate(0)
    // rectMode(CENTER)
    // rect(0,0,100,100)

    // pop()
    

    // // drawing the sec rectangle
    // push()
    // angleMode(DEGREES)
    // translate(1500,250)
    // rotate(45)
    // rectMode(CENTER)
    // rect(0,0,150,150)

    // pop()
    
    // collision detection
    console.log(collision.rectRot(  200,200,100,100, 0,  300,250,150,150, 45  ) )   
    // box1 => 200,200
    // box2 => 300 250
    noLoop()
}

