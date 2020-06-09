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

        this.topLeft.rotate(this.rotation)
        this.topRight.rotate(this.rotation)
        this.botLeft.rotate(this.rotation)
        this.botRight.rotate(this.rotation)
        

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

    

    return false
}