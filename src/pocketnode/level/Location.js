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

const Position = pocketnode("level/Position");

/**
* A Location is a Position with added Yaw and Pitch references. Yaw and Pitch are used for rotation.
* @class
*/
class Location extends Position {
    /**
     * Represents a Position with added Yaw and Pitch references
     * @constructor
	 * @param {Number}   x
	 * @param {Number}   y
	 * @param {Number}   z
	 * @param {Number}   yaw
	 * @param {Number}   pitch
	 * @param {Level}    level
	 */
	constructor(x = 0, y = 0, z = 0, yaw = 0.0, pitch = 0.0, level = null){
        super(x, y, z, level);
		this.yaw = yaw;
		this.pitch = pitch;
	}

    /**
    * @param {Vector3}      pos
    * @param {Level | null} level
    * @param {Number}       yaw
    * @param {Number}       pitch
    *
    * @return {Location}
    */
    fromObject(pos, level = null, yaw = 0.0, pitch = 0.0)
    {
        return new Location(pos.x, pos.y, pos.z, yaw, pitch, (level === null ? (pos instanceof Position ? pos.level : null) : level));
    }

    /**
    * Return a Location instance
    *
    * @return {Location}
    */
    asLocation()
    {
        return new Location(this.x, this.y, this.z, this.yaw, this.pitch, this.level);
    }

    getYaw()
    {
        return this.yaw;
    }

    getPitch()
    {
        return this.pitch;
    }

    __toString()
    {
        return "Location (level=" + (this.isValid() ? this.getLevel().getName() : "null") + ", x=" + this.x + ", y=" + this.y + ", z=" + this.z + ", yaw=" + this.yaw + ", pitch=" + this.pitch + ")";
    }
    
    equals(v)
    {
        if(v instanceof Location){
            return super.equals(v) && v.yaw == this.yaw && v.pitch == this.pitch;
        }
        return super.equals(v);
    }

}
