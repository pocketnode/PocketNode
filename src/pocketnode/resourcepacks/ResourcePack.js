const ClassHasMethod = pocketnode("utils/methods/ClassHasMethod");

class ResourcePack {
    constructor(){
        let methods = [
            "getPackName",
            "getPackId",
            "getPackSize",
            "getPackVersion",
            "getSha256",
            "getPackChunk"
        ];

        let missingMethods;
        if((missingMethods = ClassHasMethod(this.constructor, methods)) !== true){
            throw new Error(this.constructor.name + " is missing the following method(s): " + missingMethods.join(", "));
        }
    }
}

module.exports = ResourcePack;