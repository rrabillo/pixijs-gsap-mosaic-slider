const instance = new class PixelGenerator {

    constructor() {
        this.fac = new FastAverageColor();
    }

    getAverageColorFromPixels(texturePixels) {
        let uint8ArrayColor = this.fac.getColorFromArray4(texturePixels, { algorithm: "simple" });
        return this.rgbaToCss(uint8ArrayColor);
    }

    rgbaToCss(rgbaArray) {
        const [r, g, b, a] = rgbaArray;
        const alpha = parseFloat((a / 255).toFixed(2));
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
}

export default instance;
