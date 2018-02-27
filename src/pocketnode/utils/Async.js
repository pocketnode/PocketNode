/**
 * Async
 * run stuff in async via setImmediate
 * @param cb {Function} run this in async
 * @return {Promise<any>}
 */
function Async(cb){
    return new Promise((resolve, reject) => {
        new Promise((done, fail) => {
            setImmediate(() => {
                try {
                    cb();
                    done();
                } catch(e) {
                    fail(e);
                }
            });
        }).then(() => resolve()).catch(e => reject(e));
    });
}

module.exports = Async;