/**
 * Async
 * run stuff in async via setImmediate
 * @param cb {Function} run this in async
 * @return {Promise<any>}
 */
function Async(cb){
    return new Promise((resolve, reject) => {
        setImmediate(() => {
            try {
                resolve(cb());
            } catch(e) {
                reject(e);
            }
        });
    });
}

module.exports = Async;