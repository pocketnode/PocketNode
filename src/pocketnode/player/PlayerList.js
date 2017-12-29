const Player = pocketnode("player/Player");

class PlayerList extends Map {
    addPlayer(id, player){
        CheckTypes([Player, player]);
        this.set(id, player);
    }

    getPlayer(id){
        return this.has(id) ? this.get(id) : null;
    }

    hasPlayer(player){
        return Array.from(this.values()).indexOf(player) !== -1;
    }

    getPlayerIdentifier(player){
        return Array.from(this.keys())[Array.from(this.values()).indexOf(player)];
    }

    removePlayer(id){
        return this.delete(id);
    }
}

module.exports = PlayerList;