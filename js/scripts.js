const content = 'POSSIMADESIGNBOUTIQUEMODERNINTERACTIONIDENTITY';
const container = document.getElementById('visualContainer');
const modulePositions = document.getElementById('modulePositions');
const body = document.getElementsByTagName('body')[0];

const rowsAmmount = 3;
let columnsAmmount = 0;
let baseSpeed = 3;

const quadrants = {
    bot: 'BOTTOM',
    top: 'TOP',
    left: 'LEFT',
    right: 'RIGHT'
}

let containerHeight = 0;
let containerWidth = 0;
let containerRatio = 0;
let moduleSize = 0;
let dynamicCss = '';

let shouldAnimate = false;
let force = {
    position: null,
    direction: null,
    quadrant: null,
    isVert: null,
    axis: null,
    inverse: null
}

let modules = {
    x: [],
    y: []
}

let horizontalForce = {
    axis: 'x',
    isVert: false,
    position: 'left'
}

let verticalForce = {
    axis: 'y',
    isVert: true,
    position: 'top',
    inverse: horizontalForce
}

horizontalForce.inverse = verticalForce;

let allGhosts = [];
let allModules = []; //sanity

let hash = 0;
getNewHash = () => hash++;

class module {
    constructor(x, y, isGhost = false) {
        this.x = x;
        this.y = y;
        this.isGhost = isGhost;
        this.id = `m${getNewHash()}${isGhost ? 'g' : ''}`;
        this.top = y * moduleSize;
        this.left = x * moduleSize;
        this.domElement = this.createDomElement();
    }

    getRight() {
        return this.left + moduleSize;
    }

    getBottom() {
        return this.top + moduleSize;
    }

    createDomElement() {
        const { x, y } = this;
        let newElement = document.createElement("div");
        newElement.className = "module";
        newElement.id = this.id;
        newElement.innerText = `
        #${y * columnsAmmount + x}
        x: ${x}, y:${y}
        `;
        return newElement;
    }

    getStyleString() {
        return `#${this.id}{ top: ${this.top}px; left:${this.left}px; }`
    }
}

function updateForceTo(newForce, direction) {
    const { axis, isVert, position, inverse } = newForce;
    debugger;
    force.axis = axis;
    force.isVert = isVert;
    force.position = position;
    force.inverse = inverse;
    force.direction = direction;
}

function prepContainer() {
    containerHeight = Math.floor(container.offsetHeight / rowsAmmount) * rowsAmmount;
    moduleSize = containerHeight / rowsAmmount;
    columnsAmmount = Math.floor(container.offsetWidth / moduleSize);
    containerWidth = columnsAmmount * moduleSize;
    containerRatio = containerHeight / containerWidth;
    container.style.height = `${containerHeight}px`;
    container.style.width = `${containerWidth}px`;
}

function getColumns() {
    let width = container.offsetWidth;
    columnsAmmount = Math.floor((width * 1.1) / moduleSize);
}

function prepModules() {
    const emptyLine = () => ({
        contents: [],
        isGhostActive: false,
        ghost: null,
        speed: 0,
        debt: 0
    })

    //prep regualr modules
    for (let i = 0; i < rowsAmmount; i++) {
        modules.x[i] = emptyLine();
        for (let e = 0; e < columnsAmmount; e++) {
            if (i === 0) modules.y[e] = emptyLine();
            let newElement = new module(e, i);
            modules.x[i].contents[e] = newElement;
            modules.y[e].contents[i] = newElement;
            container.appendChild(newElement.domElement);
            allModules.push(newElement);
        }
    }

    //prep ghosts
    for (let i = 0; i < rowsAmmount; i++) {
        const newGhost = new module(-1, i, true);
        modules.x[i].ghost = newGhost;
        container.appendChild(newGhost.domElement);
        allGhosts.push(newGhost);
    }
    for (let e = 0; e < columnsAmmount; e++) {
        const newGhost = new module(e, -1, true)
        container.appendChild(newGhost.domElement);
        modules.y[e].ghost = newGhost;
        allGhosts.push(newGhost);
    }
}

function createBaseCss() {
    const baseCss = `
    .module {
        width: ${moduleSize}px;
        height: ${moduleSize}px;
    }`
    document.getElementById('baseCss').textContent = baseCss;
}

function setListeners() {
    container.addEventListener('mouseenter', () => {
        shouldAnimate = true;
    })
    container.addEventListener('mouseleave', () => {
        shouldAnimate = false;
        force.quadrant = null;
        force.direction = null;
        force.position = null;
    })
    container.addEventListener('mousemove', (event) => {
        let mouseX = (event.clientX - container.offsetLeft) * containerRatio;
        let mouseY = event.clientY - container.offsetTop;
        if (mouseY > mouseX) {
            if (mouseX > containerHeight - mouseY) {
                updateForceTo(verticalForce, 1)
                changeQuadrant(quadrants.bot);
            } else {
                updateForceTo(horizontalForce, -1)
                changeQuadrant(quadrants.left)
            }
        } else {
            if (mouseX < containerWidth * containerRatio - mouseY) {
                updateForceTo(verticalForce, -1)
                changeQuadrant(quadrants.top)
            } else {
                updateForceTo(horizontalForce, 1)
                changeQuadrant(quadrants.right)
            }
        }
    })

}

