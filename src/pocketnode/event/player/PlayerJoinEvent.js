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

class PlayerJoinEvent extends PlayerEvent {


    /**
	 * PlayerJoinEvent constructor.
	 *
	 * @param Player               player
	 * @param TextContainer|string joinMessage
	 */
    constructor(player, joinMessage){
        super();
        this.player = player;
        /** @var string|TextContainer */
        this.joinMessage = joinMessage;
    }

    /**
	 * @param string|TextContainer joinMessage
	 */
    setJoinMessage(joinMessage){
        this.joinMessage = joinMessage;
    }

    /**
	 * @return string|TextContainer
	 */
    getJoinMessage(){
        return this.joinMessage;
    }

}
module.exports = PlayerJoinEvent;
