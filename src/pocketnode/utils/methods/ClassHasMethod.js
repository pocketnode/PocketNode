/**
 * ClassHasMethod checks if provided class contains method(s)
 * @param c Class
 * @param m String|Array
 * @returns Boolean|Array
 */
function ClassHasMethod(c, m){
    if(typeof c === "function"){
        if(typeof m === "string"){
            return typeof c.prototype[m] !== "undefined";
        }else if(m instanceof Array){
            let missingMethods = [];
            m.forEach(method => {
                if(typeof c.prototype[method] === "undefined") missingMethods.push(method);
            });
            if(missingMethods.length > 0) return missingMethods;
            return true;
        }else{
            throw new Error("Invalid method parameter! Expecting string or array got: "+(typeof m));
        }
    }else{
        throw new Error("Invalid class parameter! Expecting function got: "+(typeof c));
    }
}

module.exports = ClassHasMethod;