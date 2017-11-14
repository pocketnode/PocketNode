const UDPServerSocket = require("./UDPServerSocket.js");

class RakNetServer {
    constructor(Server){
        new UDPServerSocket(Server, Server.getPort(), Server.getLogger());
    }
}

module.exports = RakNetServer;