let state = {
    rowsAmmount: 3,
    columnsAmmount: 0,
    baseSpeed: 7,

    maxSpeed: 22,

    containerHeight: 0,
    containerWidth: 0,
    containerRatio: 0,
    moduleSize: 0,
    center: {
        X: null,
        Y: null,
    },
    maxPossibleDistance: Infinity,
    shouldAnimate: false,
    force: {},
    prevForce: {},
    modules: {
        x: [],
        y: []
    },
    allModules: []
}

export { state };
