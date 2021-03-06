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

        // used to apply a constant rotation to this shape
        this.savedVertices = []

        /** Draws this shape to a p5.js canvas, if included. */
        this.drawShape = function(){}
        this.createDrawFunction()
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
        this.rotationCenter = (center == undefined) ? this.center : center
    }

    /** Creates the shape.drawShape function, can only be used with p5.js, should be used when creating the shape before p5 is loaded in. */
    shape.prototype.createDrawFunction = function() {
        this.drawShape = (typeof beginShape == 'function') ? function() {
            beginShape() 
            for (let i = 0; i < this.vertices.length; i++) {vertex(this.vertices[i].x,this.vertices[i].y)}
            endShape(CLOSE)
        } : function(){}
    }

    /** Saves the current vertices. Wich can then be used to apply a rotation onto. */
    shape.prototype.save = function() {
        this.savedVertices = [...this.vertices]
    }

    /** Loads the saved vertices, recommended to be used before rotating the shape. This will make sure that there is a constant rotation applied to this shape. */
    shape.prototype.load = function() {
        this.vertices = [...this.savedVertices]
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

        ellipse.center = new vec(xp, yp)
        
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

    /** Creates a triangle at the given position with the given base and height. */
    function createTriangle(x, y, base, height) {

        let triangle = new shape()

        triangle.vertices.push(new vec(x, y))
        triangle.vertices.push(new vec(x + base, y))
        triangle.vertices.push(new vec(x + base / 2, y + height))

        triangle.center = new vec(x + base / 2, y + height / 2)
        
        return triangle

    }

    /** Returns a polygon from the given vector objects. The vectors need to have x and y components. */
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
    
    // ===============================
    // POLYGON DETECTION
    // ===============================

    /** Checks whether or not the two given shapes are colliding. If the third arguments is true it will also check whether or not the second shape is inside the first shape. */
    function polyPoly(shape1, shape2, inside=true) {
        // http://www.jeffreythompson.org/collision-detection/rect-rect.php

        // is the second shape inside the first shape
        if (inside) {if (polyPoint(shape1, shape2.vertices[0].x, shape2.vertices[0].y)) {return true}}

        // Comparing each edge of the shape with each edge of the other shape. 
        for (let i = 0; i < shape1.vertices.length; i++) {

            // this edge
            let p1 = shape1.vertices[i]
            let p2 = (i + 1 == shape1.vertices.length) ? shape1.vertices[0] : shape1.vertices[i+1]

            for (let j = 0; j < shape2.vertices.length; j++) {

                // other edge 
                let p3 = shape2.vertices[j]
                let p4 = (j + 1 == shape2.vertices.length) ? shape2.vertices[0] : shape2.vertices[j + 1]

                // checking for collisions
                if (lineLine(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y, p4.x, p4.y)) {
                    return true
                }

            }
        }   

        return false
    }

    /** Returns true if the given point is inside the given polygon. */
    function polyPoint(shape, px, py) {
        let col = false

        for (let i = 0; i < shape.vertices.length; i++) {

            let vc = shape.vertices[i]
            let vn = (i + 1 == shape.vertices.length) ? shape.vertices[0] : shape.vertices[i+1]

            if (((vc.y > py && vn.y < py) || (vc.y < py && vn.y > py)) &&
                (px < (vn.x-vc.x)*(py-vc.y) / (vn.y-vc.y)+vc.x)) {
                    col = !col;
            }

        }

        return col
    }

    // ===============================
    // LINE DETECTION
    // ===============================

    /** Detects the collision between the two given line segments. If returnpoint is true, will return a vector object if collision else undefined. */
    function lineLine(a1, b1, c1, d1, a2, b2, c2, d2, returnPoint=false) {
        // https://gamedev.stackexchange.com/questions/26004/how-to-detect-2d-line-on-line-collision
        let denominator = ((c1 - a1) * (d2 - b2)) - ((d1 - b1) * (c2 - a2));
        let numerator1 = ((b1 - b2) * (c2 - a2)) - ((a1 - a2) * (d2 - b2));
        let numerator2 = ((b1 - b2) * (c1 - a1)) - ((a1 - a2) * (d1 - b1));

        // Detect coincident lines (has a problem, read below)
        if (denominator == 0 && !returnPoint) return numerator1 == 0 && numerator2 == 0;
        if (denominator == 0) {return undefined}

        let r = numerator1 / denominator;
        let s = numerator2 / denominator;

        let col = (r >= 0 && r <= 1) && (s >= 0 && s <= 1)

        if (col && returnPoint) {
            // calculating collision point
            let x = a1 + (r * (c1-a1));
            let y = b1 + (r * (d1-b1));
            return {x:x,y:y}
        }

        return col;
    }

    // ===============================
    // RECTANGLE DETECTION
    // ===============================

    /** Returns the collision between two rectangles. If givan an angle (in degrees), will check for collision between two rotating rectangles. */
    function rectRect(x1, y1, w1, h1, x2, y2, w2, h2, a1=undefined, a2=undefined) {

        if (a1 == undefined) {
            return (x1 <= x2 + w2 &&
                x1 + w1 >= x2 &&
                y1 <= y2 + h2 &&
                y1 + h1 >= y2)
        } else {
            let s1 = createRect(x1, y1, w1, h1)
            let s2 = createRect(x2, y2, w2, h2)
            
            s1.setRotationCenter()
            s2.setRotationCenter()

            s1.rotate(a1)
            s2.rotate(a2)

            return polyPoly(s1, s2,true)
        }
    }


    /** Returns the collision between a rectangle and a circle. */
    function rectCircle(x, y, w, h, cx, cy, cr) {
        
        // temp variables
        let testX = cx, testY = cy

        // finding the closest edge
        if (cx < x) {testX = x}
        else if (cx > x + w) {testX = x + w}
        if (cy < y) {testY = y}
        else if (cy > y + h) {testY = y + h}

        // checking distance to the edge
        let dx = cx - testX
        let dy = cy - testY
        let dist = Math.sqrt(dx * dx + dy * dy)

        return dist < cr
    }

    /** Detects the collision between a rectangle and a line. If return points is true, an array containing the points where the line is intersecting with the rectangle will be returned if a collision is happening. */
    function rectLine(x, y, w, h, x1, y1, x2, y2, returnPoints=false) {

        // checking for a collision between each edge and the line
        let top = lineLine(x1, y1, x2, y2, x, y, x + w, y, returnPoints)
        let bot = lineLine(x1, y1, x2, y2, x, y + h, x + w, y + h, returnPoints)
        let lef = lineLine(x1, y1, x2, y2, x, y, x, y + h, returnPoints)
        let rig = lineLine(x1, y1, x2, y2, x + w, y, x + w, y + h, returnPoints)

        // returning the collision
        if (!returnPoints) {return top || bot || lef || rig}
        
        // getting the points
        let pts = []
        if (top) {pts.push(top)}
        if (bot) {pts.push(bot)}
        if (lef) {pts.push(lef)}
        if (rig) {pts.push(rig)}
        return pts

    }   

    /** Returns true if the given point is inside the rectangle. */
    function rectPoint(rx, ry, rw, rh, px, py) {
        return  (px >= rx &&        // right of the left edge AND
                px <= rx + rw &&   // left of the right edge AND
                py >= ry &&        // below the top AND
                py <= ry + rh) 
    }

    /** Returns true if the given rectangle is colliding with the given polygon. */
    function rectPoly(rx, ry, rw, rh, xpoints, ypoints) {

        let shape1 = createRect(rx,ry,rw,rh)
        let shape2 = createPolygon(xpoints, ypoints)

        return polyPoly(shape1, shape2)
    }

    // ===============================
    // CIRCLE DETECTION
    // ===============================

    /** Detects the collision between the two given circles. */
    function circleCircle(x1, y1, r1, x2, y2, r2) {
        let dx = x2 - x1, dy = y2 - y1
        let dist = Math.sqrt(dx * dx + dy * dy)
        return dist < r1 + r2
    }

    // ===============================
    // EXPORTING
    // ===============================
    gen.createRect              = createRect
    gen.createRectCenter        = createRectCenter
    gen.createCircle            = createCircle
    gen.createEllipse           = createEllipse
    gen.createPolygon           = createPolygon
    gen.createPolygonFromVecs   = createPolygonFromVecs
    gen.createTriangle          = createTriangle
    col.gen                     = gen

    // collision
    col.rectRect                = rectRect
    col.rectCircle              = rectCircle
    col.rectLine                = rectLine
    col.rectPoly                = rectPoly
    col.rectPoint               = rectPoint

    col.circleCircle            = circleCircle
    col.lineLine                = lineLine
    col.polyPoint               = polyPoint
    col.polyPoly                = polyPoly

    return col  
})()
