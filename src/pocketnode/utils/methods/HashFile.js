const Crypto = require("crypto");
const FileSystem = require("fs");

/**
 * Hash a file with a given algo
 * @param algo   {string}
 * @param path   {string}
 * @param buffer {boolean} return buffer
 */
function HashFile(algo, path, buffer = false){
    let hash = Crypto.createHash(algo);
    hash.update(FileSystem.readFileSync(path));
    return buffer === true ? hash.digest() : hash.digest("hex");
}

module.exports = HashFile;