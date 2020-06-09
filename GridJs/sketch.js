
g = new Grid(3,5)

function r() {
    return Math.round((Math.random() + Number.EPSILON) * 100) / 100
}

g.setAll(r)


console.log(g.getAll(g.getNeighboursEight(0,1)))

console.log(g.toString())