class Event {
    static getName(){
        return this.name.toLowerCase().substr(-5) === "event" ? this.name.slice(0, -5) : this.name;
    }

    getName(){
        return this.constructor.getName();
    }

    isCancellable(){
        return false;
    }
    
    constructor(){
        this._isCancelled = false;
    }

    isCancelled(){
        if(!this.isCancellable()){
            throw new Error("Event is not cancellable");
        }

        return this._isCancelled === true;
    }

    setCancelled(v = true){
        CheckTypes([Boolean, v]);

        if(!this.isCancellable()){
            throw new Error("Event is not cancellable");
        }

        this._isCancelled = v;
    }
}

module.exports = Event;