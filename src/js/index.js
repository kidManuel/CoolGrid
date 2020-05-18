import module from './module';
import line from './line';
import cssHandler from './cssHandler';
import * as constants from './const';
import { state } from './state';
import { pyth, map, distance } from './mathUtil';

const {
    body,
    devModeToggle,
    container,
    quadrants,
    forces,
    horizontalIdentity,
    verticalIdentity,
    message
} = constants;

function setup() {
    state.rowsAmmount = message.length;
    state.columnsAmmount = message.reduce((acc, curr) => Math.max(acc.length || acc, curr.length || curr));
    state.containerHeight = Math.floor(container.offsetHeight / state.rowsAmmount) * state.rowsAmmount;
    state.moduleSize = state.containerHeight / state.rowsAmmount;
    state.containerWidth = state.columnsAmmount * state.moduleSize;

    state.center.X = state.containerWidth / 2;
    state.center.Y = state.containerHeight / 2;

    state.maxPossibleDistance = pyth(state.center.X, state.center.Y);

    state.containerRatio = state.containerHeight / state.containerWidth;
    container.style.height = `${state.containerHeight}px`;
    container.style.width = `${state.containerWidth}px`;

    const { moduleSize } = state;
    const baseCss = `
    .module {
        width: ${moduleSize}px;
        height: ${moduleSize}px;
    }
    .module:after {
        font-size: ${moduleSize}px;
    }
    `
    document.getElementById('baseCss').textContent = baseCss;

    state.force = forces.nullForce;
    state.prevForce = forces.nullForce;

    prepModules();
    cssHandler.getAllCss();
    setListeners();
}

