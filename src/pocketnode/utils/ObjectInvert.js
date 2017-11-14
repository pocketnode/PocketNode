function ObjectInvert(object){
    var new_object = {};
    for(var key in object){
        new_object[object[key]] = key;
    }
    return new_object;
}

module.exports = ObjectInvert;