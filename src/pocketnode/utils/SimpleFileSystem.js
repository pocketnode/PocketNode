const fs = require("fs");

class SimpleFileSystem {
    static fileExists(f){
        return fs.existsSync(f);
    }

    static dirExists(d){
        return this.fileExists(d);
    }

    static mkdir(d){
        return fs.mkdirSync(d);
    }
}

module.exports = SimpleFileSystem;