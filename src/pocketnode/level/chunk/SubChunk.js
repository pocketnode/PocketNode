const SubChunkInterface = pocketnode("level/chunk/SubChunkInterface");

class SubChunk extends SubChunkInterface {
    initVars(){
        this._blockIds = [];
        this._blockData = [];
        this._blockLight = [];
        this._skyLight = [];
    }

    constructor(blockIds = [], blockData = [], blockLight = [], skyLight = []){
        super();

        if(blockIds.length === 0 || blockIds.length !== 4096){
            this._blockIds = new Array(4096).fill(0x00);
        }

        if(blockData.length === 0 || blockData.length !== 2048){
            this._blockData = new Array(2048).fill(0x00);
        }

        if(blockLight.length === 0 || blockLight.length !== 2048){
            this._blockLight = new Array(2048).fill(0x00);
        }

        if(skyLight.length === 0 || skyLight.length !== 2048){
            this._skyLight = new Array(2048).fill(0xff);
        }
    }

    isEmpty(checkLight = true){
        return (
            this._blockIds.filter(id => id === 0x00).length === 4096 &&
            (!checkLight || (
                this._blockLight.filter(id => id === 0x00).length === 2048 &&
                this._skyLight.filter(id => id === 0xff).length === 2048
            ))
        );
    }

    getBlockId(x, y, z){
        return this._blockIds[SubChunk.getIdIndex(x, y, z)];
    }

    setBlockId(x, y, z, id){
        this._blockIds[SubChunk.getIdIndex(x, y, z)] = id;
        return true;
    }

    getBlockData(x, y, z){
        let m = this._blockData[SubChunk.getDataIndex(x, y, z)];
        if((y & 1) === 0){
            return m & 0x0f;
        }else{
            return m >> 4;
        }
    }

    setBlockData(x, y, z, data){
        let i = SubChunk.getDataIndex(x, y, z);
        if((y & 1) === 0){
            this._blockData[i] = (this._blockData[i] & 0xf0) | (data & 0x0f);
        }else{
            this._blockData[i] = (((data & 0x0f) << 4) | this._blockData[i] & 0x0f);
        }
        return true;
    }

    getBlockLight(x, y, z){
        let byte = this._blockLight[SubChunk.getLightIndex(x, y, z)];
        if((y & 1) === 0){
            return byte & 0x0f;
        }else{
            return byte >> 4;
        }
    }

    setBlockLight(x, y, z, level){
        let i = SubChunk.getLightIndex(x, y, z);
        let byte = this._blockLight[i];
        if((y & 1) === 0){
            this._blockLight[i] = (byte & 0xf0) | (level & 0x0f);
        }else{
            this._blockLight[i] = ((level & 0x0f) << 4) | (byte & 0x0f);
        }
        return true;
    }

    getBlockSkyLight(x, y, z){
        let byte = this._skyLight[SubChunk.getLightIndex(x, y, z)];
        if((y & 1) === 0){
            return byte & 0x0f;
        }else{
            return byte >> 4;
        }
    }

    setBlockSkyLight(x, y, z, level){
        let i = SubChunk.getLightIndex(x, y, z);
        let byte = this._skyLight[i];
        if((y & 0x01) === 0){
            this._skyLight[i] = (byte & 0xf0) | (level & 0x0f);
        }else{
            this._skyLight[i] = ((level & 0x0f) << 4) | (byte & 0x0f);
        }
        return true;
    }

    getHighestBlockId(x, z){
        for(let y = 15; y >= 0; y--){
            let id = this.getBlockId(x, y, z);
            if(id !== 0){
                return id;
            }
        }
        return 0;
    }

    getHighestBlockData(x, z){
        return this.getBlockData(x, 15, z);
    }

    getHighestBlock(x, z){
        for(let y = 15; y >= 0; y--){
            if(this.getBlockId(x, y, z) !== 0){
                return y;
            }
        }

        return 0;
    }

    toBinary(){
        return Buffer.from([0x00, ...this._blockIds, ...this._blockData]);
    }

    static getIdIndex(x, y, z){
        return (x << 8) | (z << 4) | y;
    }

    static getDataIndex(x, y, z){
        return (x << 7) + (z << 3) + (y >> 1);
    }

    static getLightIndex(x, y, z){
        return SubChunk.getDataIndex(x, y, z);
    }
}

let subchunk = new SubChunk();

module.exports = SubChunk;