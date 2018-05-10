class RegisteredListener {
    initVars(){
        this._listener = null;
        this._plugin = null;
    }

    constructor(listener, plugin){
        this.initVars();

        this._listener = listener;
        this._plugin = plugin;
    }

    getListener(){
        return this._listener;
    }

    getListenerFor(event){
        return this.getListener().getListenerFor(event);
    }

    getOptionsFor(event){
        return this.getListener().getOptionsFor(event);
    }

    getPlugin(){
        return this._plugin;
    }

    callEvent(name, event){
        /*if(event instanceof Cancellable && event.isCancelled() && this.isIgnoringCancelled()){
            return true;
        }*/
        let listener = this.getListenerFor(name);
        let options = this.getOptionsFor(name);
        if(listener !== null){
            //if(event instanceof Cancellable && event.isCancelled() && options.ignoreCancelled === true) return true;

            listener = listener.bind(this.getPlugin());
            return listener(event);
        }else{
            return false;
        }
    }
}

module.exports = RegisteredListener;