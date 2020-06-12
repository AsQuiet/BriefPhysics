let collision = (function () {

    // contains function etc
    let gen = {}, col = {}

    /**
     * Converts the given degrees to radians
     * @param {*} degrees 
     */
    function rad(degrees) {
        return degrees * Math.PI / 180
    }


    // ===============================
    // VECTOR
    // ===============================

    /** Standard vector object */
    function vec(x = 0, y = 0) {
        this.x = x
        this.y = y
    }

    /** Returns the dot product of this vector and the given vector */
    vec.prototype.dot = function (v) {
        return this.x * v.x + this.y * v.y
    }

    /** Returns the magnitude of this vector */
    vec.prototype.mag = function () {
        return Math.sqrt(this.x * this.x + this.y * this.y)
    }

    /** Normalizes this vector object */
    vec.prototype.norm = function () {
        let m = this.mag()
        this.x /= m
        this.y /= m
    }

    /** Adds the given vector to this vector */
    vec.prototype.add = function (v) {
        this.x += v.x;
        this.y += v.y
    }

    /** Rotates this vector by applying a rotation matrix. */
    vec.prototype.rotate = function (angle) {
        angle = rad(angle)
        let s = Math.sin(angle),
            c = Math.cos(angle)
        let x = this.x * c - this.y * s
        let y = this.x * s + this.y * c
        this.x = x;
        this.y = y
    }

    /** Returns a copy of this vector. */
    vec.prototype.copy = function () {
        return new vec(this.x, this.y)
    }

    /** Static substract function for substracting two vectors. */
    vec.sub = function (v, u) {
        return new vec(v.x - u.x, v.y - u.y)
    }

    // ===============================
    // SHAPE
    // ===============================

    /** Basic shape object to handle data for collision */
    function shape() {
        this.vertices = [] // vectors
        this.center = new vec()
        this.rotationCenter = this.center.copy()
        this.rotation = 0  

        /** Draws this shape to a p5.js canvas, if included. */
        this.drawShape = (typeof beginShape == 'function') ? function() {
            beginShape() 
            for (let i = 0; i < this.vertices.length; i++) {vertex(this.vertices[i].x,this.vertices[i].y)}
            endShape(CLOSE)
        } : function(){}

    }

    /*** Rotates each vertex of this shape relative to the rotationcenter of this shape. 
     * @see shape.setRotationCenter */
    shape.prototype.rotate = function (angle) {
        this.rotation = (angle == undefined) ? this.rotation : angle

        // rotating
        for (let i = 0; i < this.vertices.length; i++) {

            let rot = vec.sub(this.vertices[i], this.rotationCenter)
            rot.rotate(this.rotation)
            rot.add(this.rotationCenter)
            this.vertices[i] = rot

        }

    }

    /** Sets the new rotation center of this shape. No arguments will cause this shape to rotate around it's center. */
    shape.prototype.setRotationCenter = function (center) {
        this.rotationCenter = (center == undefined) ? this.center : center.copy()
    }



    // ===============================
    // SHAPE GENERATORS
    // ===============================

    /** Creates a shape object with the vertices of a rectangle. */
    function createRect(x, y, w, h) {
        let r = new shape()
        r.vertices.push(new vec(x, y))
        r.vertices.push(new vec(x + w, y))
        r.vertices.push(new vec(x + w, y + h))
        r.vertices.push(new vec(x, y + h))
        r.center = new vec(x + w / 2, y + h / 2)
        return r
    }

    /** Creates a shape object with the vertices of rectangle generated from the center */
    function createRectCenter(x, y, w, h) {
        let w2 = w / 2,
            h2 = h / 2,
            r = new shape()
        r.vertices.push(new vec(x - w2, y - h2))
        r.vertices.push(new vec(x + w2, y - h2))
        r.vertices.push(new vec(x + w2, y + h2))
        r.vertices.push(new vec(x - w2, y + h2))
        return r
    }

    /** Creates a shape object with the vertices of a cirlce generated from the center of the circle and its radius. */
    function createCircle(xp, yp, r, resolution=64) {

        let increment = 360.0/resolution
        let currentAngle = 0
        let circle = new shape()

        for (let i = 0; i < resolution; i++) {
            
            let x = r * Math.cos(rad(currentAngle)) + xp
            let y = r * Math.sin(rad(currentAngle)) + yp
            currentAngle += increment
            circle.vertices.push(new vec(x, y))

        }  
        
        return circle
    }
    
    /** Returns a shape object with the vertices of an ellipse. */
    function createEllipse(xp, yp, w, h, resolution=64) {

        let increment = 360.0/resolution
        let currentAngle = 0
        let ellipse = new shape()

        for (let i = 0; i < resolution; i++) {
            
            let x = w * Math.cos(rad(currentAngle)) / 2 + xp
            let y = h * Math.sin(rad(currentAngle)) / 2 + yp
        
            currentAngle += increment
            ellipse.vertices.push(new vec(x, y))

        }  
        
        return ellipse
    
    }

    /** Returns a polygon from the given xpoints and ypoints. */
    function createPolygon(xpoints, ypoints) {
        let poly = new shape()
        
        for (let i= 0; i < xpoints.length; i++) {
            poly.vertices.push(new vec(xpoints[i], ypoints[i]))
        }

        return poly
    }

    /** Returns a polygon from the given vector objects. The vectors need to have an x and y component. */
    function createPolygonFromVecs(vertices) {
        let poly = new shape()

        for (let i = 0; i < vertices.length; i++) {
            poly.vertices.push(new vec(vertices[i].x, vertices[i].y))
        }
        
        return poly
    }
    

    // ===============================
    // COLLISION DETECTION
    // ===============================
    
    /** Returns the collision between two non-rotating rectangles. */
    function rectRect(x1, y1, w1, h1, x2, y2, w2, h2) {
        return (x1 <= x2 + w2 &&
            x1 + w1 >= x2 &&
            y1 <= y2 + h2 &&
            y1 + h1 >= y2)
    }


    // ===============================
    // EXPORTING
    // ===============================
    gen.createRect = createRect
    gen.createRectCenter = createRectCenter
    gen.createCircle = createCircle
    gen.createEllipse = createEllipse
    gen.createPolygon = createPolygon
    gen.createPolygonFromVecs = createPolygonFromVecs
    col.gen = gen
    col.rectRect = rectRect
    return col  
})()
