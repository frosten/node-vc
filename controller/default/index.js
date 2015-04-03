var papirus = require('papirus');

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
            console.log(papirus);
            papirus.template.load('/app/view/index.html', model, function (html) {
                self.response.end(html);
            });
        }
    };

    module.exports = index;
}());