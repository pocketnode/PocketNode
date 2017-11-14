const ByteBuffer = require("bytebuffer");
const dgram = require("dgram");
const RakNet = require("./RakNet.js");

const ObjectInvert = require("../pocketnode/utils/ObjectInvert.js");

const UnconnectedPing = require("./protocol/UnconnectedPing.js");
const UnconnectedPong = require("./protocol/UnconnectedPong.js");
//const OpenConnectionReply1 = require("./protocol/OpenConnectionReply1");
//const OpenConnectionReply2 = require("./protocol/OpenConnectionReply2");
//const OpenConnectionRequest1 = require("./protocol/OpenConnectionRequest1");
//const OpenConnectionRequest2 = require("./protocol/OpenConnectionRequest2");

class UDPServerSocket {
    constructor(server, port, logger){
        this.server = dgram.createSocket("udp4");
        this.server.raknet = RakNet;
        this.server.raknet_names = ObjectInvert(RakNet);
        this.server.PocketNodeServer = server;
        this.server.logger = logger;
        this.setListeners();
        this.server.bind(port);
    }

    setListeners(){
        this.server.on("error", this.onerror);
        this.server.on("message", this.onmessage);
        this.server.on("listening", this.onlistening);
    }

    onlistening(){
        this.logger.info("Raknet Server Started!");
    }

    onerror(err){
        this.logger.error("UDPSocketServer Error: " + err);
        this.close();
    }

    onmessage(msg, rinfo) {
        var buf = new ByteBuffer().append(msg, "hex");
        var id = buf.buffer[0];
        if(id >= RakNet.UNCONNECTED_PING && id <= RakNet.ADVERTISE_SYSTEM){
            this.logger.debug("Got "+this.raknet_names[id]+" Packet. Buffer: "+buf);
            switch(id){
                case RakNet.UNCONNECTED_PING:
                    var request = new UnconnectedPing(buf);
                    request.decode();
                    var response = new UnconnectedPong(request.pingId, {
                        name: this.PocketNodeServer.getMotd(),
                        protocol: 130,
                        version: "1.2.3",
                        players: {
                            online: this.PocketNodeServer.getOnlinePlayers().length,
                            max: this.PocketNodeServer.getMaxPlayers()
                        },
                        serverId: this.PocketNodeServer.serverId
                    });
                    response.encode();
                    this.send(response.bb.buffer, 0, response.bb.buffer.length, rinfo.port, rinfo.address); //Send waiting data buffer
                    break;

                default:
                    this.logger.notice("Unknown RakNet packet. Id: "+id);
                    break;
            }
        }else if(id >= RakNet.DATA_PACKET_0 &&  id <= RakNet.DATA_PACKET_F){
            for(var i = 0; i < this.players.length; i++){
                if(this.players[i].ip == rinfo.address && this.players[i].port == rinfo.port){
                    var e = new EncapsulatedPacket(buf);
                    e.decode();
                    this.players[i].handlePackets(e);
                    return;
                }
            }
            console.log("Couldn't find a player.")
        }else if(id == RakNet.ACK || id == RakNet.NACK){
            console.log("Got the ACK");
        }else{
            console.log("Unknown packet: " + id);
        }
    }
}

module.exports = UDPServerSocket;