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

    this.norm = function() {
        let mag = Math.sqrt(this.x * this.x + this.y * this.y)
        this.x /= mag
        this.y /= mag
    }

    this.copy = function() {
        return new collision.vec(this.x, this.y)
    }

    this.perp = function() {
        return new collision.vec(-this.y, this.x)
    }
}

collision.vec.sub = function(v, u) {
    return new collision.vec(v.x - u.x, v.y - u.y)
} 

collision.projOverlap = function(p1, p2) {

    if (p1.max > p2.min) {return true}
    if (p1.min > p2.max) {return true}

    
    return false

}

collision.shape = function() {

    // the vertices of this shape
    this.vertices = []              // collision.vec
    this.center = new collision.vec()

    // rotation
    this.rotationCenter = new collision.vec()
    this.rotation = 0               // degrees

    this.getVertices = function(n) {
        if (n == undefined) {
            return this.vertices
        } else {
            return this.vertices[n]
        }
    }

    this.rotate = function(angle) {
        this.rotation = (angle == undefined) ? this.rotation : angle
    
        for (let i = 0; i < this.vertices.length; i++) {

            let rot = collision.vec.sub(this.vertices[i], this.rotationCenter)
            rot.rotate(this.rotation)
            rot.add(this.rotationCenter)
            this.vertices[i] = rot

        }

    }

    /**
     * Sets the rotation center of this shape. No arguments will make the shape rotate around its center.
     */
    this.setRotationCenter = function(center) {
        this.rotationCenter = (center == undefined) ? this.center.copy() : center
    }

    this.getAxis = function() {

        let axis = []

        for (let i = 0; i < this.vertices.length; i++) {

            // getting this vertex and the next vertex
            let p1 = this.vertices[i]
            
            let p2;

            if (i + 1 == this.vertices.length) {
                p2 = this.vertices[0]
            } else {p2 = this.vertices[i+1]}

            let edge = collision.vec.sub(p2, p1)

            let normal = edge.perp()
            normal.norm()
            axis.push(normal)

        }

        return axis

    }

    this.project = function(axis) {

        let max =  -Infinity, min = Infinity;

        for (let i = 0; i < this.vertices.length; i++) {

            p = axis.dot(this.vertices[i])
            if (p > max) {
                max = p
            } else if (p < min) {
                min = p
            }
        }

        return {max:max, min:min}

    }

    

}

collision.generateRect = function(x, y, w, h) {
    square = new collision.shape()
    square.vertices.push(new collision.vec(x, y))
    square.vertices.push(new collision.vec(x + w, y))
    square.vertices.push(new collision.vec(x + w, y + h))
    square.vertices.push(new collision.vec(x, y + h))
    square.center = new collision.vec(x + w/2, y + h/2)
    return square
}

collision.generateRectWithCenter = function(x, y, w, h) {
    square = new collision.shape()
    w2 = w / 2
    h2 = h / 2
    square.vertices.push(new collision.vec(x - w2, y - h2))
    square.vertices.push(new collision.vec(x + w2, y - h2))
    square.vertices.push(new collision.vec(x + w2, y + h2))
    square.vertices.push(new collision.vec(x - w2, y + h2))
    square.center = new collision.vec(x, y)
    return square
}

// *************************************************************
// COLLISION DETECTION FUNCTIONS => functions that user will call
// *************************************************************


/**
 * Detects the collision of two rectangles with no rotation.
 */
collision.rectRect = function(x1, y1, w1, h1, x2, y2, w2, h2) {
    return (x1 <= x2 + w2 &&
            x1 + w1 >= x2 &&
            y1 <= y2 + h2 &&
            y1 + h1 >= y2)
}

/**
 * Detects the collision of two rectangles with rotation using the Separating Axis Theorem.
 */
collision.rectRectRot = function(x1, y1, w1, h1, a1, x2, y2, w2, h2, a2) {

    rect1 = collision.generateRect(x1, y1, w1, h1)
    rect2 = collision.generateRect(x2, y2, w2, h2)

    rect1.setRotationCenter()
    rect2.setRotationCenter()

    rect1.rotate(a1)
    rect2.rotate(a2)

    axis1 = rect1.getAxis()
    axis2 = rect2.getAxis()
    
    for (let i = 0; i < axis1.length; i++) {

        let a = axis1[i]

        let p1 = rect1.project(a)
        let p2 = rect2.project(a)

        if (!collision.projOverlap(p1, p2)) {
            // shapes are not colliding
            return false
        }

    }

    for (let i = 0; i < axis2.length; i++) {

        let a = axis2[i]

        let p1 = rect1.project(a)
        let p2 = rect2.project(a)

        if (!collision.projOverlap(p1, p2)) {
            // shapes are not colliding
            return false
        }

    }    

    console.log("COLLISION")
    return true

}
