export class module{
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.id = `m${x}${y}`;
        this.top = y * moduleSize;
        this.left = x * moduleSize;
        this.isGhost = false;
        this.domModule = this.createDomModule();
    }

    createDomModule() {
        const {x, y} = this;
        let newElement = document.createElement("div");
        newElement.className = "module";
        newElement.id = this.id;
        newElement.innerText = `
        #${y*columnsAmmount + x}
        x: ${x}, y:${y}
        `;
        container.appendChild(newElement);
        return newElement;
    }

    getStyleString() {
        return `#${this.id}{ top: ${this.top}px; left:${this.left}px; }`
    }
}