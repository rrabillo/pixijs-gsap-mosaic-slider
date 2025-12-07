import {Application, Assets} from 'pixi.js';

import {gsap} from "gsap";

import Grid from "./grid.js";

import {pixelsArray, clearPixelsArray} from "./pixelsArray.js";

/*
 * Some commented code in that file and its related modules under /mosaic is about an old version that had also "blurred slide".
 * I'm just keeping it in case of you never know
 */
export default class Mosaic{

    constructor(element) {
        
        this._wrapper = element;
        
        this.app = new Application();
        
        this.assets = {};
        this.grid = null;
        
        this._slides = this._wrapper.querySelectorAll('.js-mosaic-slide');
        this._buttons = this._wrapper.querySelectorAll('.js-mosaic-button');
        this._contents = this._wrapper.querySelectorAll('.js-mosaic-content');
        this._disable = this._wrapper.querySelector('.js-mosaic-disable');
        this._enable = this._wrapper.querySelector('.js-mosaic-enable');
        this._loader = this._wrapper.querySelector('.js-mosaic-loader');
        this._progress = this._wrapper.querySelector('.js-mosaic-progress');
        this._left = this._wrapper.querySelector('.js-mosaic-button-left');
        this._right = this._wrapper.querySelector('.js-mosaic-button-right');
        
        this.index = 0;
        
        
        mosaic_slides.forEach((item,n) => {
           this.assets[`slide_${n}`] = item; 
        });



        // globalThis.__PIXI_APP__ = this.app; // For debug
        
        this.init();
        this.bindEvents();
        this.updateProgress(this.index);
        
    }
    
    async init(){
        await this.app.init({background:'#1099bb',resizeTo:this._wrapper, useContextAlpha:false, antialias:false});
        
        this._wrapper.appendChild(this.app.canvas);

        Assets.addBundle('backgrounds', this.assets);
        await Assets.loadBundle('backgrounds');

        this.buildStage();
    }
    
    bindEvents(){
        window.addEventListener('resize', app.debounce(this.onResize.bind(this)));
        window.addEventListener('borlabs-cookie-consent-saved', () => {
            setTimeout(() => {
                this.onResize(); 
            }, 500);
        });
        
        app.nodesEventListener('click', this._buttons, (el,n,e) => {
            if(!el.classList.contains('is-active') && !this.isSliding){
                if(this.interval){
                    clearInterval(this.interval);
                }
                this.slideItems(n);   
            }
        });
        this._disable.addEventListener('click', () => {
            if(!this._disable.classList.contains('is-active')){
                this._enable.classList.remove('is-active');
                this._disable.classList.add('is-active');
                pixelsArray.forEach((item,n) => {
                    gsap.to(item.children, {alpha:0, duration:0.1, stagger: {
                            from: "random",
                            amount: 0.3
                        },
                        onComplete:() => {
                            if(n === pixelsArray.length - 1){
                                this._wrapper.classList.add('show-videos');
                            }
                        }
                    });
                });
                
            }
        });
        
        this._enable.addEventListener('click', () => {
            if(!this._enable.classList.contains('is-active')){
                this._disable.classList.remove('is-active');
                this._enable.classList.add('is-active');
                pixelsArray.forEach((item,n) => {
                    gsap.to(item.children, {alpha:1, duration:0.1, stagger: {
                            from: "random",
                            amount: 0.3
                        }
                    });
                });
                this._wrapper.classList.remove('show-videos');
            }
        });
        
        this._left.addEventListener('click', (e) => {
           e.preventDefault();
           if(this.isSliding) return;
            if(this.interval){
                clearInterval(this.interval);
            }
           if(this.index === 0){
               this.slideItems(this._slides.length - 1);
           }
           else{
               this.slideItems(this.index - 1);
           }
        });
        
        this._right.addEventListener('click', (e) => {
            e.preventDefault();
            if(this.isSliding) return;
            if(this.interval){
                clearInterval(this.interval);
            }
            if(this.index === (this._slides.length - 1)){
                this.slideItems(0);
            }
            else{
                this.slideItems(this.index + 1);
            }
        });
    }
    
