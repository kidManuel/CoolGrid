import { state } from './state';

let hash = 0;
const getNewHash = () => hash++;


export default class module {
    constructor(x, y, isGhost = false, ghostDirection = null) {
        let { moduleSize } = state;
        this.x = x;
        this.y = y;
        this.id = `m${getNewHash()}${isGhost ? 'g' : ''}`;
        this.top = y * moduleSize;
        this.left = x * moduleSize;
        this.ghostDirection = ghostDirection;
        this.domElement = this.createDomElement();
        this.setAsGhost(isGhost);
    }

    getRight() {
        let { moduleSize } = state;
        return this.left + moduleSize;
    }

    getBottom() {
        let { moduleSize } = state;
        return this.top + moduleSize;
    }

    setAsGhost(isGhost) {
        this.isGhost = isGhost;
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
        return `#${this.id}{ top: ${this.top}px; left:${this.left}px; }`
    }
}
