import module from './module';
import * as constants from './const';
import { stateBase } from './state';

const {
    container,
    modulePositions,
    quadrants,
    horizontalForce,
    verticalForce
} = constants;

let state  = stateBase;

function updateForceTo(newForce, direction) {
    const { axis, isVert, position, inverse } = newForce;
    state.force.axis = axis;
    state.force.isVert = isVert;
    state.force.position = position;
    state.force.inverse = inverse;
    state.force.direction = direction;
}

function prepContainer() {
    state.containerHeight = Math.floor(container.offsetHeight / state.rowsAmmount) * state.rowsAmmount;
    state.moduleSize = state.containerHeight / state.rowsAmmount;
    state.columnsAmmount = Math.floor(container.offsetWidth / state.moduleSize);
    state.containerWidth = state.columnsAmmount * state.moduleSize;
    state.containerRatio = state.containerHeight / state.containerWidth;
    container.style.height = `${state.containerHeight}px`;
    container.style.width = `${state.containerWidth}px`;
}

function getColumns() {
    let width = container.offsetWidth;
    state.columnsAmmount = Math.floor((width * 1.1) / state.moduleSize);
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
    for (let i = 0; i < state.rowsAmmount; i++) {
        state.modules.x[i] = emptyLine();
        for (let e = 0; e < state.columnsAmmount; e++) {
            if (i === 0) state.modules.y[e] = emptyLine();
            let newElement = new module(e, i);
            state.modules.x[i].contents[e] = newElement;
            state.modules.y[e].contents[i] = newElement;
            container.appendChild(newElement.domElement);
            state.allModules.push(newElement);
        }
    }

    //prep ghosts
    for (let i = 0; i < state.rowsAmmount; i++) {
        const newGhost = new module(-1, i, true);
        state.modules.x[i].ghost = newGhost;
        container.appendChild(newGhost.domElement);
        state.allGhosts.push(newGhost);
    }
    for (let e = 0; e < state.columnsAmmount; e++) {
        const newGhost = new module(e, -1, true)
        container.appendChild(newGhost.domElement);
        state.modules.y[e].ghost = newGhost;
        state.allGhosts.push(newGhost);
    }
}

function createBaseCss() {
    const baseCss = `
    .module {
        width: ${state.moduleSize}px;
        height: ${state.moduleSize}px;
    }`
    document.getElementById('baseCss').textContent = baseCss;
}

function setListeners() {
    container.addEventListener('mouseenter', () => {
        state.shouldAnimate = true;
    })
    container.addEventListener('mouseleave', () => {
        state.shouldAnimate = false;
        state.force.quadrant = null;
        state.force.direction = null;
        state.force.position = null;
    })
    container.addEventListener('mousemove', (event) => {
        let mouseX = (event.clientX - container.offsetLeft) * state.containerRatio;
        let mouseY = event.clientY - container.offsetTop;
        if (mouseY > mouseX) {
            if (mouseX > state.containerHeight - mouseY) {
                updateForceTo(verticalForce, 1)
                changeQuadrant(quadrants.bot);
            } else {
                updateForceTo(horizontalForce, -1)
                changeQuadrant(quadrants.left)
            }
        } else {
            if (mouseX < state.containerWidth * state.containerRatio - mouseY) {
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
    if (state.force.quadrant !== newQuad) {
        state.force.quadrant = newQuad;
    }
}

function animationFrame() {
    if (state.shouldAnimate) {
        collectCss(true)
    }
    requestAnimationFrame(animationFrame);
}

function initialModuleCssCollection() {
    collectCss();
}

function collectCss(updatePosition = false) {
    let newCss = '';
    const all = [...state.allModules, ...state.allGhosts]
    all.forEach((singleModule) => {
        if (updatePosition) setNewPosition(singleModule);
        newCss += singleModule.getStyleString()
    });
    modulePositions.textContent = newCss;
}

function setNewPosition(element) {
    const ammount = state.baseSpeed * state.force.direction;
    element[state.force.position] += ammount;


    const { top, left } = element;
    const bottom = top + state.moduleSize;
    const right = left + state.moduleSize;


    if (!element.isGhost) {
        switch (state.force.quadrant) {
            case quadrants.bot:
                if (
                    !state.modules.y[element.x].isGhostActive &&              // column doesn't already have an active ghost
                    bottom > state.containerHeight                            // module actually has gone too far
                ) {
                    setGhost(element, state.modules.y[element.x]);
                    break;
                }
                if (top > state.containerHeight) {
                    shiftElement(element, state.modules.y[element.x]);
                    break;
                }
                break;
            case quadrants.top:
                if (
                    !state.modules.y[element.x].isGhostActive &&
                    top < 0
                ) {
                    setGhost(element, state.modules.y[element.x]);
                    break;
                }
                if (bottom < 0) {
                    shiftElement(element, state.modules.y[element.x]);
                    break;
                }
                break;
            case quadrants.left:
                if (
                    !state.modules.x[element.y].isGhostActive &&
                    left < 0
                ) {
                    setGhost(element, state.modules.x[element.y]);
                    break;
                }
                if (right < 0) {
                    shiftElement(element, state.modules.x[element.y]);
                    break;
                }
                break;
            case quadrants.right:
                if (
                    !state.modules.x[element.y].isGhostActive &&
                    right > state.containerWidth
                ) {
                    setGhost(element, state.modules.x[element.y]);
                    break;
                }
                if (left > state.containerWidth) {
                    shiftElement(element, state.modules.x[element.y]);
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
    if (state.force.direction === 1) {
        if (state.force.quadrant === quadrants.bot) {
            ghost.top = 0 - (state.containerHeight - element.top + state.baseSpeed);
        } else {
            ghost.left = 0 - (state.containerWidth - element.left + state.baseSpeed);
        }
    } else {
        if (state.force.quadrant === quadrants.top) {
            ghost.top = state.containerHeight + element.top + state.baseSpeed;
        } else {
            ghost.left = state.containerWidth + element.left + state.baseSpeed;
        }
    }
    //ghost[state.force.position] = (state.force.isVert ? state.containerHeight : state.containerWidth) + (element[state.force.position] * state.force.direction * -1); 
    container.isGhostActive = true;
    container.ghost.innerHTML = element.innerHTML;  /////// CHECK THIS!!
}

function shiftElement(element, container) {
    const oldGhost = container.ghost;
    const { contents } = container;
    const { axis, inverse } = state.force;
    const iAxis = inverse.axis;
    container.isGhostActive = false;
    container.ghost = element;

    oldGhost.isGhost = false;
    element.isGhost = true;

    contents.splice(element[axis], 1);                                  // remove old element from container since it is now a ghost

    if (state.force.direction === 1) {
        insertFirst(contents, oldGhost);
    } else {
        contents.push(oldGhost)
    }


    for (let i = 0; i < contents.length; i++) {
        contents[i][axis] = i;                                         // assign to each element of the container its new correct position
        const xx = state.modules[iAxis][i];
        xx.contents[oldGhost[iAxis]] = contents[i];
    }
}

function insertFirst(moduleArray, moduleElement) {
    moduleArray.splice(0, 0, moduleElement)
}

(() => {
    prepContainer();
    getColumns();
    createBaseCss();
    prepModules();
    initialModuleCssCollection();
    setListeners();
    requestAnimationFrame(animationFrame);
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
