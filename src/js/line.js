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

    setLineGhost(element) {
        this.ghost = element;
    }

    setGhostPosition() {
        const { ghost } = this;
        const { linkedTo } = ghost;
        if (this.data.isVert) {
            const { top } = linkedTo;
            const { containerHeight } = state;
            const operation = (Math.sign(top) * -1) || 1;
            const newPosition = top + (containerHeight * operation);
            ghost.top = newPosition;
            ghost.left = ghost.linkedTo.left;
        } else {
            const { left } = ghost.linkedTo;
            const { containerWidth } = state;
            let operation = (Math.sign(left) * -1) || 1;
            const newPosition = left + (containerWidth * operation);
            ghost.left = newPosition;
            ghost.top = ghost.linkedTo.top;
        }
        ghost.content = linkedTo.content;
    }

    promoteGhost(newGhost) {
        //if ((this.data.isVert === false) && (this.number === 0)) debugger;
        const { ghost: promotedGhost, contents } = this;
        const { position, axis } = this.data;
        const isCurrentMovementPositive = newGhost.frameMovementVector[this.data.position] > 0

        // remove old element from container since it is now a ghost
        contents.splice(newGhost[this.data.axis], 1);

        if (isCurrentMovementPositive) {
            contents.unshift(promotedGhost);
        } else {
            contents.push(promotedGhost)
        }

        const elementToLink = isCurrentMovementPositive ? this.getLast() : this.getFirst();
        newGhost.setAsGhost(true, elementToLink);

        this.setLineGhost(newGhost);
        promotedGhost.setAsGhost(false);
        promotedGhost.frameMovementVector[position] = newGhost.frameMovementVector[position];

        // Set correct axis number for each module in this line.
        contents.forEach((singleModule, order) => {
            singleModule[axis] = order;
        })
    }


    getFirst() {
        return this.contents[0];
    }

    getLast() {
        return this.contents[this.contents.length - 1];
    }
}
