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

        // Here we calculate the position of the ghost, looks messy but
        //essentially the ghost has to be on the opposite side of the real module
        if (this.data.isVert) {
            const { top, frameMovementVector } = linkedTo;
            const { containerHeight } = state;

            // We decide if we have to substract or add the height of the container
            // to the top value of the ghost. Use positive as a default for the first frame of animation.
            const operation = (Math.sign(top) * -1) || 1;

            // And we add however much the real module is going to move this frame.
            const newPosition = top + (containerHeight * operation) + frameMovementVector.top;
            ghost.top = newPosition;
            ghost.left = ghost.linkedTo.left;
        } else {
            const { left, frameMovementVector } = ghost.linkedTo;
            const { containerWidth } = state;
            let operation = (Math.sign(left) * -1) || 1;
            const newPosition = left + (containerWidth * operation) + frameMovementVector.left;
            ghost.left = newPosition;
            ghost.top = ghost.linkedTo.top;
        }
        ghost.content = linkedTo.content;
    }

    promoteGhost(newGhost) {
        const { ghost: promotedGhost, contents } = this;
        const { axis } = this.data;
        const isCurrentMovementPositive = newGhost.frameMovementVector[this.data.position] > 0

        // Remove old element from container since it is now a ghost
        contents.splice(newGhost[this.data.axis], 1);

        if (isCurrentMovementPositive) {
            contents.unshift(promotedGhost);
        } else {
            contents.push(promotedGhost)
        }

        // Set correct axis number for each module in this line.
        contents.forEach((singleModule, order) => {
            singleModule[axis] = order;
        })

        const elementToLink = isCurrentMovementPositive ? this.getLast() : this.getFirst();
        newGhost.setAsGhost(true, elementToLink);

        this.setLineGhost(newGhost);
        promotedGhost.setAsGhost(false);
        promotedGhost.offset = newGhost.offset;
        promotedGhost.compileFrameMovementVector()
    }


    getFirst() {
        return this.contents[0];
    }

    getLast() {
        return this.contents[this.contents.length - 1];
    }
}
