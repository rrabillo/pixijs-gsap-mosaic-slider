import {RenderTexture, Sprite, BlurFilter} from "pixi.js";
import PixelData from "./pixel-data.js";

// The goal is to create a background-size:'cover' texture style 
export default class ScaledTexture{
    constructor(options, blur = false) {

        //First calculate scale factor between calculated grid and actual texture
        let scaleX = options.width / options.texture.width;
        let scaleY = options.height / options.texture.height;


        //Get the biggest one
        let scale = Math.max(scaleX, scaleY);


        //Get scaled texture sizes
        let scaledTextureWidth = options.texture.width * scale;
        let scaledTextureHeight = options.texture.height * scale;
        
        this.renderTexture = RenderTexture.create({
            width:scaledTextureWidth,
            height:scaledTextureHeight,
            scaleMode:'nearest'
        });
        
        this.renderTexture.label = options.key;

        //We have to create a sprite that will render the texture, as far as i know;
        let tempSprite = new Sprite(options.texture);
        tempSprite.width = scaledTextureWidth;
        tempSprite.height = scaledTextureHeight;
        
        if(blur){
            let blurFilter = new BlurFilter({strength:50, quality:20});
            tempSprite.filters = [blurFilter];
        }
        
        options.app.renderer.render(tempSprite, {renderTexture:this.renderTexture});
        PixelData.push(options.app.renderer.extract.pixels(this.renderTexture));
        

        tempSprite.destroy({ children: true, texture: false, baseTexture: false });
    }
}
