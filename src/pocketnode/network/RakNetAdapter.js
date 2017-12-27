const RakNetServer = (process.argv.length === 3 && process.argv[2] === "LOCAL" ? require("../../../../RakNet") : require("raknet"));
const Logger = pocketnode("logger/Logger");

const MinecraftPacketBatch = pocketnode("network/minecraft/MinecraftPacketBatch");
const PacketPool = pocketnode("network/minecraft/protocol/PacketPool");

const Player = pocketnode("player/Player");
const PlayerList = pocketnode("player/PlayerList");

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
                let batch = new MinecraftPacketBatch(packet.getStream(), this.logger);
                batch.decode(this.packetPool);

                batch.packets.forEach(packet => {
                    packet.decode();
                    this.logger.debug("Got "+packet.getName());

                    if(!player.getSessionAdapter().handleDataPacket(packet)){
                        this.server.getLogger().debug("Got unhandled protocol: "+packet.getName());
                    }
                });
            });
        });
    }

    close(){
        this.raknet.shutdown();
    }
}

module.exports = RakNetAdapter;