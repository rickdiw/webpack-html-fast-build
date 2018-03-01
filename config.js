/**
 * Created by huangyh(黄永号) on 2017/11/29.
 */

let path = require("path");
let glob = require("glob");

let config = {
    dev: {
        dir: "dev",
        port: 8199
    },
    production: {
        dir: "dist"
    }
};

function getEntries(globPath) {
    let files = glob.sync(globPath);
    let entries = {}, entry, dirName, baseName, extName;

    for (let i = 0; i < files.length; i++) {
        entry = files[i];
        dirName = path.dirname(entry);
        extName = path.extname(entry);
        baseName = path.basename(entry, extName);

        entries[baseName] = entry;
    }
    return entries;
}

let entries = getEntries("./src/*.html");

/*console.log(entries);*/

module.exports = {
    config,
    entries
};