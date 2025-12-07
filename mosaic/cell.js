import {Container, Texture, Sprite, Graphics} from 'pixi.js';
import Border from "./border.js";
import CellSlider from "./cell-slider.js";
export default class Cell extends Container{
    
    constructor(options,props = {}) {
        super(props);
        
        this.border = new Border(options);
        this.maskGraphic = new Graphics();
        this.maskGraphic.rect(0, 0, options.squareSize, options.squareSize).fill(0xffffff);
        this.maskGraphic.label = 'mask';
        
        this.cellSlider = new CellSlider({
            app:options.app,
            squareSize:options.squareSize, 
            scaledTextures:options.scaledTextures, 
            // blurredScaledTextures:options.blurredScaledTextures, // No more blurred
            cellX:options.cellX,
            cellY:options.cellY
        });
        this.cellSlider.mask = this.maskGraphic;
        
        this.addChild(this.border);
        this.addChild(this.cellSlider);
        this.addChild(this.maskGraphic);
    }
}