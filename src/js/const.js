export const container = document.getElementById('visualContainer');
export const body = document.getElementsByTagName('body')[0];
export const devModeToggle = document.getElementById('devModeToggle')

export const quadrants = {
    bot: 'BOTTOM',
    top: 'TOP',
    left: 'LEFT',
    right: 'RIGHT'
}

export const positions = {
    left: 'left',
    top: 'top'
}

export const horizontalIdentity = {
    axis: 'x',
    isVert: false,
    position: 'left',
    inverseAxis: 'y'
}

export const verticalIdentity = {
    axis: 'y',
    isVert: true,
    position: 'top',
    inverseAxis: 'x'
}

export const forces = {
    [quadrants.bot]: {
        quadrantName: quadrants.bot,
        ...verticalIdentity,
        direction: 1
    },
    [quadrants.top]: {
        quadrantName: quadrants.top,
        ...verticalIdentity,
        direction: -1
    },
    [quadrants.left]: {
        quadrantName: quadrants.left,
        ...horizontalIdentity,
        direction: -1
    },
    [quadrants.right]: {
        quadrantName: quadrants.right,
        ...horizontalIdentity,
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

export const message = [
    'COMING SOON ',
    'COMING SOON ',
    'COMING SOON ',
    'COMING SOON ',
    'COMING SOON ',
    'COMING SOON '
]
