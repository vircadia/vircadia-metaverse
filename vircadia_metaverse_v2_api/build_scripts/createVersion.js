
const fse = require('fs-extra');
var gitVer = require('child_process').execSync('git rev-parse --short HEAD').toString().trim();
var gitVerFull = require('child_process').execSync('git rev-parse HEAD').toString().trim();
var packageVersion = process.env.npm_package_version;
const filePath = './lib/metaverse_info.json';

console.log('Found package version', packageVersion);
console.log('Found Git commit short hash', gitVer);
console.log('Found Git commit long hash', gitVerFull);

function yyyymmdd() {
    var x = new Date();
    var y = x.getFullYear().toString();
    var m = (x.getMonth() + 1).toString();
    var d = x.getDate().toString();
    (d.length == 1) && (d = '0' + d);
    (m.length == 1) && (m = '0' + m);
    var yyyymmdd = y + m + d;
    return yyyymmdd;
}

var jsonToWrite = {
    npm_package_version: packageVersion,
    git_commit: gitVerFull,
    version_tag: (packageVersion + '-' + yyyymmdd() + '-' + gitVer)
};

jsonToWrite = JSON.stringify(jsonToWrite);

var attemptFileWrite = fse.outputFileSync(filePath, jsonToWrite);
