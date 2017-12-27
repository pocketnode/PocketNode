const Player = pocketnode("player/Player");

class PlayerList extends Map {
    addPlayer(id, player){
        CheckTypes([Player, player]);
        this.set(id, player);
    }

    getPlayer(id){
        return this.has(id) ? this.get(id) : null;
    }

    removePlayer(id){
        return this.delete(id);
    }
}

module.exports = PlayerList;