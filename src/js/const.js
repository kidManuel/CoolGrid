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

export let horizontalForce = {
    axis: 'x',
    isVert: false,
    position: 'left'
}

export let verticalForce = {
    axis: 'y',
    isVert: true,
    position: 'top',
    inverse: horizontalForce
}

horizontalForce.inverse = verticalForce;

