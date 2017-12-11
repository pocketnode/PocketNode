const Command = pocketnode("command/Command");
const Bundle = require("bundle-js");

class MakePlugin extends Command {
    constructor(){
        super("makeplugin", "Makes a bundled plugin file.", "pocketnode.command.makeplugin", ["mkplugin", "mkp", "bundleplugin"]);
    }

    execute(sender, args){
      Bundle({
          entry : './plugins/'+args[0]+"/src/"+args[0]+".js",
          manifest : './plugins/'+args[0]+"/manifest.json",
          dest : './plugins/'+args[1],
          print : false,
          disablebeautify : false
      })
    }
}

module.exports = MakePlugin;
