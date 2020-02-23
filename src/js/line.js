import { state } from './state';

export default class line {
    constructor(isVert, number) {
        this.isVert = isVert;
        this.number = number;
        this.contents = [];
        this.ghost = null;
        this.speed = 0;
    }

    linkGhost(element) {
        const { ghost } = this;
        ghost.linkedTo = element;
    }

    setGhostPosition() {
        if (this.isVert) {
            const { top } = this.ghost.linkedTo;
            const { containerHeight } = state;
            const operation = top === 0 ? 1 : Math.sign(top) * -1;
            const newPosition = top + (containerHeight * operation);
            this.ghost.top = newPosition;
        } else {
            const { left } = this.ghost.linkedTo;
            const { containerWidth } = state;
            const operation = Math.sign(left) * -1 || 1;
            const newPosition = left + (containerWidth * operation);
            this.ghost.left = newPosition;
        }
    }
}
