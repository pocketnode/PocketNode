/**
 * UCFirst uppercase's the first letter in a string.
 * @param str String
 * @returns String
 */
function UCFirst(str){
    str = str.split("");
    str[0] = str[0].toUpperCase();
    return str.join("");
}

module.exports = UCFirst;