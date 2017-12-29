const RakNetServer = (process.argv.length === 3 && process.argv[2] === "LOCAL" ? require("../../../../RakNet") : require("raknet"));
const Logger = pocketnode("logger/Logger");

const PacketPool = pocketnode("network/minecraft/protocol/PacketPool");
const BatchPacket = pocketnode("network/minecraft/protocol/BatchPacket");
const CachedEncapsulatedPacket = pocketnode("network/minecraft/protocol/CachedEncapsulatedPacket");

const Player = pocketnode("player/Player");
const PlayerList = pocketnode("player/PlayerList");

const RakNet = raknet("RakNet");
const PacketReliability = raknet("protocol/PacketReliability");
const EncapsulatedPacket = raknet("protocol/EncapsulatedPacket");

class RakNetAdapter {
    constructor(server){
        this.server = server;
        this.raknet = new RakNetServer(server.getPort(), new Logger("RakNet").setDebugging(server.properties.get("is_debugging", false)));
        this.raknet.getServerName()
            .setServerId(server.getServerId())
            .setMotd(server.getMotd())
            .setName(server.getName())
            .setProtocol(server.getProtocol())
            .setVersion(server.getVersion())
            .setOnlinePlayers(server.getOnlinePlayerCount())
            .setMaxPlayers(server.getMaxPlayers())
            .setGamemode("Creative");
        this.packetPool = new PacketPool();
        this.logger = server.getLogger();
        this.players = new PlayerList();
    }

    setName(name){
        this.raknet.getServerName().setMotd(name);
    }

    sendPacket(player, packet, needACK, immediate){
        if(this.players.hasPlayer(player)){
            let identifier = this.players.getPlayerIdentifier(player);
            if(!packet.isEncoded){
                packet.encode();
                console.log(packet.stream.buffer);
            }

            if(packet instanceof BatchPacket){
                //ack shit todo
                let pk;
                if(needACK){
                }else{
                    if(typeof packet.__encapsulatedPacket === "undefined"){
                        packet.__encapsulatedPacket = new CachedEncapsulatedPacket();
                        //packet.__encapsulatedPacket.identifierACK = null;
                        packet.__encapsulatedPacket.stream = packet.stream;
                        packet.__encapsulatedPacket.reliability = PacketReliability.RELIABLE_ORDERED;
                        packet.__encapsulatedPacket.orderChannel = 0;
                    }
                    pk = packet.__encapsulatedPacket;
                }

                this.sendEncapsulated(identifier, pk, (needACK === true ? RakNet.FLAG_NEED_ACK : 0) | (immediate === true ? RakNet.PRIORITY_IMMEDIATE : RakNet.PRIORITY_NORMAL));
                return null;
            }else{
                this.server.batchPackets([player], [packet], true, immediate);
            }
        }
    }

    sendEncapsulated(identifier, pk, flags){
        this.raknet.getSessionManager().getSessionByIdentifier(identifier).addEncapsulatedToQueue(pk, flags);
    }

    tick(){
        this.raknet.getSessionManager().readOutgoingMessages().forEach(message => {
            switch(message.purpose){
                case "openSession":
                    let player = new Player(this.server, message.data.clientId, message.data.ip, message.data.port);
                    this.players.addPlayer(message.data.identifier, player);
                    this.server.getPlayerList().addPlayer(message.data.identifier, player);
                    break;
            }
        });

        this.raknet.getSessionManager().getSessions().forEach(session => {
            let player = this.players.getPlayer(session.toString());

            session.packetBatches.getAllAndClear().forEach(packet => {
                let batch = new BatchPacket();
                batch.stream = packet.getStream();

                player.getSessionAdapter().handleDataPacket(batch);
            });
        });
    }

    close(player, reason = "unknown reason"){
        if(this.players.hasPlayer(player._ip + ":" + player._port)){
            this.raknet.getSessionManager().removeSession(this.raknet.getSessionManager().getSession(player._ip, player._port), reason);
            this.players.removePlayer(player._ip + ":" + player._port);
        }
    }

    shutdown(){
        this.raknet.shutdown();
    }
}

module.exports = RakNetAdapter;