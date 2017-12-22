/**
 * CheckTypes
 * Example: CheckTypes([String, "myString"]); // true
 *          CheckTypes([String, 12]); // throws TypeError
 *
 * @throws {TypeError}
 * @returns {boolean}
 */
function CheckTypes(){
    if(arguments.length === 0) throw new TypeError("Expecting at least 1 Array. Example: [Object, myObjectVar]");
    for(let i in arguments){
        let arg = arguments[i];
        if(!(arg instanceof Array)) throw new TypeError("Expecting Array, got "+(arg.name ? arg.name : arg.constructor.name));
        if(!(arg[1] instanceof arg[0]) && ((arg[1].constructor.name === arg[0].name) ? arg[1].constructor !== arg[0] : false)) throw new TypeError("Expecting "+(arg[0].name ? arg[0].name : arg[0].constructor.name)+", got "+(arg[1].name ? arg[1].name : arg[1].constructor.name));
    }
    return true;
}

module.exports = CheckTypes;