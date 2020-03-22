import { state } from './state';

let hash = 0;
const getNewHash = () => hash++;

export default class module {
    constructor(x, y, isGhost = false) {
        let { moduleSize, columnsAmmount } = state;
        this.x = x;
        this.y = y;
        this.number = y * columnsAmmount + x;
        this.id = `m${getNewHash()}${isGhost ? 'g' : ''}`;
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
    }

    getRight() {
        let { moduleSize } = state;
        return this.left + moduleSize;
    }

    getBottom() {
        let { moduleSize } = state;
        return this.top + moduleSize;
    }

    applyForce(position, ammount) {
        this.frameMovementVector[position] = ammount;
    }

    applyOffset(position, ammount) {
        const { offset } = this;

        if (ammount) {
            offset[position] = ammount;
            this.calculateCurrentFrameOffset();
        } else {
            offset[position] = 0;
        }
    }

    calculateCurrentFrameOffset() {
        const { offset, frameMovementVector } = this;

        if (offset.top) {
            const { top } = offset;

            //this is setup for next frame
            //decide wether to move the full ammount, or all that remains, whichever is lower
            const absoluteAmmount = Math.min(Math.abs(top), state.maxSpeed);
            const signedAmmount = absoluteAmmount * Math.sign(top);

            frameMovementVector.top = signedAmmount;

            //reduce outstanding offset by ammount
            offset.top -= signedAmmount;
        }


        if (offset.left) {
            const { left } = offset;

            const absoluteAmmount = Math.min(Math.abs(left), state.maxSpeed);
            const signedAmmount = absoluteAmmount * Math.sign(left);

            frameMovementVector.left = signedAmmount;
            offset.left -= signedAmmount;
        }
    }

    setAsGhost(isGhost, linkTo) {
        this.isGhost = isGhost;
        this.linkedTo = isGhost && linkTo ? linkTo : null;
        this.domElement.classList.toggle('ghost', isGhost);
    }

    createDomElement() {
        const { x, y } = this;
        let newElement = document.createElement("div");
        newElement.className = "module";
        newElement.id = this.id;
        newElement.innerText = `
        #${this.number}
        x: ${x}, y:${y}
        `;
        return newElement;
    }

    getStyleString() {
        this.calculateCurrentFrameOffset();
        this.top += this.frameMovementVector.top;
        this.left += this.frameMovementVector.left;

        return `#${this.id}{ top: ${this.top}px; left:${this.left}px; }`
    }
}