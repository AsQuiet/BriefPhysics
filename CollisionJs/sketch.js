let s;
let s2;

function setup() {
    createCanvas(800,800)

    // s = collision.gen.createPolygon([100,200,300], [100,350,100])  

    s = collision.gen.createPolygonFromVecs([{
        x: 100,
        y: 100
    }, {
        x: 200,
        y: 350
    }, {
        x: 300,
        y: 100
    }])

    
   
}   

function draw() {
    background(51)
    fill(180,100);stroke(255)

    s2 = collision.gen.createEllipse(mouseX, mouseY, 100,50)
    
    // s2.setRotationCenter()
    // s2.rotate(45)
    if (collision.polyPoly(s, s2, true)) {fill(255)}

    s2.drawShape()
    s.drawShape()

    

    
}


