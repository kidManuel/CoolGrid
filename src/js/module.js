import { state } from './state';

let hash = 0;
const getNewHash = () => hash++;


export default class module {
    constructor(x, y, isGhost = false) {
        let { moduleSize } = state;
        this.x = x;
        this.y = y;
        this.isGhost = isGhost;
        this.id = `m${getNewHash()}${isGhost ? 'g' : ''}`;
        this.top = y * moduleSize;
        this.left = x * moduleSize;
        this.domElement = this.createDomElement();
    }

    getRight() {
        let { moduleSize } = state;
        return this.left + moduleSize;
    }

    getBottom() {
        let { moduleSize } = state;
        return this.top + moduleSize;
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