function changeQuadrant(newQuad) {
    if (force.quadrant !== newQuad) {
        force.quadrant = newQuad;
        console.log(`QUADRANT CHANGED TO: ${newQuad}`)
    }
}

function animationFrame() {
    if (shouldAnimate) {
        collectCss(true)
    }
    animationId = requestAnimationFrame(animationFrame);
}

function initialModuleCssCollection() {
    collectCss();
}

function collectCss(updatePosition = false) {
    let newCss = '';
    const all = [...allModules, ...allGhosts]
    all.forEach((singleModule) => {
        if (updatePosition) setNewPosition(singleModule);
        newCss += singleModule.getStyleString()
    });
    modulePositions.textContent = newCss;
}

function setNewPosition(element) {
    if (element.x === 0 && element.y === 2) {
        //debugger
        console.log('new position of 0')
    }
    const ammount = baseSpeed * force.direction;
    element[force.position] += ammount;


    const { top, left } = element;
    const bottom = top + moduleSize;
    const right = left + moduleSize;


    if (!element.isGhost) {
        switch (force.quadrant) {
            case quadrants.bot:
                if (
                    !modules.y[element.x].isGhostActive &&              // column doesn't already have an active ghost
                    bottom > containerHeight                            // module actually has gone too far
                ) {
                    setGhost(element, modules.y[element.x]);
                    break;
                }
                if (top > containerHeight) {
                    shiftElement(element, modules.y[element.x]);
                    break;
                }
                break;
            case quadrants.top:
                if (
                    !modules.y[element.x].isGhostActive &&
                    top < 0
                ) {
                    setGhost(element, modules.y[element.x]);
                    break;
                }
                if (bottom < 0) {
                    shiftElement(element, modules.y[element.x]);
                    break;
                }
                break;
            case quadrants.left:
                if (
                    !modules.x[element.y].isGhostActive &&
                    left < 0
                ) {
                    setGhost(element, modules.x[element.y]);
                    break;
                }
                if (right < 0) {
                    shiftElement(element, modules.x[element.y]);
                    break;
                }
                break;
            case quadrants.right:
                if (
                    !modules.x[element.y].isGhostActive &&
                    right > containerWidth
                ) {
                    setGhost(element, modules.x[element.y]);
                    break;
                }
                if (left > containerWidth) {
                    shiftElement(element, modules.x[element.y]);
                    break;
                }
                break;
            default:
                break;
        }
    }
}

function setGhost(element, container) {
    const { ghost } = container;
    if (element.x === 0 && element.y === 2) {
        //debugger
        console.log('new GHOST of 0')
    }
    if (force.direction === 1) {
        if (force.quadrant === quadrants.bot) {
            ghost.top = 0 - (containerHeight - element.top + baseSpeed);
        } else {
            ghost.left = 0 - (containerWidth - element.left + baseSpeed);
        }
    } else {
        if (force.quadrant === quadrants.top) {
            ghost.top = containerHeight + element.top + baseSpeed;
        } else {
            ghost.left = containerWidth + element.left + baseSpeed;
        }
    }
    //ghost[force.position] = (force.isVert ? containerHeight : containerWidth) + (element[force.position] * force.direction * -1); 
    container.isGhostActive = true;
    container.ghost.innerHTML = element.innerHTML;  /////// CHECK THIS!!
}

function shiftElement(element, container) {
    const oldGhost = container.ghost;
    const { contents } = container;
    const { axis, inverse } = force;
    const iAxis = inverse.axis;
    container.isGhostActive = false;
    container.ghost = element;

    oldGhost.isGhost = false;
    element.isGhost = true;

    contents.splice(element[axis], 1);                                  // remove old element from container since it is now a ghost

    if (force.direction === 1) {
        insertFirst(contents, oldGhost);
    } else {
        contents.push(oldGhost)
    }

    
    for (let i = 0; i < contents.length; i++) {
        //debugger;
        contents[i][axis] = i;                                         // assign to each element of the container its new correct position
        const xx = modules[iAxis][i];
        if (xx === undefined) debugger;
        xx.contents[oldGhost[iAxis]] = contents[i]; 
    }
}

function getTargetLine(element) {
    const axis = force.axisghostInv
    return modules[axis][element[axis]];
}

function insertFirst(moduleArray, moduleElement) {
    moduleArray.splice(0, 0, moduleElement)
}


(() => {
    prepContainer();
    //console.log('prepContainer');
    getColumns();
    //console.log('getColumns');
    createBaseCss();
    //console.log('createBaseCss');
    prepModules();
    //console.log('prepModules');
    initialModuleCssCollection();
    //console.log('collectCss');
    setListeners();
    //console.log('setListeners');
    //console.log(modules)
    animationId = requestAnimationFrame(animationFrame);
})()




// TODO:
// 
// Set new "active column" var
// general cleanup
//
//
//
//
//
//
