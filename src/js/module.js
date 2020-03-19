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
    }

    getRight() {
        let { moduleSize } = state;
        return this.left + moduleSize;
    }

    getBottom() {
        let { moduleSize } = state;
        return this.top + moduleSize;
    }

    applyForce(axis, ammount) {
        this[axis] += ammount;
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
        const offset = this.offset;

        if (offset.top) {
            const { top, offsetTopThisFrame } = offset;

            //check if we have a single frame offset already decided from a past frame, else use a default
            const ammountToMoveThisFrame = offsetTopThisFrame || (state.maxSpeed * Math.sign(top));

            //actually move the module an ammount of the offset for this frame
            this.top += ammountToMoveThisFrame;

            //reduce outstanding offset by ammount
            offset.top -= ammountToMoveThisFrame;

            //this is setup for next frame
            //decide wether to move the full ammount, or all that remains, whichever is lower
            const totalAmmount = Math.min(Math.abs(offset.top), state.maxSpeed);


            offset.offsetTopThisFrame = totalAmmount * Math.sign(top);
        }

        if (offset.left) {
            const { left, offsetLeftThisFrame } = offset;

            const ammountToMoveThisFrame = offsetLeftThisFrame || (state.maxSpeed * Math.sign(left));
            this.left += ammountToMoveThisFrame;

            offset.left -= ammountToMoveThisFrame;

            const totalAmmount = Math.min(Math.abs(offset.left), state.maxSpeed);

            offset.offsetLeftThisFrame = totalAmmount * Math.sign(left);
        }

        return `#${this.id}{ top: ${this.top}px; left:${this.left}px; }`
    }
}
