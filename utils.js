/**
 * Created by huangyh(黄永号) on 2017/11/29.
 */

let path = require("path");
let glob = require("glob");

let config = require("./config.js");

exports.assetsPath = function assetsPath(_path) {
    const assetsSubDirectory = process.env.NODE_ENV === 'production'
        ? config.build.assetsSubDirectory
        : config.dev.assetsSubDirectory

    return path.posix.join(assetsSubDirectory, _path)
};

exports.getEntries = function getEntries(globPath) {
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
};