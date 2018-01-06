class Chunk {
    static get MAX_SUBCHUNKS(){return 16}

    initVars(){
        this._x = 0;
        this._y = 0;

        this._hasChanged = false;

        this._isInit = false;

        this._lightPopulated = false;
        this._terrainGenerated = false;
        this._terrainPopulated = false;

        this._height = Chunk.MAX_SUBCHUNKS;

        this._emptySubChunk = null;

        this._tiles = [];
        this._tileList = [];

        this._entities = [];

        this._heightMap = [];

        this._biomeIds = "";

        this._extraData = [];

        this._NBTtiles = [];

        this._NBTentities = [];
    }

    constructor(chunkX, chunkY, subChunks = [], ){

    }
}

module.exports = Chunk;