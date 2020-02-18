import module from './module';
import * as constants from './const';
import { state } from './state';

const {
    container,
    modulePositions,
    quadrants,
    forces
} = constants;

function setup() {
    state.containerHeight = Math.floor(container.offsetHeight / state.rowsAmmount) * state.rowsAmmount;
    state.moduleSize = state.containerHeight / state.rowsAmmount;
    state.columnsAmmount = Math.floor(container.offsetWidth / state.moduleSize);
    state.containerWidth = state.columnsAmmount * state.moduleSize;
    state.containerRatio = state.containerHeight / state.containerWidth;
    container.style.height = `${state.containerHeight}px`;
    container.style.width = `${state.containerWidth}px`;

    let width = container.offsetWidth;
    state.columnsAmmount = Math.floor((width * 1.1) / state.moduleSize);

    const baseCss = `
    .module {
        width: ${state.moduleSize}px;
        height: ${state.moduleSize}px;
    }`
    document.getElementById('baseCss').textContent = baseCss;

    state.force = forces.nullForce;
    state.prevForce = forces.nullForce;

    prepModules();
    collectCss();
    setListeners();

}

function prepModules() {
    const emptyLine = () => ({
        contents: [],
        ghost: null,
        speed: 0
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
        const newGhost = new module(-1, i, true, quadrants.right);
        state.modules.x[i].ghost = newGhost;
        container.appendChild(newGhost.domElement);
        state.allModules.push(newGhost);
    }
    for (let e = 0; e < state.columnsAmmount; e++) {
        const newGhost = new module(e, -1, true, quadrants.bot)
        state.modules.y[e].ghost = newGhost;
        container.appendChild(newGhost.domElement);
        state.allModules.push(newGhost);
    }
}

function setListeners() {
    container.addEventListener('mouseenter', () => {
        state.shouldAnimate = true;
    })
    container.addEventListener('mouseleave', () => {
        changeQuadrant(forces.nullForce);
    })

    container.addEventListener('mousemove', (event) => {
        let mouseX = (event.clientX - container.offsetLeft) * state.containerRatio;
        let mouseY = event.clientY - container.offsetTop;
        if (mouseY > mouseX) {
            if (mouseX > state.containerHeight - mouseY) {
                changeQuadrant(forces[quadrants.bot]);
            } else {
                changeQuadrant(forces[quadrants.left])
            }
        } else {
            if (mouseX < state.containerWidth * state.containerRatio - mouseY) {
                changeQuadrant(forces[quadrants.top])
            } else {
                changeQuadrant(forces[quadrants.right])
            }
        }
    })

}


function changeQuadrant(newQuad) {
    const currentQuad = state.force;
    if (currentQuad.quadrantName !== newQuad.quadrantName) {
        state.prevForce = state.force;
        state.force = newQuad;
        console.log(newQuad);
    }
    //dont calc debt on first enter
    if (!(state.prevForce.quadrantName === 'nullForce')) {
        calculateDebt();
    }
}


function animationFrame() {
    if (state.shouldAnimate) {
        collectCss(true)
    }
    requestAnimationFrame(animationFrame);
}

function collectCss(updatePosition = false) {
    let newCss = '';
    state.allModules.forEach((singleModule) => {
        if (updatePosition && !singleModule.isGhost) setNewPosition(singleModule);
        newCss += singleModule.getStyleString();
    });
    modulePositions.textContent = newCss;
}

function setNewPosition(element) {
    const ammount = state.baseSpeed * state.force.direction;
    const position = state.force.position;
    const { top, left } = element;
    const bottom = element.getBottom();
    const right = element.getRight();
    const { x, y } = element;

    switch (state.force.quadrantName) {
        case quadrants.bot:
            //if (element.id === "m12") debugger;
            if (top + ammount > state.containerHeight) {
                shiftElement(element, getLine('y', x));
                break;
            }
            if (bottom + ammount > state.containerHeight) {
                linkGhost(element, getLine('y', x));
            }
            break;

        case quadrants.top:
            if (bottom + ammount < 0) {
                shiftElement(element, getLine('y', x));
                break;
            }
            if (top + ammount < 0) {
                linkGhost(element, getLine('y', x));
            }
            break;

        case quadrants.left:
            if (right + ammount < 0) {
                shiftElement(element, getLine('x', y));
                break;
            }
            if (left + ammount < 0) {
                linkGhost(element, getLine('x', y));
            }
            break;

        case quadrants.right:
            if (left + ammount > state.containerWidth) {
                shiftElement(element, getLine('x', y));
                break;
            }
            if (right + ammount > state.containerWidth) {
                linkGhost(element, getLine('x', y));
            }
            break;
        default:
            break;
    }
    element.applyForce(position, ammount);

}

function getLine(a, b) {
    return state.modules[a][b];
}

function linkGhost(element, line) {
    const { ghost } = line;
    if (!ghost.linkedTo) {
        element.linkedGhosts[state.force.axis] = ghost;
        ghost.linkedTo = element;
    }
}


function shiftElement(element, container) {
    const oldGhost = container.ghost;
    const { contents } = container;
    const { axis, inverse } = state.force;
    const iAxis = inverse.axis;

    container.ghost = element;
    oldGhost.setAsGhost(false);
    element.setAsGhost(true);

    contents.splice(element[axis], 1);                                  // remove old element from container since it is now a ghost


    if (state.force.direction === 1) {
        contents.unshift(oldGhost);
    } else {
        contents.push(oldGhost)
    }

    for (let i = 0; i < contents.length; i++) {
        contents[i][axis] = i;                                         // assign to each element of the container its new correct position
        const xx = state.modules[iAxis][i];
        xx.contents[oldGhost[iAxis]] = contents[i];
    }
}

function calculateDebt() {
    const axis = state.prevForce.axis;
    const lines = state.modules[axis];
    for (let e = 0; e < lines.length; e++) {
        const currentLine = lines[e];
        const firstModule = currentLine.contents[0];

        //get the two opposites
        const negative = state.prevForce.isVert ? firstModule.top : firstModule.left;
        const positive = state.prevForce.isVert ? firstModule.getBottom() : firstModule.getRight();

        //figure out which one is closest to 0, keeping sign
        const ammount = Math.abs(negative) < Math.abs(positive) ? negative : positive;

        if (ammount !== 0) {
            for (let i = 0; i < currentLine.contents.length; i++) {
                const singleModule = currentLine.contents[i];
                singleModule.debt.ammount = ammount;
                singleModule.debt.direction = state.prevForce.position;
            }
        }
    }
}


(() => {
    window.modules = state.modules;
    window.state = state;
    setup();
    requestAnimationFrame(animationFrame);
})()

// TODO:
// 
// Set new "active column" var
// general cleanup
// use foreachs whenever possible
//
//
//
//
//
