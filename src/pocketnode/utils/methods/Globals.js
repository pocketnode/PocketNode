const Path = require("path");

/**
 * Require files from PocketNode
 * @param path {string}
 * @return {*}
 */
global.pocketnode = function(path){
    return require(Path.normalize(__dirname + "/../../" + path));
};

const SFS = pocketnode("utils/SimpleFileSystem");

void function(){
    function walk(dir){
        SFS.walkDir(dir).forEach(path => {
            if(SFS.basename(SFS.dirname(path)) === "pocketnode" && SFS.isFile(path)) return; //omit Server, PocketNode

            let parent;
            if(SFS.isDir(path)){
                parent = trace(path);
            }else if(SFS.isFile(path)){
                parent = trace(SFS.dirname(path));
            }


            if(SFS.isDir(path)){
                walk(path);
            }else if(SFS.isFile(path)){
                parent.files[Path.basename(path, ".js")] = path;
            }
        });
    }

    function trace(path){
        path = path.split(Path.sep);
        path = path.slice(path.lastIndexOf("pocketnode")+1);

        let parent = global.pocketnode;

        path.forEach(part => {
            if(part === "") return;

            if(typeof parent[part] === "undefined"){
                parent[part] = {
                    files: {},
                    use: function(file){
                        if(typeof file === "string"){
                            file = file.indexOf(".js") !== -1 ? file.slice(0, -3) : file;
                            if(Object.keys(this.files).indexOf(file) !== -1){
                                return require(this.files[file]);
                            }else{
                                throw new Error(`The requested resource, ${file}, was not found!`);
                            }
                        }else if(file instanceof Array){
                            let files = [];

                            file.forEach(f => {
                                if(Object.keys(this.files).indexOf(f) !== -1){
                                    files.push(require(this.files[f]));
                                }else{
                                    files.push(undefined);
                                }
                            });

                            return files;
                        }
                    },
                    all(){
                        let all = {};
                        for(let name in this.files){
                            all[name] = require(this.files[name]);
                        }
                        return all;
                    }
                };
            }

            parent = parent[part];
        });

        return parent;
    }

    walk(__dirname + "/../../");
}();


/**
 * PHP-like rounding added onto the Math object
 * @param value     {number}
 * @param precision {number}
 * @param mode      {string}
 * @return {Number}
 */
Math.round_php = function(value, precision = 0, mode = "ROUND_HALF_UP"){
    let m, f, isHalf, sgn;
    m = Math.pow(10, precision);
    value *= m;
    // sign of the number
    sgn = (value > 0) | -(value < 0);
    isHalf = value % 1 === 0.5 * sgn;
    f = Math.floor(value);
    if(isHalf){
        switch (mode) {
            case "ROUND_HALF_DOWN":
                // rounds .5 toward zero
                value = f + (sgn < 0);
                break;
            case "ROUND_HALF_EVEN":
                // rounds .5 towards the next even integer
                value = f + (f % 2 * sgn);
                break;
            case "ROUND_HALF_ODD":
                // rounds .5 towards the next odd integer
                value = f + !(f % 2);
                break;
            default:
                // rounds .5 away from zero
                value = f + (sgn > 0);
        }
    }
    return ((isHalf ? value : Math.round(value)) / m);
};

/**
 * CheckTypes
 * Example: CheckTypes([String, "myString"]); // true
 *          CheckTypes([String, 12]); // throws TypeError
 *
 * @throws {TypeError}
 * @return {boolean}
 */
global.CheckTypes = function(...args){
    if(args.length === 0) throw new TypeError("Expecting at least 1 Array. Example: [Object, myObjectVar]");

    args.forEach(arg => {
        if(!(arg instanceof Array)){
            throw new TypeError("Expecting Array, got "+(arg.constructor.name ? arg.constructor.name : arg.name));
        }

        if(typeof arg[0] === "undefined" || typeof arg[1] === "undefined"){
            throw new TypeError("Expecting Array with two items. Example: [Object, myObjectVar]");
        }

        let type = arg[0];
        let item = arg[1];

        if(
            !(item instanceof type) &&
            (item.constructor.name !== type.name && item.constructor !== type)
        ){
            throw new TypeError("Expecting "+type.name+", got "+item.constructor.name);
        }
    });
    return true;
};

String.prototype.ltrim = function(char){
    let str = this.valueOf();
    while(true){
        if(str[0] === char) str = str.substr(1);
        else break;
    }
    return str;
};

String.prototype.rtrim = function(char){
    let str = this.valueOf().split("").reverse().join("");
    while(true){
        if(str[0] === char) str = str.substr(1);
        else break;
    }
    return str.split("").reverse().join("");
};

String.prototype.contains = function(str){
    return this.indexOf(str) !== -1;
};

/**
 * @author Jonas Raoni Soares Silva
 * @link http://jsfromhell.com/string/wordwrap
 */
String.prototype.wordwrap = function(m, b, c){
    let i, j, l, s, r;
    if(m < 1)
        return this;
    for(i = -1, l = (r = this.split("\n")).length; ++i < l; r[i] += s)
        for(s = r[i], r[i] = ""; s.length > m; r[i] += s.slice(0, j) + ((s = s.slice(j)).length ? b : ""))
            j = c == 2 || (j = s.slice(0, m + 1).match(/\S*(\s)?$/))[1] ? m : j.input.length - j[0].length
                || c == 1 && m || j.input.length + (j = s.slice(m).match(/^\S*/)).input.length;
    return r.join("\n");
};

global.assert = require("assert");

global.sleep = function(ms){
    return sleep_until(Date.now() + ms);
};

global.sleep_until = function(ms){
    while(Date.now() < ms){}
    return true;
};

/**
 * A more accurate interval
 * @param fn       {Function}
 * @param interval {Number}
 */
global.createInterval = function(fn, interval){
    return new (function(){
        this.baseline = undefined;
        this.run = function(){
            if(this.baseline === undefined){
                this.baseline = Date.now();
            }

            fn();

            let end = Date.now();
            this.baseline += interval;

            let nextTick = interval - (end - this.baseline);
            if (nextTick < 0) nextTick = 0;
            this.timer = setTimeout(() => this.run(end), nextTick);
        };

        this.stop = () => clearTimeout(this.timer);
    });
};