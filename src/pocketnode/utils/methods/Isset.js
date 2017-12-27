/**
 * Check if a piece of data is not undefined
 * @param v {*}
 * @return {boolean}
 */
function Isset(v){
    return typeof v !== "undefined";
}

module.exports = Isset;