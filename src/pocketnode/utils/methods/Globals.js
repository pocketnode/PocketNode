const Path = require("path");

/**
 * Require files from PocketNode
 * @param path {string}
 * @returns {*}
 */
global.pocketnode = function(path){
    return require(Path.normalize(__dirname + "/../../" + path));
};

/**
 * PHP-like rounding added onto the Math object
 * @param value     {number}
 * @param precision {number}
 * @param mode      {string}
 * @returns {Number}
 */
global.Math.round_php = function(value, precision = 0, mode = "ROUND_HALF_UP"){
    let m, f, isHalf, sgn;
    m = Math.pow(10, precision);
    value *= m;
    // sign of the number
    sgn = (value > 0) | -(value < 0);
    isHalf = value % 1 === 0.5 * sgn;
    f = Math.floor(value);
    if(isHalf){
        switch (mode) {
            case "ROUND_HALF_DOWN":
                // rounds .5 toward zero
                value = f + (sgn < 0);
                break;
            case "ROUND_HALF_EVEN":
                // rounds .5 towards the next even integer
                value = f + (f % 2 * sgn);
                break;
            case "ROUND_HALF_ODD":
                // rounds .5 towards the next odd integer
                value = f + !(f % 2);
                break;
            default:
                // rounds .5 away from zero
                value = f + (sgn > 0);
        }
    }
    return ((isHalf ? value : Math.round(value)) / m);
};

/**
 * CheckTypes
 * Example: CheckTypes([String, "myString"]); // true
 *          CheckTypes([String, 12]); // throws TypeError
 *
 * @throws {TypeError}
 * @returns {boolean}
 */
global.CheckTypes = function(...args){
    if(args.length === 0) throw new TypeError("Expecting at least 1 Array. Example: [Object, myObjectVar]");

    args.forEach(arg => {
        if(!(arg instanceof Array)){
            throw new TypeError("Expecting Array, got "+(arg.constructor.name ? arg.constructor.name : arg.name));
        }

        if(typeof arg[0] === "undefined" || typeof arg[1] === "undefined"){
            throw new TypeError("Expecting Array with two items. Example: [Object, myObjectVar]");
        }

        let type = arg[0];
        let item = arg[1];

        if(
            !(item instanceof type) &&
            (item.constructor.name !== type.name && item.constructor !== type)
        ){
            throw new TypeError("Expecting "+type.name+", got "+item.constructor.name);
        }
    });
    return true;
};

String.prototype.ltrim = function(char){
    let str = this.valueOf();
    while(true){
        if(str[0] === char) str = str.substr(1);
        else break;
    }
    return str;
};

String.prototype.rtrim = function(char){
    let str = this.valueOf().split("").reverse().join("");
    while(true){
        if(str[0] === char) str = str.substr(1);
        else break;
    }
    return str.split("").reverse().join("");
};

/**
 * @author Jonas Raoni Soares Silva
 * @link http://jsfromhell.com/string/wordwrap
 */
String.prototype.wordwrap = function(m, b, c){
    let i, j, l, s, r;
    if(m < 1)
        return this;
    for(i = -1, l = (r = this.split("\n")).length; ++i < l; r[i] += s)
        for(s = r[i], r[i] = ""; s.length > m; r[i] += s.slice(0, j) + ((s = s.slice(j)).length ? b : ""))
            j = c == 2 || (j = s.slice(0, m + 1).match(/\S*(\s)?$/))[1] ? m : j.input.length - j[0].length
                || c == 1 && m || j.input.length + (j = s.slice(m).match(/^\S*/)).input.length;
    return r.join("\n");
};