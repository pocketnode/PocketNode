class Skin {
    initVars(){
        this._skinId = "";
        this._skinData = "";
        this._capeData = "";
        this._geometryName = "";
        this._geometryData = "";
    }

    constructor(skinId, skinData, capeData = "", geometryName = "", geometryData = ""){
        this.initVars();
        this._skinId = skinId;
        this._skinData = skinData;
        this._capeData = capeData;
        this._geometryName = geometryName;
        this._geometryData = geometryData;
    }

    isValid(){
        let size = this._skinData.length;
        return (
            this._skinId !== "" &&
            (size === 16384 || size === 8192) &&
            (this._capeData === "" || this._capeData.length === 8192)
        );
    }

    getSkinId(){
        return this._skinId;
    }

    getSkinData(){
        return this._skinData;
    }

    getCapeData(){
        return this._capeData;
    }

    getGeometryName(){
        return this._geometryName;
    }

    getGeometryData(){
        return this._geometryData;
    }
}

module.exports = Skin;