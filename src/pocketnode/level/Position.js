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

/**
* A Position is a Vector3 with an added Level component
* @class
*/
class Position extends Vector3
{

    initVars()
    {
        this.level = null;
    }

    /**
     * Represents a Vector3 with an added Level reference.
     * @constructor
	 * @param {int}   x
	 * @param {int}   y
	 * @param {int}   z
	 * @param {Level} level
     *
	 */
    constructor(x = 0, y = 0, z = 0, level = null)
    {
        this.x = x;
        this.y = y;
        this.z = z;
        this.level = level;
    }

    fromObject(pos, level = null)
    {
		return new Position(pos.x, pos.y, pos.z, level);
	}
	/**
	 * Return a Position instance
	 *
	 * @return {Position}
	 */
	asPosition()
    {
		return new Position(this.x, this.y, this.z, this.level);
	}

    /**
	 * Returns the target Level, or null if the target is not valid.
	 * If a reference exists to a Level which is closed, the reference will be destroyed and null will be returned.
	 *
	 * @return {Level | null}
	 */
	getLevel()
    {
		if(this.level !== null && this.level.isClosed()){
			//MainLogger.getLogger().debug("Position was holding a reference to an unloaded Level");
			this.level = null;
		}
		return this.level;
	}

    /**
	 * Sets the target Level of the position.
	 *
	 * @param {Level | null} level
	 *
	 * @return {this}
	 *
	 * @throws \InvalidArgumentException if the specified Level has been closed
	 */
	setLevel(level = null)
    {
		if(level !== null && level.isClosed()){
			//throw new \InvalidArgumentException("Specified level has been unloaded and cannot be used");
		}
		this.level = level;
		return this;
	}

    /**
	 * Checks if this object has a valid reference to a loaded Level
	 *
	 * @return {bool}
	 */
	isValid()
    {
		return this.getLevel() instanceof Level;
	}

    /**
	 * Returns a side Vector
	 *
	 * @param {int} side
	 * @param {int} step
	 *
	 * @return {Position}
	 *
	 * @throws {LevelException}
	 */
	getSide(side, step = 1)
    {
		assert(this.isValid());
		return this.fromObject(parent.getSide(side, step), this.level);
	}
	__toString()
    {
		return "Position(level=" + (this.isValid() ? this.getLevel().getName() : "null") + ",x=" + this.x + ",y=" + this.y + ",z=" + this.z + ")";
	}
	/**
	 * @param x
	 * @param y
	 * @param z
	 *
	 * @return {Position}
	 */
	setComponents(x, y, z)
    {
		this.x = x;
		this.y = y;
		this.z = z;
		return this;
	}
	equals(v)
    {
		if(v instanceof Position){
			return parent.equals(v) && v.getLevel() === this.getLevel();
		}
		return parent.equals(v);
	}

}
