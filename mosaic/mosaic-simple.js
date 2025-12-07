import {Application, Assets} from 'pixi.js';

import {gsap} from "gsap";


import Grid from "./grid.js";

import {pixelsArray, clearPixelsArray} from "./pixelsArray.js";

export default class MosaicSimple{
    
    constructor(element) {
        this._wrapper = element;

        this.app = new Application();
        this._disable = this._wrapper.querySelector('.js-mosaic-simple-disable');
        this._enable = this._wrapper.querySelector('.js-mosaic-simple-enable');
        
        this.assets = {
            background:pixi_bg
        };
        
        this.grid = null;

        globalThis.__PIXI_APP__ = this.app;
        
        this.init();
        this.bindEvents();
    }
    
    async init(){
        await this.app.init({background:'#1099bb',resizeTo:this._wrapper, useContextAlpha:false, antialias:false});

        this._wrapper.appendChild(this.app.canvas);

        Assets.addBundle('background', this.assets);
        await Assets.loadBundle('background');

        this.buildStage();
    }

    bindEvents(){
        window.addEventListener('resize', app.debounce(this.onResize.bind(this)));

        this._disable.addEventListener('click', () => {
            if(!this._disable.classList.contains('is-active')){
                this._enable.classList.remove('is-active');
                this._disable.classList.add('is-active');
                pixelsArray.forEach((item,n) => {
                    gsap.set(item, {alpha:0});
                });
            }
        });
        this._enable.addEventListener('click', () => {
            if(!this._enable.classList.contains('is-active')){
                this._disable.classList.remove('is-active');
                this._enable.classList.add('is-active');
                pixelsArray.forEach((item,n) => {
                    gsap.set(item, {alpha:1});
                });
            }
        });
    }

    onResize(){
        if(this.grid){
            this.grid.destroy();
            this.app.stage.removeChild(this.grid);
        }
        this.buildStage();
    }

    buildStage(){
        if(window.matchMedia('(min-width:1200px)').matches){
            clearPixelsArray();
            this._disable.classList.remove('is-active');
            this._enable.classList.add('is-active');
            this.grid = new Grid(this.app, this.assets);
            this.grid.drawGrid();
            this.app.stage.addChild(this.grid);
            // gsap.to(this._loader, {y:'100%', duration:1.5, ease:'power3.inOut'});
        }
    }

}