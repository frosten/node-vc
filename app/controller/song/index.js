var template = require('../../../core/template');
var model = require('../../model/song.js');
var config = require('../../../config.js');
var httpRequest = require("request");

model.create();

(function () {
    'use strict';

    var findSongInfo = function (selectedSong, callback) {
        callback(selectedSong);
        /*
        var url = model.getPresentingUrl(selectedSong);
        httpRequest.get(url, function (error, subResponse, body) {
            var songInfo = JSON.parse(body);
            console.log(songInfo);
            selectedSong.from = songInfo.result.city_name !== '' ? '' : "<i>from</i> " + songInfo.result.city_name;
            selectedSong.bio = songInfo.result.biography_snippets;
            callback(selectedSong);
        });*/
    };

    var song = {
        _any: function () {
            var self = this;
            var path = this.parsedUrl.pathname.split('/');
            var selectedSong;

            if (path.length === 3) {
                var id = path[2];
                selectedSong = model.getSongByID(id);
            }

            if (selectedSong) {
                findSongInfo(selectedSong, function (song) {
                    if (self.queryString.type && self.queryString.type === 'json') {
                        self.response.end(JSON.stringify(song));
                    } else {
                        var tmpl = template.load('/app/view/index.html', function (html) {
                            self.response.end(template.compile(html, song));
                        });
                    }
                });
            } else {
                self.response.writeHead(301, {
                    Location: config.url
                });
                self.response.end();
            }
        }
    };

    module.exports = song;
}());