function prepModules() {
    // Prep regualr modules
    for (let i = 0; i < state.rowsAmmount; i++) {
        const currentHorizontalLine = new line(horizontalIdentity, i);
        state.modules.x.push(currentHorizontalLine);

        for (let e = 0; e < state.columnsAmmount; e++) {

            if (i === 0) {
                state.modules.y.push(new line(verticalIdentity, e));
            }
            const currentVerticalLine = state.modules.y[e];

            let newElement = new module(
                e,
                i,
                false,
                message[i][e],
                currentHorizontalLine.getSpeed.bind(currentHorizontalLine),
                currentVerticalLine.getSpeed.bind(currentVerticalLine)
            );

            currentHorizontalLine.contents.push(newElement);
            currentVerticalLine.contents.push(newElement);
            container.appendChild(newElement.domElement);
            state.allModules.push(newElement);
        }
    }

    // Prep ghosts
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

function toggleDevMode() {
    body.classList.toggle('devMode', devModeToggle.checked);
}

function setListeners() {
    devModeToggle.addEventListener('click', () => {
        toggleDevMode();
    })
    container.addEventListener('mouseenter', () => {
        state.shouldAnimate = true;
        state.inBounds = true;
    })
    container.addEventListener('mouseleave', () => {
        changeQuadrant(forces.nullForce);
        state.inBounds = false;
    })
    container.addEventListener('mousemove', (event) => {
        const { clientX, clientY } = event;
        if (state.inBounds) {
            calculateQuadrant(clientX, clientY);
            calculateLinesSpeed(clientX, clientY);
        }
    })
}

function changeQuadrant(newQuad) {
    const currentQuad = state.force;
    if (currentQuad.quadrantName !== newQuad.quadrantName) {
        state.prevForce = state.force;
        state.force = newQuad;
        // Dont calc offset on first enter
        if (!(state.prevForce.quadrantName === 'nullForce')) {
            calculateOffset();
        }
    }
}

function calculateLinesSpeed(mouseX, mouseY) {
    const { x: containerX, y: containerY } = container.getBoundingClientRect()

    const localX = mouseX - containerX;
    const localY = mouseY - containerY;
    const linesToCalc = state.modules[state.force.axis];
    const currentDistanceToCenter = distance(localX, localY, state.center.X, state.center.Y);
    const RatioFixedDistanceToCenter = currentDistanceToCenter * (state.force.isVert ? 1 : state.containerRatio);
    console.log(RatioFixedDistanceToCenter);
    //const minimumDistance = state.maxPossibleDistance * (1 - state.centerTolerance);

    const distanceToCenterModifier = map(RatioFixedDistanceToCenter, 0, state.maxPossibleDistance, 0, 1, true)

    linesToCalc.forEach((singleLine) => {
        singleLine.speed = Math.round(state.maxSpeed * distanceToCenterModifier * state.force.direction);
    })
}

function calculateQuadrant(clientX, clientY) {
    let mouseX = (clientX - container.offsetLeft) * state.containerRatio;
    let mouseY = clientY - container.offsetTop;
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
}

function animationFrame() {
    if (state.shouldAnimate) {
        setNewPositions(true)
    }
    cssHandler.getAllCss();
    requestAnimationFrame(animationFrame);
}

function setNewPositions() {
    state.allModules.forEach((singleModule) => {
        if (!singleModule.isGhost) setModulePosition(singleModule);
    });

    state.modules.x.forEach((singleLine) => {
        singleLine.setGhostPosition();
    })
    state.modules.y.forEach((singleLine) => {
        singleLine.setGhostPosition();
    })
}

function setModulePosition(element) {
    const { top, left } = element;
    const bottom = element.getBottom();
    const right = element.getRight();
    const { x, y } = element;
    let outstandingAmmount = 0;

    element.compileFrameMovementVector();

    // Bottoms
    if (element.frameMovementVector['top'] > 0) {
        outstandingAmmount = element.frameMovementVector['top'];
        if ((top + outstandingAmmount) >= state.containerHeight) {
            shiftElement(getLine('y', x), element);
        } else if ((bottom + outstandingAmmount) > state.containerHeight) {
            getLine('y', x).linkGhostToElement(element);
        }
    }

    // Top
    if (element.frameMovementVector['top'] < 0) {
        outstandingAmmount = element.frameMovementVector['top'];
        if ((bottom + outstandingAmmount) <= 0) {
            shiftElement(getLine('y', x), element);
        } else if ((top + outstandingAmmount) < 0) {
            getLine('y', x).linkGhostToElement(element);
        }
    }

    // Left
    if (element.frameMovementVector['left'] < 0) {
        outstandingAmmount = element.frameMovementVector['left'];
        if ((right + outstandingAmmount) <= 0) {
            shiftElement(getLine('x', y), element);
        } else if ((left + outstandingAmmount) < 0) {
            getLine('x', y).linkGhostToElement(element);
        }
    }

    // Right
    if (element.frameMovementVector['left'] > 0) {
        outstandingAmmount = element.frameMovementVector['left'];
        if ((left + outstandingAmmount) >= state.containerWidth) {
            shiftElement(getLine('x', y), element);
        } else if ((right + outstandingAmmount) > state.containerWidth) {
            getLine('x', y).linkGhostToElement(element);
        }
    }
}

function getLine(a, b) {
    return state.modules[a][b];
}

function shiftElement(container, shiftedElement) {
    const { ghost, contents, data: { axis, inverseAxis } } = container;
    container.shiftLine(shiftedElement);

    // Assign to each element of the container its new correct position
    for (let i = 0; i < contents.length; i++) {
        contents[i][axis] = i;
        const inverseContainer = state.modules[inverseAxis][i];
        inverseContainer.contents[ghost[inverseAxis]] = contents[i];
    }
}

function calculateOffset() {
    const axis = state.prevForce.axis;
    const lines = state.modules[axis];

    for (let e = 0; e < lines.length; e++) {
        const currentLine = lines[e];
        const moduleToCheck = currentLine.ghost;
        const negative = state.prevForce.isVert ? moduleToCheck.top : moduleToCheck.left
        const positive = state.prevForce.isVert ? moduleToCheck.getBottom() : moduleToCheck.getRight();
        const containerSize = state.prevForce.isVert ? state.containerHeight : state.containerWidth;

        const possibleValues = [
            0 - negative,
            0 - positive,
            containerSize - negative,
            containerSize - positive,
        ]

        // find smallest absolute size
        const ammount = possibleValues.sort((a, b) => {
            return Math.abs(a) > Math.abs(b) ? 1 : -1
        })[0];

        if (ammount) {
            for (let i = 0; i < currentLine.contents.length; i++) {
                const singleModule = currentLine.contents[i];
                // Are we on a direction that has offset?
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
    toggleDevMode();
    requestAnimationFrame(animationFrame);
})()

// TODO:
// 
// use getBoundingClientRect!!!!!!!!!!!
// Set new "active column" var
// general cleanup
// use foreachs whenever possible
//
//
//
//
//
