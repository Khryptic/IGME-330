// Returns the RGB value of a random color
const getRandomColor = () => {
    return `rgba(${getByte()}, ${getByte()}, ${getByte()},.8)`;
}

// Returns the RGB value of a random shade of red
const getRandomRedColor = () => {
    return `rgba(${getByte()}, 0, 0,.8)`;
}

// Returns the RGB value of a random shade of green
const getRandomGreenColor = () => {
    return `rgba(0, ${getByte()}, 0,.8)`;
}

// Returns the RGB value of a random shade of blue
const getRandomBlueColor = () => {
    return `rgba(0, 0, ${getByte()},.8)`;
}

// Returns a random value between two inputs
const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Gets a random number from 0 to 255 (1 byte)
const getByte = () => {
    return 55 + Math.round(Math.random() * 200);
}

export default getRandomInt;
export {getRandomColor, getRandomRedColor, getRandomBlueColor, getRandomGreenColor};