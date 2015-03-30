var config = require('../../config.js');
var vash = require('vash');
var fs = require('fs');

(function () {
    'use strict';
    var template = {
        compile: function (content, model) {
            var tpl = vash.compile(content);
            var out = tpl(model);
            return out;
        },
        load: function (file, callback) {
            fs.exists(config.basePath + file, function (exists) {
                if (exists) {
                    fs.readFile(config.basePath + file, 'utf8', function (err, data) {
                        callback(data);
                    });
                } else {
                    callback("template not found");
                }
            });
        }
    };

    module.exports = template;
}());