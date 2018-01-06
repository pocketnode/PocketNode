const fs = require("fs");
const Path = require("path");

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

    static writeFile(p, data){
        return fs.writeFileSync(p, data);
    }

    static copy(s, d){
        return fs.copyFileSync(s, d);
    }

    static isDir(d){
        let stats = fs.statSync(d);
        return stats.isDirectory();
    }

    static isFile(p){
        let stats = fs.statSync(p);
        return stats.isFile();
    }

    static fixPath(p){
        return Path.normalize(p);
    }

    static basename(p){
        return Path.basename(p);
    }

    static dirname(p){
        return Path.dirname(p);
    }

    static getExtension(p){
        return Path.extname(p).substr(1);
    }

    static getFileSize(p){
        let stats = fs.statSync(p);
        return stats.size;
    }

    static readFile(p){
        return fs.readFileSync(p);
    }

    static readFileAsStream(p){
        return fs.createReadStream(p);
    }
}

module.exports = SimpleFileSystem;