const Chunk = pocketnode("level/chunk/Chunk");

class Generator {
    /**
     * Generator Name
     * @return {string}
     */
    getName(){
        return "unknown";
    }

    /**
     * Generator Options
     * @constructor
     * @param options
     */
    constructor(options = {}){
        this._options = options;
    }

    /**
     * Generate Chunk
     * @param chunkX {Number}
     * @param chunkZ {Number}
     * @param level {Level}
     *
     * @return {Boolean|Chunk}
     */
    generateChunk(chunkX, chunkZ, level = null){}
}

module.exports = Generator;