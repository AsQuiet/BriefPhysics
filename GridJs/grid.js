function Grid(cols, rows) {

    this.cols = (cols == undefined) ? 2 : cols
    this.rows = (rows == undefined) ? 2 : rows

    this.array = []
    for (let i = 0; i < this.cols; i++) {
        this.array.push(Array(this.rows))
    }

}

Grid.prototype.toString = function() {
    str = ""
    for (let j = 0; j < this.rows; j++) {
        for (let i = 0; i < this.cols; i++) {
            str += (this.array[i][j]).toString() + "\t"
        }
        str += "\n"
    }
    return str

}

Grid.prototype.setAll = function(func) {
    for (let i = 0; i < this.cols; i++) {
        for (let j = 0; j < this.rows; j++) {
            this.array[i][j] = func(i, j, this.array[i][j])
        }
    }
}

/**
 * Indices must be an array of objects containing x and y values.
 */
Grid.prototype.getAll = function(indices) {

    vs = []

    for (let i = 0; i < indices.length; i++) {
        index = indices[i]
        v = this.get(index.x, index.y)
        if (v != undefined) {vs.push(v)}
    }

    return vs
}

/**
 * Indices must be an array of objects containing x and y values.
 */
Grid.prototype.getAllWrapAround = function(indices) {

    vs = []

    for (let i = 0; i < indices.length; i++) {
        vs.push(this.getWrapAround(indices[i].x, indices[i].y))
    }

    return vs
}

Grid.prototype.set = function(x, y, obj) {
    if (this.checkDimensions(x,y,true)) {return undefined}
    this.array[x][y] = obj 
}

Grid.prototype.get = function(x, y) {
    if (this.checkDimensions(x,y)) {return undefined}
    return this.array[x][y]
}

Grid.prototype.getWrapAround = function(x, y) {

    if (x < 0) {
        while (x < 0) {
            x+=this.cols
        }
    } else {
        x = x % this.cols
    }

    if (y < 0) {
        while (y < 0) {
            y+=this.rows
        }
    } else {
        y = y % this.rows
    }

    return this.array[x][y] 
}

Grid.prototype.checkDimensions = function(x, y, log=false) {
    if (x < 0 || y < 0 || x >= this.cols || y >= this.cols) {
        if (log) {console.error("Given indices are out of bounds.")}
        return true
    }
    return false
}

/**
 * Returns the indices of the top, left, bottom and right neighbours of the given index.
 */
Grid.prototype.getNeighbours = function(x, y) {

    return [
        {
            x: x,
            y: y - 1
        }, {
            x: x + 1,
            y: y
        }, {
            x: x,
            y: y + 1
        }, {
            x: x - 1,
            y: y
        }
    ]

}

/**
 * Returns the indices of the top, top-right, right, bottom-right, bottom, bottom-left, left, and top-left neighbours of the given index.
 */
Grid.prototype.getNeighboursEight = function(x, y) {

    return [
        {
            x: x,
            y: y - 1
        }, {
            x: x + 1,
            y: y - 1
        }, {
            x: x + 1,
            y: y
        }, {
            x: x + 1,
            y: y + 1
        }, {
            x: x,
            y: y + 1
        }, {
            x: x - 1,
            y: y + 1
        }, {
            x: x - 1,
            y: y
        }, {
            x: x - 1,
            y: y - 1
        }
    ]

}

