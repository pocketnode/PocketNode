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
const PlayerEvent = pocketnode("event/player/PlayerEvent");

class PlayerQuitEvent extends PlayerEvent{


    /**
	 * @param Player                      player
	 * @param TranslationContainer|string quitMessage
	 * @param string                      quitReason
	 */
    constructor(player, quitMessage, quitReason){
        super();
        this.player = player;
        this.quitMessage = quitMessage;
        this.quitReason = quitReason;
    }

    /**
	 * @param TranslationContainer|string quitMessage
	 */
	setQuitMessage(quitMessage){
		this.quitMessage = quitMessage;
	}

    /**
	 * @return TranslationContainer|string
	 */
     getQuitMessage(){
		return this.quitMessage;
	}

	/**
	 * @return string
	 */
    getQuitReason(){
		return this.quitReason;
	}

}
module.exports = PlayerQuitEvent;
