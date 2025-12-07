import {Container, Graphics, Sprite, Texture, Rectangle} from "pixi.js";
import {gsap} from "gsap";

import {PixiPlugin} from "gsap/PixiPlugin";
import PixelContainer from "./pixel-container.js";
gsap.registerPlugin(PixiPlugin);

export default class CellSlider extends Container{
    
    constructor(options, props = {}){
        super(props);
        
        this.app = options.app;
        this.squareSize = options.squareSize;
        this.blurredScaledTextures = options.blurredScaledTextures;
        this.scaledTextures = options.scaledTextures;
        this.cellX = options.cellX;
        this.cellY = options.cellY;
        
        this.buildSlides();
    }

    buildSlides(){
        let frame = new Rectangle((this.cellX * this.squareSize),(this.cellY * this.squareSize), this.squareSize, this.squareSize);
        this.scaledTextures.forEach((scaledTexture, n) => {
            // let blurredScaledTexture = this.blurredScaledTextures[n]; // No more blurred
            
            // The slide "wrapper"
            let slideContainer = new Container();
            slideContainer.sortableChildren = true;
            slideContainer.label = scaledTexture.renderTexture.label;
            slideContainer._zIndex = n > 0 ? 0:1;

            
            //Container for pixel mode;
            let pixelContainer = new PixelContainer({
                app:this.app,
                offsetX:this.cellX, 
                offsetY:this.cellY, 
                texture:scaledTexture.renderTexture, 
                index:n,
                squareSize:this.squareSize
            });
            
            slideContainer.addChild(pixelContainer);
            pixelContainer._zIndex = 2;

            // Blurred Mode

            let pieceTexture = new Texture({
                source:scaledTexture.renderTexture, 
                frame:frame,
            });
            // let pieceBlurredTexture = new Texture({source:blurredScaledTexture.renderTexture, frame:frame}) // No more blurred
            
            let sprite = new Sprite(pieceTexture);
            sprite.width = this.squareSize;
            sprite.height = this.squareSize;
            slideContainer.addChild(sprite);
            sprite.label = 'unblurred';
            sprite._zIndex = 0;
            
            
            //
            // let blurredSprite = new Sprite(pieceBlurredTexture); // No more blurred
            // blurredSprite.width = this.squareSize;
            // blurredSprite.height = this.squareSize;
            // slideContainer.addChild(blurredSprite);
            // blurredSprite.interactive = true;
            // blurredSprite.label = 'blurred';
            // blurredSprite._zIndex = 3;
            // blurredSprite.on('mouseenter', (e) => {
            //     gsap.to(blurredSprite, {alpha:0});
            // })



            this.addChild(slideContainer);
        });
    }
}
