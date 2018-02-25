class Level {
    initVars(){
        this._server = null;
        this._name = "";
        this._id = -1;
        /** @type {Map<Number, Dimension>} */
        this._dimensions = new Map();
        this._defaultDimension = null;

        /** @type {Map<String, GameRule>} */
        this._gameRules = new Map();
    }

    constructor(server, name, id, chunks){
        this.initVars();


    }
}

module.exports = Level;