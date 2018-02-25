const ClassHasMethod = pocketnode("utils/methods/ClassHasMethod");

class SubChunkInterface {
    constructor(){
        let methods = [
            "isEmpty",
            "getBlockId",
            "setBlockId",
            "getBlockData",
            "setBlockData",
            "getBlockLight",
            "setBlockLight",
            "getBlockSkyLight",
            "setBlockSkyLight",
            "getHighestBlockId",
            "getHighestBlockData",
            "getHighestBlock",
            "toBinary"
        ];

        let missingMethods;
        if((missingMethods = ClassHasMethod(this.constructor, methods)) !== true){
            throw new Error(this.constructor.name + " is missing the following method(s): " + missingMethods.join(", "));
        }
    }
}

module.exports = SubChunkInterface;