const BinaryStream = pocketnode("utils/BinaryStream");
const SubChunk = pocketnode("level/chunk/SubChunk");
const EmptySubChunk = pocketnode("level/chunk/EmptySubChunk");

class Chunk {
    initVars(){
        this._x = 0;
        this._z = 0;

        this._height = 256;

        /**
         * @type {Map<number, SubChunk>}
         * @private
         */
        this._subChunks = new Map();

        this._lightPopulated = false;
        this._terrainPopulated = false;

        /**
         * @type {Map<number, Tile>}
         * @private
         */
        this._tiles = new Map();
        /**
         * @type {Map<number, Entity>}
         * @private
         */
        this._entities = new Map();

        this._biomes = [];

        this._heightMap = [];
    }

    constructor(x, z, subChunks = new Map(), entities = new Map(), tiles = new Map(), biomes = [], heightMap = []){
        this.initVars();

        this._x = x;
        this._z = z;

        if(subChunks.size !== 0) {
            for (let [y, chunk] of subChunks) {
                if (y < 0 || y >= this._height) {
                    throw new Error("Invalid subchunk index " + y);
                }

                if (chunk.isEmpty()) {
                    this._subChunks.set(y, new EmptySubChunk());
                } else {
                    this._subChunks.set(y, chunk);
                }
            }
        }

        for(let i = 0; i < this._height; ++i){
            if(!this._subChunks.has(i)){
                this._subChunks.set(i, new EmptySubChunk());
            }
        }

        if(heightMap.length === 256){
            this._heightMap = heightMap;
        }else{
            if(heightMap.length !== 0){
                throw new Error("Wrong HeightMap value count, expected 256, got "+heightMap.length);
            }else{
                this._heightMap = new Array(256).fill(this._height * 16);
            }
        }

        if(biomes.length === 256){
            this._biomes = biomes;
        }else{
            if(biomes.length !== 0){
                throw new Error("Wrong Biomes value count, expected 256, got "+biomes.length);
            }else{
                this._biomes = new Array(256).fill(0);
            }
        }
    }

    getX(){
        return this._x;
    }

    setX(x){
        this._x = x;
    }

    getZ(){
        return this._z;
    }

    setZ(z){
        this._z = z;
    }

    getHeight(){
        return this._height;
    }

    setHeight(value = 256){
        this._height = value;
    }

    getBiome(x, z){
        return this._biomes.get(Chunk.getBiomeIndex(x, z));
    }

    setBiome(x, z, biome){
        this._biomes.set(Chunk.getBiomeIndex(x, z), biome);
    }

    addEntity(entity){
        if(!entity.isClosed()){
            this._entities.set(entity.getRuntimeId(), entity);
            return true;
        }

        return false;
    }

    removeEntity(entity){
        if(this._entities.has(entity.getRuntimeId())){
            this._entities.delete(entity.getRuntimeId());
            return true;
        }

        return false;
    }

    addTile(tile){
        if(!tile.isClosed()){
            this._tiles.set(tile.getId(), tile);
            return true;
        }

        return false;
    }

    removeTile(tile){
        if(this._tiles.has(tile.getId())){
            this._tiles.delete(tile.getId());
            return true;
        }

        return false;
    }

    getBlockId(x, y, z){
        return this.getSubChunk(y >> 4).getBlockId(x, y & 0x0f, z);
    }

    setBlockId(x, y, z, blockId){
        return this.getSubChunk(y >> 4, true).setBlockId(x, y & 0x0f, z, blockId);
    }

    getBlockData(x, y, z){
        return this.getSubChunk(y >> 4).getBlockData(x, y & 0x0f, z);
    }

    setBlockData(x, y, z, data){
        return this.getSubChunk(y >> 4).setBlockData(x, y & 0x0f, z, data);
    }

    getBlockLight(x, y, z){
        return this.getSubChunk(y >> 4).getBlockLight(x, y & 0x0f, z);
    }

    setBlockLight(x, y, z, level){
        return this.getSubChunk(y >> 4, true).setBlockLight(x, y & 0x0f, z, level);
    }

