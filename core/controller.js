var fs = require('fs');
var config = require('../config.js');

var controllers = {};

/*
 * get All controllers.
 */
function getControllers() {
    return controllers;
}

/*
 * get files in directory.
 */
function getFiles(dir, files_) {
    files_ = files_ || [];
    if (typeof files_ === 'undefined') {
        files_ = [];
    }

    var files = fs.readdirSync(dir);
    for (var i in files) {
        if (!files.hasOwnProperty(i)) {
            continue;
        }

        var name = dir + '/' + files[i];
        if (fs.statSync(name).isDirectory()) {
            getFiles(name, files_);
        } else {
            files_.push(name);
        }
    }
    return files_;
}


function register() {
    var controllerDir = getFiles(config.basePath + '/app/controller');

    controllerDir.forEach(function (item, index) {
        var paths = item.split('/');
        var controllerName = paths[paths.length - 2];

        controllers[controllerName] = require('../app/controller/' + controllerName);
    });
}

register();

exports.controller = controllers;
exports.register = register;
exports.getControllers = getControllers;