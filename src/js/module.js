import  { moduleSize, columnsAmmount } from './const';

let hash = 0;
const getNewHash = () => hash++;


export default class module {
    constructor(x, y, isGhost = false) {
        //debugger;
        this.x = x;
        this.y = y;
        this.isGhost = isGhost;
        this.id = `m${getNewHash()}${isGhost ? 'g' : ''}`;
        this.top = y * moduleSize;
        this.left = x * moduleSize;
        this.domElement = this.createDomElement();
    }

    getRight() {
        return this.left + moduleSize;
    }

    getBottom() {
        return this.top + moduleSize;
    }

    createDomElement() {
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
