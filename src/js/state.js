var state = {
    rowsAmmount: 3,
    columnsAmmount: 0,
    baseSpeed: 4,
    maxSpeed: 8,
    containerHeight: 0,
    containerWidth: 0,
    containerRatio: 0,
    moduleSize: 0,
    shouldAnimate: false,
    force: {
    },
    prevForce: {},
    modules: {
        x: [],
        y: []
    },
    allModules: [] //sanity
}

export { state };