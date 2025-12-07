import Glide from '@glidejs/glide';
export default class MosaicMobile{
    
    constructor(element) {
        this._wrapper = element;
        this._glideEl = this._wrapper.querySelector('.glide');
        this._buttons = this._wrapper.querySelectorAll('.js-mosaic-mobile-button');
        
        this.init();
        this.bindEvents();
    }
    
    init(){
        this.glide = new Glide(this._glideEl, {
            perView:1,
            gap:0,
            type:'carousel',
            swipeThreshold:10,
        }).mount();
        
        this.glide.on('move', () => {
           app.nodesRemoveClass(this._buttons, 'is-active');
           this._buttons[this.glide.index].classList.add('is-active');
        });
    }
    
    bindEvents(){
        app.nodesEventListener('click', this._buttons, (el,n,e) => {
            this.glide.go('='+n);
        });
    }
    
}