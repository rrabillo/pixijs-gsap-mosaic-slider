let pixelsArray = [];


const clearPixelsArray = () => {
    pixelsArray = [];
};

const pushInPixelsArray = (item) => {
    pixelsArray.push(item);
}

export { pixelsArray, clearPixelsArray, pushInPixelsArray };