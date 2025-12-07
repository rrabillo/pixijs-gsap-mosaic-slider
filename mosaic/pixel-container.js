import {Container, Rectangle, Texture, Sprite, Graphics} from "pixi.js";
import {gsap} from "gsap";
import pixelGenerator from "./pixel-generator.js";
import PixelData from "./pixel-data.js";
import {pushInPixelsArray} from "./pixelsArray.js";

export default class PixelContainer extends Container{
    
    constructor(options, props) {
        super(props);
        this.app = options.app;
        this.squareSize = options.squareSize;
        this.texture = options.texture;
        this.offsetX = options.offsetX;
        this.offsetY = options.offsetY;
        this.index = options.index;
        
        this.label = 'pixel';
        this.tiles = [];
        this.buildPixels();
        
        pushInPixelsArray(this);
    }
    
    buildPixels(){
        let backgroundFrame = new Rectangle(this.offsetX * this.squareSize, this.offsetY * this.squareSize, this.squareSize, this.squareSize);
        let backgroundTexture = new Texture({source:this.texture, frame:backgroundFrame});
        let spriteBackground = new Sprite(backgroundTexture);
        spriteBackground.label = 'background';
        this.addChild(spriteBackground);        
        for(let y = 0; y < 2; y++){
            for(let x = 0; x < 2; x++){
                
                let pixelSize = this.squareSize / 2;
                
                let pixelFrame = new Rectangle((this.offsetX * this.squareSize) + (x * (this.squareSize / 2)), (this.offsetY * this.squareSize) + (y * (this.squareSize / 2)), pixelSize, pixelSize);


                let startX = (this.offsetX * this.squareSize) + (x * pixelSize);
                let startY = (this.offsetY * this.squareSize) + (y * pixelSize);
                
                // OLD UNOPTIMIZED
                // let pixelTexture = new Texture({ source: this.texture, frame: pixelFrame });
                // let color = pixelGenerator.getAverageColorFromPixels(this.app.renderer.extract.pixels(pixelTexture).pixels);
                
                // NEW WORK WITH PIXELS DIRECTLY
                let color = this.getTile(PixelData[this.index].pixels, PixelData[this.index].width, startX, startY, pixelSize);
                
                let overlay = new Graphics();
                overlay.rect((x * (this.squareSize / 2)),(y * (this.squareSize / 2)), pixelSize, pixelSize);
                overlay.fill(color);
                overlay.label = 'overlay';
                this.addChild(overlay);
                overlay.interactive = true;
                overlay.on('mouseenter', () => {
                    // gsap.to(overlay, {x:'-=10',y:'-=10',alpha:0});
                    gsap.set(overlay, {alpha:0});
                });
                this.tiles.push(overlay);
            }
        }
    }

    getTile(src, imgWidth, x, y, tileWidth) {
        const channels = 4;

        // Cast to int (values can have decimals
        imgWidth  = imgWidth  | 0;
        x         = x         | 0;
        y         = y         | 0;
        tileWidth = tileWidth | 0;

        const widthAsArrayEntry   = (imgWidth * channels) | 0;        
        const lineWidthAsArrayEntry  = (tileWidth * channels) | 0;    

        let startIndex = ((y * widthAsArrayEntry + x * channels) | 0); // First line offset in the whole array image

        let r = 0, g = 0, b = 0, a = 0;
        let count = tileWidth * tileWidth;
        
        for (let i = 0; i < tileWidth; i++) {
            let end = startIndex + lineWidthAsArrayEntry;
            for(let p = startIndex; p < end; p += 4 ){
                r += src[p];    
                g += src[p + 1]; 
                b += src[p + 2];
                a += src[p + 3];
            }
            startIndex += widthAsArrayEntry;
        }
        return `rgba(${(r / count) | 0}, ${(g / count) | 0}, ${(b / count) | 0}, ${(a / 255) | 0})`
    }
    
}