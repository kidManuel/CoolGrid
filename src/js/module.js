import { state } from './state';
import { container } from './const';

let hash = 0;
const getNewHash = () => hash++;

export default class module {
    constructor(x, y, isGhost = false) {
        let { moduleSize } = state;
        this.x = x;
        this.y = y;
        this.id = `m${getNewHash()}${isGhost ? 'g' : ''}`;
        this.top = y * moduleSize;
        this.left = x * moduleSize;
        this.linkedGhosts = {
            x: null,
            y: null
        };
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
        debugger;
        if (this.linkedGhosts.x) {
            const { left } = this
            const { containerWidth } = state;
            const operation = Math.sign(left) * -1;
            const newPosition = left + (containerWidth * operation);
            this.linkedGhosts.x.left = newPosition;
        }
        if (this.linkedGhosts.y) {
            const { top } = this
            const { containerHeight } = state;
            const operation = Math.sign(top) * -1;
            const newPosition = top + (containerHeight * operation);
            this.linkedGhosts.y.top = newPosition;
        }
    }

    setAsGhost(isGhost) {
        this.isGhost = isGhost;
        this.linkedGhost = null;
        this.domElement.classList.toggle('ghost', isGhost)
    }

    createDomElement() {
        let { columnsAmmount } = state;
        const { x, y } = this;
        let newElement = document.createElement("div");
        newElement.className = "module";
        newElement.id = this.id;
        newElement.innerText = `
        #${y * columnsAmmount + x}
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
            this.debt.ammount -= totalAmmount;
        }
        return `#${this.id}{ top: ${this.top}px; left:${this.left}px; }`
    }
}
