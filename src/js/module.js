import { state } from './state';

let hash = 0;
const getNewHash = () => hash++;

export default class module {
    constructor(x, y, isGhost = false, content) {
        let { moduleSize, columnsAmmount } = state;
        this.x = x;
        this.y = y;
        this.number = y * columnsAmmount + x;
        this.id = `x${this.x}y${this.y}${isGhost ? 'g' : ''}`;
        this.top = y * moduleSize;
        this.left = x * moduleSize;
        this.linkedTo = null;
        this.domElement = this.createDomElement();
        this.setAsGhost(isGhost);
        this.offset = {
            top: 0,
            left: 0,
            null: 0
        }
        this.frameMovementVector = {
            top: 0,
            left: 0
        }
        this.content = content;
    }

    getRight() {
        let { moduleSize } = state;
        return this.left + moduleSize;
    }

    getBottom() {
        let { moduleSize } = state;
        return this.top + moduleSize;
    }

    setForce(position, ammount) {
        this.frameMovementVector[position] = ammount;
    }

    resetMovementVector() {
        this.setForce('top', 0);
        this.setForce('left', 0);
    }

    applyOffset(position, ammount) {
        const { offset } = this;

        if (ammount) {
            offset[position] = ammount;
        } else {
            offset[position] = 0;
        }
    }

    calculateCurrentFrameOffset() {
        const { offset } = this;

        if (offset.top) {
            const { top } = offset;

            // This is setup for next frame
            // decide wether to move the full ammount, or all that remains, whichever is lower
            const absoluteAmmount = Math.min(Math.abs(top), state.maxSpeed);
            const signedAmmount = absoluteAmmount * Math.sign(top);

            this.setForce('top', signedAmmount);

            // Reduce outstanding offset by ammount
            offset.top -= signedAmmount;
        }


        if (offset.left) {
            const { left } = offset;

            const absoluteAmmount = Math.min(Math.abs(left), state.maxSpeed);
            const signedAmmount = absoluteAmmount * Math.sign(left);

            this.setForce('left', signedAmmount);
            offset.left -= signedAmmount;
        }
    }

    compileFrameMovementVector() {
        const position = state.force.position;
        const forceAmmount = state.baseSpeed * state.force.direction;

        this.resetMovementVector();

        // Make element calculate any outstanding offsets to move
        this.calculateCurrentFrameOffset();

        // Aka if we are not on nullforce
        if (state.force.axis) {
            this.setForce(position, forceAmmount);
        }
    }


    setAsGhost(isGhost, linkTo) {
        this.isGhost = isGhost;
        this.linkedTo = isGhost && linkTo ? linkTo : null;
        this.domElement.classList.toggle('ghost', isGhost);
    }

    createDomElement() {
        let newElement = document.createElement("div");
        newElement.className = "module";
        newElement.id = this.id;
        return newElement;
    }

    getContent() {
        switch (typeof this.content) {
            case 'string':
                return this.getStringContent();
            default:
                return ''
        }
    }

    getStringContent() {
        const { content } = this;
        return `} #${this.id}:after {content: '${content}'`
    }

    getStyleString() {
        this.top += this.frameMovementVector.top;
        this.left += this.frameMovementVector.left;
        this.resetMovementVector();

        return `#${this.id}{ top: ${this.top}px; left:${this.left}px; ${this.getContent()}}`
    }
}