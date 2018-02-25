class GameRule {
    static get COMMAND_BLOCK_OUTPUT(){return "commandblockoutput"}
    static get DO_DAYLIGHT_CYCLE(){return "dodaylightcycle"}
    static get DO_ENTITY_DROPS(){return "doentitydrops"}
    static get DO_FIRE_TICK(){return "dofiretick"}
    static get DO_MOB_LOOT(){return "domobloot"}
    static get DO_MOB_SPAWNING(){return "domobspawning"}
    static get DO_TILE_DROPS(){return "dotiledrops"}
    static get DO_WEATHER_CYCLE(){return "doweathercycle"}
    static get DROWNING_DAMAGE(){return "drowningdamage"}
    static get FALL_DAMAGE(){return "falldamage"}
    static get FIRE_DAMAGE(){return "firedamage"}
    static get KEEP_INVENTORY(){return "keepinventory"}
    static get MOB_GRIEFING(){return "mobgriefing"}
    static get NATURAL_REGENERATION(){return "naturalregeneration"}
    static get PVP(){return "pvp"}
    static get SEND_COMMAND_FEEDBACK(){return "sedcommandfeedback"}
    static get SHOW_COORDINATES(){return "showcoordinates"}
    static get RANDOM_TICK_SPEED(){return "randomtickspeed"}
    static get TNT_EXPLODES(){return "tntexplodes"}

    constructor(name, value){
        this.name = name;
        this.value = value;
    }

    getName(){
        return this.name;
    }

    getValue(){
        return this.value;
    }

    setValue(value){
        if(typeof value !== typeof this.value){
            return false;
        }
        this.value = value;
        return true;
    }
}

module.exports = GameRule;