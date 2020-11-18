export function randomInteger(min, max) {
    let rand = min - 0.5 + Math.random() * (max - min + 1);

    return Math.round(rand);
}

export function randomFromArray(array) {
    return array[randomInteger(0, array.length - 1)];
}

export function getRandomPosition(wrapperWidth, wrapperHeight, width, height) {
    return {
        left: randomInteger(0, wrapperWidth - width),
        top: randomInteger(0, wrapperHeight - height),
    };
}

