export const content = 'POSSIMADESIGNBOUTIQUEMODERNINTERACTIONIDENTITY';
export const container = document.getElementById('visualContainer');
export const modulePositions = document.getElementById('modulePositions');
export const body = document.getElementsByTagName('body')[0];

export const quadrants = {
    bot: 'BOTTOM',
    top: 'TOP',
    left: 'LEFT',
    right: 'RIGHT'
}

let horizontalForce = {
    axis: 'x',
    isVert: false,
    position: 'left',
    inverse: verticalForce
}

let verticalForce = {
    axis: 'y',
    isVert: true,
    position: 'top',
    inverse: horizontalForce
}

export const forces = {
    [quadrants.bot]: {
        quadrantName: quadrants.bot,
        ...verticalForce,
        direction: 1
    },
    [quadrants.top]: {
        quadrantName: quadrants.top,
        ...verticalForce,
        direction: -1
    },
    [quadrants.left]: {
        quadrantName: quadrants.left,
        ...horizontalForce,
        direction: -1
    },
    [quadrants.right]: {
        quadrantName: quadrants.right,
        ...horizontalForce,
        direction: 1
    },
    nullForce: {
        quadrantName: 'nullForce',
        axis: null,
        isVert: null,
        position: null,
        inverse: null,
        direction: null
    }
}