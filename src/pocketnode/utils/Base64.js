class Base64 {
    static get alphabet(){
        return ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "+", "/", "="];
    }

    static checkForValidAlphabet(str){
        for(let i = 0; i < str.length; i++){
            if(Base64.alphabet.indexOf(str[i]) === -1) return false;
        }
        return true;
    }

    static decode(str, strict = false){
        if(strict === true){
            if(Base64.checkForValidAlphabet(str)){
                return Buffer.from(str, "base64").toString();
            }else{
                return false;
            }
        }
        return Buffer.from(str, "base64").toString();
    }

    static encode(str){
        return Buffer.from(str).toString("base64");
    }
}

module.exports = Base64;