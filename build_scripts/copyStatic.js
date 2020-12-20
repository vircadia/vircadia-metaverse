const fse = require('fs-extra');

const srcDir = `./src/static`;
const destDir = `./dist`;

fse.copySync(srcDir, destDir, { overwrite: true }, function (err) {
    if (err) {
        console.error(err);
    } else {
        console.log("Successfully copied src/static to dist!");
    }
});