    slideItems(clickedIndex){
        let currentSlideLabel = `slide_${this.index}`;
        let clickedSlideLabel = `slide_${clickedIndex}`;
        
        this.isSliding = true;

        if(this.timeline){
            this.timeline.kill();
        }

        let duration = 0.8;
        let ease = 'power2.inOut';
        this.timeline = gsap.timeline({onComplete:() => {
                this.isSliding = false;
            }
        });
        
        // Animate HTML
        app.nodesRemoveClass(this._buttons,'is-active');
        this._buttons[clickedIndex].classList.add('is-active');
        
        let _currentSlide = this._slides[this.index];
        let _nextSlide = this._slides[clickedIndex];
        
        let _contents = _currentSlide.querySelectorAll('.js-mosaic-content');
        let _nextContents = _nextSlide.querySelectorAll('.js-mosaic-content');
        
        app.nodesEach(_contents, (el,n) => {
            let delay = n > 0 ?  Math.random() * 0.4 : 0;
            this.timeline.to(el, {y:'100%', duration:duration, delay:delay, ease:ease, onComplete:() => {
                    _currentSlide.classList.add('d-none');
                    _nextSlide.classList.remove('d-none');
                }}, 'start');
        });

        app.nodesEach(_nextContents, (el,n) => {
            let delay = n > 0 ? Math.random() * 0.4 : 0;
            this.timeline.fromTo(el, {y:'100%'}, {y:'0%', duration:duration , delay:delay, ease:ease}, 'end');
        });
        
        this.updateProgress(clickedIndex);
        
        
        // Animate Pixi
        let direction = this.index > clickedIndex ? 'backward' : 'forward';
        
        if(direction === 'backward'){
            this.grid.cells.forEach((cell,n) => {
                let delay = Math.random() * 0.4;
                let currentSlide = cell.cellSlider.getChildByName(currentSlideLabel);
                let clickedSlide = cell.cellSlider.getChildByName(clickedSlideLabel);

                this.timeline.fromTo(currentSlide, {x:0},{x:'+='+this.grid.squareSize, duration:duration, delay:delay, ease:ease}, 'start');
                this.timeline.fromTo(clickedSlide, {x:'-'+this.grid.squareSize}, {x:0, duration:duration, delay:delay, ease:ease}, 'start');
            });
        }
        else{
            this.grid.cells.forEach((cell,n) => {
                let delay = Math.random() * 0.4;
                let currentSlide = cell.cellSlider.getChildByName(currentSlideLabel);
                let clickedSlide = cell.cellSlider.getChildByName(clickedSlideLabel);

                this.timeline.fromTo(currentSlide, {x:0},{x:'-='+this.grid.squareSize, zIndex:0, duration:duration, delay:delay, ease:ease}, 'start');
                this.timeline.fromTo(clickedSlide, {x:this.grid.squareSize}, {x:'-='+this.grid.squareSize, zIndex:1, duration:duration, delay:delay, ease:ease}, 'start');
            });
        }
        
        this.index = clickedIndex;
    }
    
    updateProgress(index){
        let percentIndex = index + 1;
        let percent = percentIndex / this._slides.length;
        gsap.to(this._progress, {scaleX:percent});
    }

    onResize(){
        if(this.grid){
            this.grid.destroy();
            this.app.stage.removeChild(this.grid);
        }
        this.buildStage();
        this.index = 0;
        app.nodesRemoveClass(this._buttons,'is-active');
        app.nodesAddClass(this._slides, 'd-none');
        this._slides[0].classList.remove('d-none');
        this._buttons[0].classList.add('is-active');
        gsap.set(this._contents, {y:'0%'});
        this.updateProgress(this.index);
    }
    
    buildStage(){ 
        if(window.matchMedia('(min-width:1200px)').matches){
            if(this.interval){
                clearInterval(this.interval);
            }
            clearPixelsArray();
            this._disable.classList.remove('is-active');
            this._enable.classList.add('is-active');
            this.grid = new Grid(this.app, this.assets);
            // const start = performance.now();
            this.grid.drawGrid();
            // const end = performance.now();
            // console.log(`Temps d'exec: ${end - start}ms`);
            this.app.stage.addChild(this.grid);
            gsap.to(this._loader, {y:'100%', duration:1.5, ease:'power3.inOut'});
            setTimeout(() => {
                this.interval = setInterval(() => {
                    if(!this.isSliding){
                        if(this.index === (this._slides.length - 1)){
                            this.slideItems(0);
                        }
                        else{
                            this.slideItems(this.index + 1);
                        }
                    }
                }, 10000); 
            }, 1000);
        }
    }    
    
}
