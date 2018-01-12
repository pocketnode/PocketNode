const fs = require('fs');

class Translate {
    initVars() {
        this.lang = {};
    }

    constructor(lang) {
        let file = __dirname + '/lang/' + lang + '.json';

        if(!fs.existsSync(file))
            file = __dirname + '/lang/en.json';

        this.lang = JSON.parse(fs.readFileSync(file).toString());
    }

    getString(node, vars = []) {
        let parts = node.split(".");
        if(!this.lang[parts[0]]){
            return "\\NULL";
        }

        let string = this.lang[parts.shift()];

        while(parts.length > 0) {
            let part = parts.shift();
            if(typeof string[part] !== 'undefined')
                string = string[part];
            else
                return "\\NULL";
        }

        let i = 0;
        vars.forEach(_var => {
            string = string.replace('{var' + i + '}', _var);
            i++;
        });

        return string
    }

}

module.exports = Translate;