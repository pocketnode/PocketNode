const LoginPacket = pocketnode("network/minecraft/protocol/LoginPacket");

class PacketPool {
    constructor(){
        this.packetPool = new Map();
        this.registerPackets();
    }

    registerPacket(id, packet){
        this.packetPool.set(id, packet);
    }

    getPacket(id){
        return this.packetPool.has(id) ? this.packetPool.get(id) : null;
    }

    isRegistered(id){
        return this.packetPool.has(id);
    }

    registerPackets(){
        this.registerPacket(LoginPacket.getId(), LoginPacket);
    }
}

module.exports = PacketPool;