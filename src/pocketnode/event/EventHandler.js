/*
 *   _____           _        _   _   _           _
 *  |  __ \         | |      | | | \ | |         | |
 *  | |__) |__   ___| | _____| |_|  \| | ___   __| | ___
 *  |  ___/ _ \ / __| |/ / _ \ __| . ` |/ _ \ / _` |/ _ \
 *  | |  | (_) | (__|   <  __/ |_| |\  | (_) | (_| |  __/
 *  |_|   \___/ \___|_|\_\___|\__|_| \_|\___/ \__,_|\___|
 *
 *  @author PocketNode Team
 *  @link https://pocketnode.me
*/
const EventEmitter = require('events').EventEmitter;
const Event = pocketnode("event/Event");

class EventHandler extends EventEmitter {

    constructor(server){
        super();
        this.server = server;
        this.emitter = new EventEmitter();
    }

    callEvent(ev){
        if(typeof ev !== "string" && typeof ev !== "number" && typeof ev !== "boolean" && typeof ev.isEvent !== null){
            this.emitter.emit(ev.getEventName(), ev);
        } else {
            this.server.getLogger().error("Calling event '" + ev.toString() + "' with non Event object");
        }
    }

    getEmitter(){
        return this.emitter;
    }

}

module.exports = EventHandler;
