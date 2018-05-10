const Generator = pocketnode("level/generator/Generator");
const Chunk = pocketnode("level/chunk/Chunk");

class FlatGenerator extends Generator {
    constructor(){
        super();
        this._chunk = null;
    }

    generateChunk(chunkX, chunkZ){
        if(this._chunk === null){
            let chunk = new Chunk(chunkX, chunkZ);

            for (let x = 0; x < 16; x++) {
                for (let z = 0; z < 16; z++) {
                    let y = 0;
                    chunk.setBlockId(x, y++, z, 7);
                    chunk.setBlockId(x, y++, z, 3);
                    chunk.setBlockId(x, y++, z, 3);
                    chunk.setBlockId(x, y, z, 2);

                    /*for (let i = y - 1; i >= 0; i--) {
                        chunk.setBlockSkyLight(x, y, z, 0);
                    }*/
                }
            }

            chunk.recalculateHeightMap();

            this._chunk = chunk;

            return chunk;
        }

        let chunk = Object.assign(new Chunk(chunkX, chunkZ), this._chunk);
        chunk.setX(chunkX);
        chunk.setZ(chunkZ);
        return chunk;
    }
}

module.exports = FlatGenerator;