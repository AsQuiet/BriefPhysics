

function setup() {
    createCanvas(800,800)


}


function draw() {
    background(51)
    
    stroke(255)
    fill(180,100)
    strokeWeight(1)
    
    rect(300,300,200,200)
    line(0,0,mouseX, mouseY)

    let pts = collision.rectLine(300,300,200,200,0,0,mouseX, mouseY, true)
    strokeWeight(10)
    for (let i = 0; i < pts.length; i++) {
        point(pts[i].x, pts[i].y)
    }
}



