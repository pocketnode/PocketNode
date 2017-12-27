const Base64 = pocketnode("utils/Base64");

class Utils {
    static decodeJWT(token){
        let parts = token.split(".");
        let headB64 = parts[0];
        let payloadB64 = parts[1];
        let sigB64 = parts[2];

        return JSON.parse(Base64.decode((payloadB64.replace(/-/g, "+").replace(/_/g, "/")), true));
    }
}

module.exports = Utils;