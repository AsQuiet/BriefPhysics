collision = {}

/**
 * Converts the given degrees to radians
 */
collision.rad = function(degrees) {
    return degrees * Math.PI / 180
}

/**
 * Basic object used for storing and working with points.
 */
collision.vec = function(x=0,y=0) {
    this.x = x
    this.y = y

    /**
     * Calculates the dot product of this vector and another vector.
     */
    this.dot = function(v) { return (this.x * v.x + this.y * v.y) }

    /**
     * Applies a 2D rotation matrix to this vector.
     */
    this.rotate = function(angle) {
            t = collision.rad(angle)

            x = this.x * Math.cos(t) - this.y * Math.sin(t)
            y = this.x * Math.sin(t) + this.y * Math.cos(t)

            this.x = x
            this.y = y
    }

    /**
     * Calculates and returns the distance between this vector and the given vector.
     */
    this.dist = function(v) {

        dx = this.x - v.x
        dy = this.y - v.y

        return Math.sqrt(dx * dx + dy * dy)

    }

    this.add = function(v) {
        this.x += v.x
        this.y += v.y
    }
}

collision.vec.sub = function(v, u) {
    return new collision.vec(v.x - u.x, v.y - u.y)
} 

/**
 * The box object that is used for making the collision detection easier.
 */
collision.box = function(center, w, h) {

    this.center = center

    this.topLeft = new collision.vec()
    this.topRight = new collision.vec()
    this.botLeft = new collision.vec()
    this.botRight = new collision.vec()

    this.width = w
    this.height = h

    // degrees
    this.rotation = 0

    this.calcCorners = function() {

        this.topLeft = new collision.vec(this.center.x - this.width / 2, this.center.y - this.height / 2)
        this.topRight = new collision.vec(this.center.x + this.width / 2, this.center.y - this.height / 2)

        this.botLeft = new collision.vec(this.center.x - this.width / 2, this.center.y + this.height / 2)
        this.botRight = new collision.vec(this.center.x + this.width / 2, this.center.y + this.height / 2)
            
    }

    this.getCorner = function(c) {
        switch (c) {
            case 1:return this.topLeft
            case 2:return this.topRight
            case 3:return this.botRight
            case 4:return this.botLeft
            case 0:return this.center
        }
    }

    this.rotateBox = function() {

        let tlr = collision.vec.sub(this.topLeft, this.center)
        let trr = collision.vec.sub(this.topRight, this.center)
        let blr = collision.vec.sub(this.botLeft, this.center)
        let brr = collision.vec.sub(this.botRight, this.center)
        
        tlr.rotate(this.rotation)
        trr.rotate(this.rotation)
        blr.rotate(this.rotation)
        brr.rotate(this.rotation)

        tlr.add(this.center)
        trr.add(this.center)
        blr.add(this.center)
        brr.add(this.center)
        
        this.topLeft = tlr
        this.topRight = trr
        this.botLeft = blr
        this.botRight = brr
    
    }

    this.calcCorners()

}


// *************************************************************
// COLLISION DETECTION FUNCTIONS => functions that user will call
// *************************************************************


/**
 * Detects the collision of two rectangles with no rotation.
 */
collision.rect = function(x1, y1, w1, h1, x2, y2, w2, h2) {
    return (x1 <= x2 + w2 &&
            x1 + w1 >= x2 &&
            y1 <= y2 + h2 &&
            y1 + h1 >= y2)
}

collision.rectRot = function(x1, y1, w1, h1, a1, x2, y2, w2, h2, a2) {

    // constructing boxes
    box1 = new collision.box(new collision.vec(x1 + w1 / 2, y1 + h1 / 2), w1, h1)
    box2 = new collision.box(new collision.vec(x2 + w2 / 2, y2 + h2 / 2), w2, h2)

    box1.rotation = a1
    box2.rotation = a2

    box1.rotateBox()
    box2.rotateBox()  
    
    // finding the corners to use => wich of the four corners are closest to each other
    let box1ClosestPoint, box2ClosestPoint;

    let recordDist = Infinity
    for (let i = 1; i < 5; i++) {

        for (let j = 1; j < 5; j++) {

            d = (box1.getCorner(i)).dist(box2.getCorner(j))
            // console.log(str(d) + " - " + str(i) +  "   *   " + str(j))
            if (d < recordDist) {
                box1ClosestPoint = i
                box2ClosestPoint = j
                recordDist = d
            }

        }

    }

    console.log(box1)
    console.log(box2)

    console.log(box1ClosestPoint)
    console.log(box2ClosestPoint)

    return false
}