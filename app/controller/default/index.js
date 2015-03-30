var template = require('../../../core/template');
var model = require('../../model/default.js');
var httpRequest = require("request");

(function () {
    'use strict';

    var index = {
        pageLoad: function () {
            var self = this;
            if (self.queryString.type && self.queryString.type === 'json') {
                self.response.end(JSON.stringify(model));
            }

            var tmpl = template.load('/app/view/index.html', function (html) {
                self.response.end(template.compile(html, model));
            });
        }
    };

    module.exports = index;
}());