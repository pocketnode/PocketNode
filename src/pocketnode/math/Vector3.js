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

/**
 * A Vector3 is a Vector for use in 3D environments. It contains an X, Y, and Z component.
 * @class
 */
class Vector3
{

    static get SIDE_DOWN(){return 0}
    static get SIDE_UP(){return 1}
    static get SIDE_NORTH(){return 2}
    static get SIDE_SOUTH(){return 3}
    static get SIDE_WEST(){return 4}
    static get SIDE_EAST(){return 5}

    /**
     * Represents a 3D Vector.
     * @constructor
	 * @param {Number}   x The X component of the Vector
	 * @param {Number}   y The Y component of the Vector
	 * @param {Number}   z The Z component of the Vector
     *
	 */
    constructor(x = 0, y = 0, z = 0){
        this.x = x;
        this.y = y;
        this.z = z;
    }

    getX(){
        return this.x;
    }

    getY(){
        return this.y;
    }

    getZ(){
        return this.z;
    }

    getFloorX(){
        return Math.floor(this.x);
    }

    getFloorY(){
        return Math.floor(this.y);
    }

    getFloorZ(){
        return Math.floor(this.z);
    }

    getRight(){
        return this.getX();
    }

    getUp(){
        return this.getY();
    }

    getForward(){
        return this.getZ();
    }

    getSouth(){
        return this.getX();
    }

    getWest(){
        return this.getZ();
    }

    /**
    * @param {Vector3 | number} x
    * @param {Number}           y
    * @param {Number}           z
    *
    * @return {Vector3}
    */
    add(x, y = 0, z = 0){
        if(x instanceof Vector3){
            return new Vector3(this.x + x.x, this.y + x.y, this.z + x.z);
        }else{
            return new Vector3(this.x + x, this.y + y, this.z + z);
        }
    }

    /**
    * @param {Vector3 | Number} x
    * @param {Number}           y
    * @param {Number}           z
    *
    * @return {Vector3}
    */
    subtract(x = 0, y = 0, z = 0){
        if(x instanceof Vector3){
            return this.add(-x.x, -x.y, -x.z);
        }else{
            return this.add(-x, -y, -z);
        }
    }

    multiply(number){
        return new Vector3(this.x * number, this.y * number, this.z * number);
    }

    divide(number)
    {
        return new Vector3(this.x / number, this.y / number, this.z / number);
    }

    ceil(){
        return new Vector3(Math.ceil(this.x), Math.ceil(this.y), Math.ceil(this.z));
    }

    floor(){
        return new Vector3(Math.floor(this.x), Math.floor(this.y), Math.floor(this.z));
    }

    round(precision = 0, mode = "ROUND_HALF_UP"){
        return new Vector3(Math.round_php(this.x, precision, mode), Math.round_php(this.y, precision, mode), Math.round_php(this.z, precision, mode));
    }

    abs(){
        return new Vector3(Math.abs(this.x), Math.abs(this.y), Math.abs(this.z));
    }

    getSide(side, step = 1){
        switch(side){
            case Vector3.SIDE_DOWN:
                return new Vector3(this.x, this.y - step, this.z);
            case Vector3.SIDE_UP:
                return new Vector3(this.x, this.y + step, this.z);
            case Vector3.SIDE_NORTH:
                return new Vector3(this.x, this.y, this.z - step);
            case Vector3.SIDE_SOUTH:
                return new Vector3(this.x, this.y, this.z + step);
            case Vector3.SIDE_WEST:
                return new Vector3(this.x - step, this.y, this.z);
            case Vector3.SIDE_EAST:
                return new Vector3(this.x + step, this.y, this.z);
            default:
                return this;
        }
    }

    /**
    * Return a Vector3 instance
    *
    * @return {Vector3}
    */
    asVector3(){
        return new Vector3(this.x, this.y, this.z);
    }

