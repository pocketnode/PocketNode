const EncapsulatedPacket = raknet("protocol/EncapsulatedPacket");

class CachedEncapsulatedPacket extends EncapsulatedPacket {
    constructor(){
        super();
        this.internalData = null;
    }

    toBinary(){
        return this.internalData ? this.internalData : (this.internalData = super.toBinary());
    }
}

module.exports = CachedEncapsulatedPacket;