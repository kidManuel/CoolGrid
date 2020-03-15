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
        this.debt = {
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
        const debt = this.debt;

        if (debt.top !== 0) {
            const { top } = debt;

            //either move the full ammount, or the remainder, whichever is lower
            const totalAmmount = Math.min(Math.abs(top), state.maxSpeed);

            //actually move the module an ammount of the debt for this frame
            this.top += totalAmmount * Math.sign(top);

            //reduce debt by ammount
            const operation = Math.sign(top) * -1;
            debt.top += totalAmmount * operation;
        }

        if (debt.left !== 0) {

            //same for y
            const { left } = debt;
            const totalAmmount = Math.min(Math.abs(left), state.maxSpeed);
            this.left += totalAmmount * Math.sign(left);
            const operation = Math.sign(left) * -1;
            debt.left += totalAmmount * operation;
        }


        return `#${this.id}{ top: ${this.top}px; left:${this.left}px; }`
    }
}