    /**
    * Returns the Vector3 side number opposite the specified one
    *
    * @param {Number} side 0-5 one of the Vector3 SIDE_* constants
    * @return {Number}
    *
    * @throws \InvalidArgumentException if an invalid side is supplied
    */
    getOppositeSide(side){
        if(side >= 0 && side <= 5){
            return side ^ 0x01;
        }
    //throw new \InvalidArgumentException("Invalid side side given to getOppositeSide");
    }

    distance(pos){
        return Math.sqrt(this.distanceSquared(pos));
    }

    distanceSquared(pos){
        return ((this.x - pos.x) ** 2) + ((this.y - pos.y) ** 2) + ((this.z - pos.z) ** 2);
    }

    maxPlainDistance(x = 0, z = 0){
        if(x instanceof Vector3){
            return this.maxPlainDistance(x.x, x.z);
        //} else if(x instanceof Vector2) {
            //return this.maxPlainDistance(x.x, x.y);
        }else{
            return Math.max(Math.abs(this.x - x), Math.abs(this.z - z));
        }
    }

    length(){
        return Math.sqrt(this.lengthSquared());
    }

    lengthSquared(){
        return this.x * this.x + this.y * this.y + this.z * this.z;
    }

    /**
    * @return {Vector3}
    */
    normalize(){
        let len = this.lengthSquared();
        if(len > 0){
            return this.divide(Math.sqrt(len));
        }
        return new Vector3(0, 0, 0);
    }

    dot(v){
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }

    cross(v){
        return new Vector3(
            this.y * v.z - this.z * v.y,
            this.z * v.x - this.x * v.z,
            this.x * v.y - this.y * v.x
        );
    }

    equals(v){
        return this.x === v.x && this.y === v.y && this.z === v.z;
    }

    /**
    * Returns a new vector with x value equal to the second parameter, along the line between this vector and the
    * passed in vector, or null if not possible.
    *
    * @param {Vector3} v
    * @param {Number}  x
    *
    * @return {Vector3} | null
    */
    getIntermediateWithXValue(v, x){
        let xDiff = v.x - this.x;
        let yDiff = v.y - this.y;
        let zDiff = v.z - this.z;
        if((xDiff * xDiff) < 0.0000001){
            return null;
        }
        let f = (x - this.x) / xDiff;
        if(f < 0 || f > 1){
            return null;
        }else{
            return new Vector3(x, this.y + yDiff * f, this.z + zDiff * f);
        }
    }

    /**
    * Returns a new vector with y value equal to the second parameter, along the line between this vector and the
    * passed in vector, or null if not possible.
    *
    * @param {Vector3} v
    * @param {Number}  y
    *
    * @return {Vector3} | null
    */
    getIntermediateWithYValue(v, y){
        let xDiff = v.x - this.x;
        let yDiff = v.y - this.y;
        let zDiff = v.z - this.z;
        if((yDiff * yDiff) < 0.0000001){
            return null;
        }
        let f = (y - this.y) / yDiff;
        if(f < 0 || f > 1){
            return null;
        }else{
            return new Vector3(this.x + xDiff * f, y, this.z + zDiff * f);
        }
    }

    /**
    * Returns a new vector with z value equal to the second parameter, along the line between this vector and the
    * passed in vector, or null if not possible.
    *
    * @param {Vector3} v
    * @param {Number}  z
    *
    * @return {Vector3 | null}
    */
    getIntermediateWithZValue(v, z){
        let xDiff = v.x - this.x;
        let yDiff = v.y - this.y;
        let zDiff = v.z - this.z;
        if((zDiff * zDiff) < 0.0000001){
            return null;
        }
        let f = (z - this.z) / zDiff;
        if(f < 0 || f > 1){
            return null;
        }else{
            return new Vector3(this.x + xDiff * f, this.y + yDiff * f, z);
        }
    }

    /**
    * @param {Number} x
    * @param {Number} y
    * @param {Number} z
    *
    * @return {Vector3}
    */
    setComponents(x, y, z){
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    }

    toString(){
        return "Vector3(x=" + this.x + ",y=" + this.y + ",z=" + this.z + ")";
    }

}

module.exports = Vector3;
