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
        return new collision.vec((this.y == 0) ? 0 : -this.y, this.x)
    }
}

collision.vec.sub = function(v, u) {
    return new collision.vec(v.x - u.x, v.y - u.y)
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

            // let rot = collision.vec.sub(this.vertices[i], this.rotationCenter)
            let rot = collision.vec.sub(this.rotationCenter,this.vertices[i])
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

    this.getEdges = function() {

        let edges = [];

        for (let i = 0; i < this.vertices.length; i++) {

            let v1 = this.vertices[i]
            let v2 = (i + 1 == this.vertices.length) ? this.vertices[0] : this.vertices[i+1]

            edges.push(collision.vec.sub(v2, v1).copy())

        }

        return edges
    }

}

collision.generateRect = function(x, y, w, h) {
    boxShape = new collision.shape()
    boxShape.vertices.push(new collision.vec(x, y))
    boxShape.vertices.push(new collision.vec(x + w, y))
    boxShape.vertices.push(new collision.vec(x + w, y + h))
    boxShape.vertices.push(new collision.vec(x, y + h))
    boxShape.center = new collision.vec(x + w/2, y + h/2)
    return boxShape
}

collision.generateRectWithCenter = function(x, y, w, h) {
    boxShape = new collision.shape()
    w2 = w / 2, h2 = h / 2
    boxShape.vertices.push(new collision.vec(x - w2, y - h2))
    boxShape.vertices.push(new collision.vec(x + w2, y - h2))
    boxShape.vertices.push(new collision.vec(x + w2, y + h2))
    boxShape.vertices.push(new collision.vec(x - w2, y + h2))
    boxShape.center = new collision.vec(x, y)
    return boxShape
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

    s1 = collision.generateRect(x1, y1, w1, h1)
    s2 = collision.generateRect(x2, y2, w2, h2)

    s1.setRotationCenter()
    s2.setRotationCenter()

    s1.rotate(a1)
    s2.rotate(a2)

    return collision.sat(s1, s2)

}


collision.sat = function(shape1, shape2) {

    // for each shape
    // step 1 get perp vectors for each edge of the shape
    // step 2 use dot product to get projection of each vertex with this edge perp
    // step 3 get smallest and biggest projections
    // step 4 check for gaps between all the projections

    // all the perpendicular lines of the edges
    let perpLines = []

    // the edges of the two shapes 
    let edges1 = shape1.getEdges(), edges2 = shape2.getEdges()

    for (let i = 0; i < edges1.length; i++) {
        perpLines.push(edges1[i].perp())
    }

    for (let i = 0; i < edges2.length; i++) {
        perpLines.push(edges2[i].perp())
    }

    for (let i = 0; i < perpLines.length; i++) {

        let amax = -Infinity;
        let amin = Infinity;
        let bmax = -Infinity;
        let bmin = Infinity;

        for (let j = 0; j < shape1.vertices.length; j++) {

            let dot = perpLines[i].dot(shape1.vertices[j])

            if (dot < amin) {
                amin = dot
            } else if (dot > amax) {
                amax = dot
            }

        }

        for (let j = 0; j < shape2.vertices.length; j++) {

            let dot = perpLines[i].dot(shape2.vertices[j])

            if (dot < bmin) {
                bmin = dot
            } else if (dot > bmax) {
                bmax = dot
            }

        }

        if ( (amin < bmax && amin > bmax) || (bmin < amax && bmin > amin) ) {
            console.log("might be colliding")
        } else {
            console.log("not colliding")
            return false
        }

    }
    console.log("coll")
    return true

}