    getBlockSkyLight(x, y, z){
        return this.getSubChunk(y >> 4).getBlockSkyLight(x, y & 0x0f, z);
    }

    setBlockSkyLight(x, y, z, level){
        return this.getSubChunk(y >> 4, true).setBlockSkyLight(x, y & 0x0f, z, level);
    }

    getSubChunk(y, generateNew = false){
        if(y < 0 || y >= this._height){
            return new EmptySubChunk();
        }else if(generateNew && this._subChunks.has(y) instanceof EmptySubChunk){
            this._subChunks.set(y, new SubChunk());
        }

        if(this._subChunks.get(y) === null){
            throw new Error("something broke..");
        }

        return this._subChunks.get(y);
    }

    setSubChunk(y, subChunk = null, allowEmpty = false){
        if(y < 0 || y >= this._height){
            return false;
        }

        if(subChunk === null || (subChunk.isEmpty() && !allowEmpty)){
            this._subChunks.set(y, new EmptySubChunk());
        }else{
            this._subChunks.set(y, subChunk);
        }

        return true;
    }

    getSubChunks(){
        return this._subChunks;
    }

    getHeightMap(x, z){
        return this._heightMap[Chunk.getHeightMapIndex(x, z)];
    }

    setHeightMap(x, z, value){
        this._heightMap[Chunk.getHeightMapIndex(x, z)] = value;
    }

    recalculateHeightMap(){
        for(let z = 0; z < 16; ++z){
            for(let x = 0; x < 16; ++x){
                let id = this.getHighestBlockId(x, z);

                this.setHeightMap(x, z, this.getHighestBlock(x, z) + 1);
            }
        }
    }

    getHighestSubChunk(){
        let highest = new EmptySubChunk();
        for(let y = 16; y > 0; --y){
            if(this._subChunks.has(y)){
                continue;
            }
            if(this._subChunks.get(y).isEmpty()){
                continue;
            }
            highest = this._subChunks.get(y);
            break;
        }
        return highest;
    }

    getHighestBlockId(x, z){
        return this.getHighestSubChunk().getHighestBlockId(x, z);
    }

    getHighestBlockData(x, z){
        return this.getHighestSubChunk().getHighestBlockData(x, z);
    }

    getHighestBlock(x, z){
        return this.getHighestSubChunk().getHighestBlock(x, z);
    }

    getFilledSubChunks(){
        this.pruneEmptySubChunks();
        return this._subChunks.size;
    }

    pruneEmptySubChunks(){
        for(let [y, subChunk] of this._subChunks){
            if(y < 0 || y >= this._height){
                this._subChunks.delete(y);
            }else if(subChunk instanceof EmptySubChunk){
                continue;
            }else if(subChunk.isEmpty()){
                this._subChunks.set(y, new EmptySubChunk());
            }
        }
    }

    isLightPopulated(){
        return this._lightPopulated;
    }

    setLightPopulated(value = true){
        this._lightPopulated = value;
    }

    isPopulated(){
        return this._terrainPopulated;
    }

    setPopulated(value = true){
        this._terrainPopulated = value;
    }

    getEntities(){
        return this._entities;
    }

    getTiles(){
        return this._tiles;
    }

    toBinary(){
        let stream = new BinaryStream();

        let subChunkCount = this.getFilledSubChunks();

        stream.writeByte(subChunkCount);
        for(let i = 0; i < subChunkCount; i++){
            stream.append(this._subChunks.get(i).toBinary());
        }

        this._heightMap.forEach(v => stream.writeShort(v));

        this._biomes.forEach(v => stream.writeByte(v));
        stream.writeByte(0);

        stream.writeVarInt(0);

        return stream.getBuffer();
    }

    static getIndex(x, y, z){
        return (x << 12) | (z << 8) | y;
    }

    static getBiomeIndex(x, z){
        return (x << 4) | z;
    }

    static getHeightMapIndex(x, z){
        return (z << 4) | x;
    }
}

module.exports = Chunk;