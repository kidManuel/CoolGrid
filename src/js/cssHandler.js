import { state } from './state';
const modulePositions = document.getElementById('modulePositions');


class cssHandler {
    constructor() {
        this.modulesList = [];
        this.frameCss = '';
    }

    getModuleCss(moduleCss) {
        this.frameCss += moduleCss;
    }

    resetFrameCss() {
        this.frameCss = '';
    }

    applyCssToDom() {
        modulePositions.textContent = this.frameCss;
    }

    getAllCss() {
        state.allModules.forEach((singleModule) => {
            this.getModuleCss(singleModule.getStyleString());
        });
        this.applyCssToDom();
        this.resetFrameCss();
    }
}

export default new cssHandler();
