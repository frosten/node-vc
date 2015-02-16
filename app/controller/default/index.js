var template = require('../../../core/template');
var model = require('../../model/song.js');
var httpRequest = require("request");

model.create();

(function () {
    'use strict';


    var findSongInfo = function (selectedSong, callback) {
        callback(selectedSong);
        /*
        var url = model.getPresentingUrl(selectedSong);
        httpRequest.get(url, function (error, subResponse, body) {
            console.log(url);
            console.log(body);
            var songInfo = JSON.parse(body);
            console.log(songInfo);
            selectedSong.from = songInfo.result.city_name !== '' ? '' : "<i>from</i> " + songInfo.result.city_name;
            selectedSong.bio = songInfo.result.biography_snippets;
            callback(selectedSong);
        });*/
    };

    var getModel = function (self) {
        var song;
        if (self.queryString && self.queryString.id) {
            song = model.getSongByID(self.queryString.id);
        }

        if (!song) {
            song = model.getRandom();
        }
        return song;
    }

    var index = {
        pageLoad: function () {
            var self = this;
            if (self.queryString.type && self.queryString.type === 'json') {
                self.response.end(JSON.stringify(model.getRandom()));
            }

            var tmpl = template.load('/app/view/index.html', function (html) {
                var selectedSong = model.getRandom();
                findSongInfo(selectedSong, function (song) {
                    self.response.end(template.compile(html, song));
                });
            });
        }
    };

    module.exports = index;
}());
