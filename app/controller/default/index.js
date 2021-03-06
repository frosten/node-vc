var template = require('../../../core/template');
var model = require('../../model/default.js');
var httpRequest = require("request");

(function () {
    'use strict';

    function breakIfRequestJSON(response) {
        if (response.queryString.type && response.queryString.type === 'json') {
            response.response.end(JSON.stringify(model));
        }
    }

    var index = {
        pageLoad: function () {
            breakIfRequestJSON(this);
            
            var self = this;
            template.load('/app/view/index.html', function (html) {
                self.response.end(template.compile(html, { Message: 'World' }));
            });
        }
    };

    module.exports = index;
}());