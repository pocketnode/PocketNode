class Listener {
    constructor(){
        this._listeners = {};
    }

    on(event, callback, options = {}){
        CheckTypes([String, event], [Function, callback], [Object, options]);

        if(this._listeners[event]) throw new Error("Only one listener can be set for one event.");
        this._listeners[event] = {callback, options};
    }

    getListeners(){
        return this._listeners;
    }

    getListenerFor(event){
        if(!this._listeners[event]) return null;

        return this._listeners[event].callback;
    }

    getOptionsFor(event){
        if(!this._listeners[event]) return null;
        
        return this._listeners[event].options;
    }
}

module.exports = Listener;