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
            throw new Error(
                Server.translate.getString("pocketnode.resourcePack.missingMethod",
                    [this.constructor.name, missingMethods.join(", ")]));
        }
    }
}

module.exports = ResourcePack;