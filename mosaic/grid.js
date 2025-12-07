import {Assets, Container, Graphics, Sprite, Texture} from 'pixi.js'
import Cell from "./cell.js";
import ScaledTexture from "./scaled-texture.js";
import SquareSizer from "../square-sizer.js";
export default class Grid extends Container{
    
    constructor(app, assets, options = {}) {
        super(options);
        
        this.app = app;
        this.assets = assets;
        
        this.cells = [];
        this.scaledTextures = [];
        this.blurredScaledTextures = [];
        
        this.calculateDimensions();
        Object.keys(this.assets).forEach((el) => {
            this.createRenderTextures(el);
        });
    }
    
    drawGrid(){
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                
                let cell = new Cell({
                    app:this.app,
                    squareSize:this.squareSize, 
                    scaledTextures:this.scaledTextures, 
                    // blurredScaledTextures:this.blurredScaledTextures, // No more blurred
                    cellX:x, 
                    cellY:y
                });
                this.cells.push(cell);
                
                cell.x = x * this.squareSize;
                cell.y = y * this.squareSize;

                cell.label = 'col_'+x+'_row_'+y;
                this.addChild(cell);
            }
        }
    }
    
    calculateDimensions(){
        this.squareSize = SquareSizer.getSquareSize();
        
        // Ceil values, grid can overflow the canvas or it sometimes won't be big enough
        this.cols = Math.ceil(this.app.renderer.width / this.squareSize);
        this.rows = Math.ceil(this.app.renderer.height / this.squareSize);
        

        // Get gridWidth and height, so we will scale the image to it
        this.calculatedWidth = this.cols * this.squareSize;
        this.calculatedHeight = this.rows * this.squareSize;

    }

    
    createRenderTextures(el){
        let texture = Assets.get(el);

        let scaledTexture = new ScaledTexture({
            texture: texture,
            width: this.calculatedWidth,
            height:this.calculatedHeight,
            key: el,
            app: this.app
        });

        // let blurredScaledTexture = new ScaledTexture({ // No more blurred
        //     texture: texture,
        //     width: this.calculatedWidth,
        //     height:this.calculatedHeight,
        //     key: el,
        //     app: this.app
        // }, true);
        
        this.scaledTextures.push(scaledTexture);
        // this.blurredScaledTextures.push(blurredScaledTexture); // No more blurred
    }
}