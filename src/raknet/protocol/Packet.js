const RakNet = require("../RakNet.js");

class Packet {
    static getId(){
        return -1;
    }
    constructor(){
        this.raknet = RakNet;
        this.id = this.constructor.getId();
        this.bb;
    }
    decode(){}
    encode(){}
}

module.exports = Packet;