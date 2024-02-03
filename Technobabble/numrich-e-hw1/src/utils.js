//Returns a random entry in a given list
const randomElement = (list) => { return list[Math.floor(Math.random() * list.length)]; }
export default randomElement;