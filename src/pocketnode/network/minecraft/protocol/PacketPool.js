const LoginPacket = pocketnode("network/minecraft/protocol/LoginPacket");
const PlayStatusPacket = pocketnode("network/minecraft/protocol/PlayStatusPacket");
const DisconnectPacket = pocketnode("network/minecraft/protocol/DisconnectPacket");
const ResourcePacksInfoPacket = pocketnode("network/minecraft/protocol/ResourcePacksInfoPacket");

class PacketPool {
    constructor(){
        this.packetPool = new Map();
        this.registerPackets();
    }

    registerPacket(id, packet){
        this.packetPool.set(id, packet);
    }

    getPacket(id){
        return this.packetPool.has(id) ? new (this.packetPool.get(id))() : null;
    }

    isRegistered(id){
        return this.packetPool.has(id);
    }

    registerPackets(){
        this.registerPacket(LoginPacket.getId(), LoginPacket);
        this.registerPacket(PlayStatusPacket.getId(), PlayStatusPacket);
        //serverclienthandshake
        //viseversa
        this.registerPacket(DisconnectPacket.getId(), DisconnectPacket);
        this.registerPacket(ResourcePacksInfoPacket.getId(), ResourcePacksInfoPacket);
    }
}

module.exports = PacketPool;