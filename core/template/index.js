var config = require('../../config.js');
var vash = require('vash');
var fs = require('fs');

(function () {
    'use strict';
    var template = {
        load: function (file, model, cb) {
            var filepath = config.basePath + file;
            fs.exists(filepath, function (exists) {
                if (exists) {
                    vash.renderFile(filepath, model, function (err, tpl) {
                        if (err) throw err;
                        cb(tpl);
                    });
                    
                } else {
                    cb("template:404");
                }
            });
        }
    };

    module.exports = template;
}());