String.prototype.ucfirst = function(){
    str = this.valueOf().split("");
    str[0] = str[0].toUpperCase();
    return str.join("");
};