/*
    copyStatic.js

    Created by Kalila L. on Dec 20 2020.
    Copyright 2020 Vircadia contributors.

    Distributed under the Apache License, Version 2.0.
    See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
*/

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
