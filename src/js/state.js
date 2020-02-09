var state = {
    rowsAmmount: 3,
    columnsAmmount: 0,
    baseSpeed: 4,
    containerHeight: 0,
    containerWidth: 0,
    containerRatio: 0,
    moduleSize: 0,
    shouldAnimate: false,
    force: {
        position: null,
        direction: null,
        quadrant: null,
        isVert: null,
        axis: null,
        inverse: null
    },
    modules: {
        x: [],
        y: []
    },
    allModules: [] //sanity
}

export { state };