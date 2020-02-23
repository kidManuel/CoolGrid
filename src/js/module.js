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
            direction: null,
            ammount: 0
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

    setAsGhost(isGhost) {
        this.isGhost = isGhost;
        this.linkedTo = null;
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
        const debt = this.debt.ammount;
        if (debt !== 0) {
            //either move the full ammount, or the remainder, whichever is lower
            const totalAmmount = Math.min(Math.abs(debt), state.maxSpeed);
            this[this.debt.direction] += totalAmmount * -1 * Math.sign(debt);

            //reduce debt by ammount
            const operation = Math.sign(this.debt.ammount) * -1;
            this.debt.ammount += totalAmmount * operation;
        }
        return `#${this.id}{ top: ${this.top}px; left:${this.left}px; }`
    }
}
