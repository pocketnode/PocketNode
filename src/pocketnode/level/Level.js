 class Level {
     /**
      * @param x {Number}
      * @param z {Number}
      * @return {Number}
      */
    static chunkHash(x, z){
        return ((x & 0xFFFFFFFF) << 32) | (z & 0xFFFFFFFF);
    }

    initVars(){
        this._server = null;
        this._name = "";
        this._id = -1;
        /** @type {Map<Number, Dimension>} */
        this._dimensions = new Map();
        this._defaultDimension = null;

        /** @type {Map<String, GameRule>} */
        this._gameRules = new Map();

        /** @type {Map<Number, Chunk>} */
        this._chunks = new Map();
    }

    constructor(server, name, id, chunks){
        this.initVars();


    }

    getChunk(x, z, create = false){
        let index;
        if(this._chunks.has(index = Level.chunkHash(x, z))){
            return this._chunks.get(index);
        }else if(this.loadChunk(x, z, create)){
            return this._chunks.get(index);
        }

        return null;
    }

     /**
      * @param x {Number}
      * @param z {Number}
      * @param create {Boolean}
      * @return {Boolean}
      */
    loadChunk(x, z, create = true){
        let chunkHash;
        if(this._chunks.has(chunkHash = Level.chunkHash(x, z))){
            return true;
        }

        this._chunks.set(chunkHash, this.getGenerator().generateChunk(x, z));

        return true;
    }

     /**
      * @return {Generator}
      */
    getGenerator(){
        return this._generator;
    }
}

module.exports = Level;