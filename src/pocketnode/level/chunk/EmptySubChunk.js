const SubChunkInterface = pocketnode("level/chunk/SubChunkInterface");

class EmptySubChunk extends SubChunkInterface {
    constructor(){
        super();
    }

    isEmpty(){
        return true;
    }

    getBlockId(){
        return 0;
    }

    setBlockId(){
        return false;
    }

    getBlockData(){
        return 0;
    }

    setBlockData(){
        return false;
    }

    getBlockLight(){
        return 0;
    }

    setBlockLight(){
        return false;
    }

    getBlockSkyLight(){
        return 0;
    }

    setBlockSkyLight(){
        return false;
    }

    getHighestBlockId(){
        return 0;
    }

    getHighestBlockData(){
        return 0;
    }

    getHighestBlock(){
        return 0;
    }

    toBinary(){
        return Buffer.alloc(6145).fill(0x00);
    }
}

module.exports = EmptySubChunk;