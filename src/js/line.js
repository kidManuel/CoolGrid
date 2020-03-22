import { state } from './state';

export default class line {
    constructor(data, number) {
        this.data = data;
        this.number = number;
        this.contents = [];
        this.ghost = null;
        this.speed = 0;
    }

    linkGhostToElement(element) {
        const { ghost } = this;
        ghost.linkedTo = element;
    }

    setGhost(element) {
        this.ghost = element;
    }

    setGhostPosition() {
        if (this.data.isVert) {
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

    promoteGhost(newGhost) {
        const { ghost: promotedGhost } = this;
        const isCurrentMovementPositive = newGhost.frameMovementVector[this.data.position] > 0

        // remove old element from container since it is now a ghost
        this.contents.splice(newGhost[this.data.axis], 1);

        if (isCurrentMovementPositive) {
            this.contents.unshift(promotedGhost);
        } else {
            this.contents.push(promotedGhost)
        }

        const elementToLink = isCurrentMovementPositive ? this.getLast() : this.getFirst();
        newGhost.setAsGhost(true, elementToLink);
        this.setGhost(newGhost);
        promotedGhost.setAsGhost(false);
    }

    getFirst() {
        return this.contents[0];
    }

    getLast() {
        return this.contents[this.contents.length - 1];
    }
}
