import randomInteger from './randomInteger'

export default function randomFromArray(array) {
    return array[randomInteger(0, array.length - 1)];
}