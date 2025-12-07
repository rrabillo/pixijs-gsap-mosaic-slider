import {Graphics} from "pixi.js";

export default class Border extends Graphics{
    
    constructor(options, props = {}) {
        super(props);
        this.rect(0, 0, options.squareSize, options.squareSize).stroke({width:1, color:0xffffff, alpha:0.2});
        this._zIndex = 4;
    }
    
}