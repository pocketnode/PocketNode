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

const Vector3 = pocketnode("math/Vector3");

class Position extends Vector3 {

    /**
     * Represents a Vector3 with an added Level reference.
	 * @param {Number}   x
	 * @param {Number}   y
	 * @param {Number}   z
	 * @param {Level|null}    level
     *
	 */
    constructor(x = 0, y = 0, z = 0, level = null){
        super(x, y, z);
        this.level = level;
    }

    static fromObject(pos, level = null){
        return new Position(pos.x, pos.y, pos.z, level);
    }

    /**
    * Return a Position instance
    *
    * @return {Position}
    */
    asPosition(){
        return new Position(this.x, this.y, this.z, this.level);
    }

    /**
     * @return {Level|null}
     */
    getLevel(){
        if(this.level !== null && this.level.isClosed()){
            MainLogger.getLogger().debug("Position was holding a reference to an unloaded Level");
            this.level = null;
        }

        return this.level;
    }

    /**
     * Sets the target Level of the position.
     * @param level {Level|null}
     * @return {Position}
     */
    setLevel(level = null){
        if(level !== null && level.isClosed()){
            throw new Error("Specified level has been unloaded and cannot be used");
        }
        this.level = level;
        return this;
    }

    /**
    * Checks if this object has a valid reference to a loaded Level
    *
    * @return {Boolean}
    */
    isValid(){
        return this.getLevel() instanceof Level;
    }

    /**
    * Returns a side Vector
    *
    * @param {Number} side
    * @param {Number} step
    *
    * @return {Position}
    *
    * @throws {LevelException}
    */
    getSide(side, step = 1){
        assert(this.isValid());

        return Position.fromObject(super.getSide(side, step), this.level);
    }

    toString(){
        return "Position(level=" + (this.isValid() ? this.getLevel().getName() : "null") + ",x=" + this.x + ",y=" + this.y + ",z=" + this.z + ")";
    }

    /**
    * @param x
    * @param y
    * @param z
    *
    * @return {Position}
    */
    setComponents(x, y, z){
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    }

    equals(v){
        if(v instanceof Position){
            return super.equals(v) && v.getLevel() === this.getLevel();
        }
        return super.equals(v);
    }

}

module.exports = Position;
