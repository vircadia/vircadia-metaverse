const fs = require('fs');
const path = require('path');
var globby = require('globby');
var async = require('async');

const mailtemplatesPath = process.env.NODE_ENV
    ? '../mailtemplates'
    : '../../mailtemplates';

const files = fs
    .readdirSync(path.join(__dirname, mailtemplatesPath))
    .filter((file: any) => file.indexOf('.html') > -1);

async.each(files, function (file: any) {
    fs.writeFile(
        path.join(__dirname, `${file}`),
        fs.readFileSync(path.join(__dirname, `${mailtemplatesPath}/${file}`)),
        (err: any) => {
            if (err) throw err;
        }
    );
});
