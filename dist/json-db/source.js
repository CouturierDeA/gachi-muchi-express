"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unwatch = exports.watch = exports.write = exports.read = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const dir = (0, path_1.join)(__dirname, '/files');
function read(fileName) {
    const path = (0, path_1.join)(dir, fileName);
    return new Promise((resolve, reject) => {
        (0, fs_1.readFile)(path, 'utf8', (err, data) => {
            if (err) {
                return reject(err);
            }
            return resolve(data);
        });
    });
}
exports.read = read;
function write(fileName, content) {
    const path = (0, path_1.join)(dir, fileName);
    return new Promise((resolve, reject) => {
        (0, fs_1.writeFile)(path, content, err => {
            if (err) {
                return reject(err);
            }
            return resolve(true);
        });
    });
}
exports.write = write;
function watch(fileName, callback) {
    const path = (0, path_1.join)(dir, fileName);
    (0, fs_1.watchFile)(path, { persistent: false, interval: 0 }, (curr, prev) => {
        // console.dir(curr)
        callback(curr, prev);
    });
}
exports.watch = watch;
function unwatch(fileName, callback) {
    const path = (0, path_1.join)(dir, fileName);
    (0, fs_1.unwatchFile)(path, callback);
}
exports.unwatch = unwatch;
//# sourceMappingURL=source.js.map