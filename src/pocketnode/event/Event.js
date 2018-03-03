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
class Event {

    constructor(){
        this.eventName = null;
        this.isCancelled = false;
    }

    /**
	 * @return string
	 */
	getEventName(){
		return this.eventName ? null : this.constructor.name;
	}

	/**
	 * @return bool
	 *
	 * @throws Error
	 */
	isCancelled(){
		//if(!(this instanceof Cancellable)){
		//	throw new Error("Event is not Cancellable");
		//}
		return this.isCancelled === true;
	}

	/**
	 * @param bool value
	 *
	 * @throws Error
	 */
	setCancelled(value = true){
		//if(!(this instanceof Cancellable)){
		//	throw new Error("Event is not Cancellable");
		//}
		this.isCancelled = value;
	}

}
module.exports = Event;
