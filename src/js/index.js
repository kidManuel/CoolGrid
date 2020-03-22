import module from './module';
import line from './line';
import * as constants from './const';
import { state } from './state';

const {
    container,
    modulePositions,
    quadrants,
    forces,
    horizontalIdentity,
    verticalIdentity,
    positions
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
    //prep regualr modules
    for (let i = 0; i < state.rowsAmmount; i++) {
        state.modules.x[i] = new line(horizontalIdentity, i);
        for (let e = 0; e < state.columnsAmmount; e++) {
            if (i === 0) state.modules.y[e] = new line(verticalIdentity, e);
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
        const line = state.modules.x[i];
        line.ghost = newGhost;
        newGhost.linkedTo = line.contents[0];
        container.appendChild(newGhost.domElement);
        state.allModules.push(newGhost);
    }
    for (let e = 0; e < state.columnsAmmount; e++) {
        const newGhost = new module(e, -1, true);
        const line = state.modules.y[e];
        line.ghost = newGhost;
        newGhost.linkedTo = line.contents[0];
        container.appendChild(newGhost.domElement);
        state.allModules.push(newGhost);
    }
}

function setListeners() {
    const devModeToggle = document.getElementById('devModeToggle')

    devModeToggle.addEventListener('click', () => {
        container.classList.toggle('devMode', devModeToggle.checked)
    })

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
    //dont calc offset on first enter
    if (!(state.prevForce.quadrantName === 'nullForce')) {
        calculateOffset();
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
        if (updatePosition && !singleModule.linkedTo) setNewPosition(singleModule);
        newCss += singleModule.getStyleString();
    });

    state.modules.x.forEach((singleLine) => {
        if (updatePosition) singleLine.setGhostPosition();
        newCss += singleLine.ghost.getStyleString();
    })
    state.modules.y.forEach((singleLine) => {
        if (updatePosition) singleLine.setGhostPosition();
        newCss += singleLine.ghost.getStyleString();
    })
    modulePositions.textContent = newCss;
}

function setNewPosition(element) {
    const { quadrantName } = state.force;
    const forceAmmount = state.baseSpeed * state.force.direction;
    const position = state.force.position;
    const { top, left } = element;
    const bottom = element.getBottom();
    const right = element.getRight();
    const { x, y } = element;
    let outstandingAmmount = 0;

    if (element.frameMovementVector['top'] > 0) {
        outstandingAmmount = element.frameMovementVector['top'];
        if ((top + outstandingAmmount) >= state.containerHeight) {
            shiftElement(getLine('y', x), element);
        } else if ((bottom + outstandingAmmount) > state.containerHeight) {
            getLine('y', x).linkGhostToElement(element);
        }
    }

    if (element.frameMovementVector['top'] < 0) {
        outstandingAmmount = element.frameMovementVector['top'];
        if ((bottom + outstandingAmmount) <= 0) {
            shiftElement(getLine('y', x), element);
        } else if ((top + outstandingAmmount) < 0) {
            getLine('y', x).linkGhostToElement(element);
        }
    }

    if (element.frameMovementVector['left'] < 0) {
        outstandingAmmount = element.frameMovementVector['left'] < 0;
        if ((right + outstandingAmmount) <= 0) {
            shiftElement(getLine('x', y), element);
        } else if ((left + outstandingAmmount) < 0) {
            getLine('x', y).linkGhostToElement(element);
        }
    }

    if (element.frameMovementVector['left'] > 0) {
        outstandingAmmount = element.frameMovementVector['left'] < 0;
        if ((left + outstandingAmmount) >= state.containerWidth) {
            shiftElement(getLine('x', y), element);
        } else if ((right + outstandingAmmount) > state.containerWidth) {
            getLine('x', y).linkGhostToElement(element);
        }
    }

    //aka if we are not on nullforce
    if (state.force.axis) {
        element.applyForce(position, forceAmmount);
    }
}

function getLine(a, b) {
    return state.modules[a][b];
}

function shiftElement(container, newGhost) {
    const oldGhost = container.ghost;
    const { contents } = container;
    const { axis, inverseAxis } = container.data;

    container.promoteGhost(newGhost);

    // assign to each element of the container its new correct position
    for (let i = 0; i < contents.length; i++) {
        contents[i][axis] = i;
        const inverseContainer = state.modules[inverseAxis][i];
        inverseContainer.contents[oldGhost[inverseAxis]] = contents[i];
    }
}

function calculateOffset() {
    const axis = state.prevForce.axis;
    const lines = state.modules[axis];
    const { direction } = state.prevForce;
    let negative, positive;


    for (let e = 0; e < lines.length; e++) {
        const currentLine = lines[e];
        const moduleToCheck = direction === 1 ? currentLine.ghost : currentLine.getFirst();

        //get the two opposites
        if (state.prevForce.isVert) {
            negative = 0 - moduleToCheck.top;
            positive = 0 - moduleToCheck.getBottom();
        } else {
            negative = 0 - moduleToCheck.left;
            positive = 0 - moduleToCheck.getRight();
        }

        //figure out which one is closest to 0, keeping sign
        const ammount = Math.abs(negative) < Math.abs(positive) ? negative : positive;

        if (ammount) {
            for (let i = 0; i < currentLine.contents.length; i++) {
                const singleModule = currentLine.contents[i];

                //are we on a direction that has offset?
                singleModule.applyOffset(state.force.position, 0)
                singleModule.applyOffset(state.prevForce.position, ammount)
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