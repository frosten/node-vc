var fs = require('fs');
var request = require('request');

function Song() {
    this.allSongs = [];

    var getSongBackgroundImage = function (id) {
        //http://s3.amazonaws.com/thesixtyone_production/photos/song/ab9118952eb051060f5518a44ec53e92_ipad_fullscreen
        return "http://s3.amazonaws.com/thesixtyone_production/photos/" + id + "_ipad_fullscreen";
    };

    /*
     * getting song info from aweditorium
     */
    this.getPresentingUrl = function (song) {
        return "http://www.aweditorium.com/api/song/presentation?song_id=" + song.id +
            "&api_key=32thesixtyone45" +
            "&ipad_device_id=FFFFFFFFAA58C46AC7B54262AA139A6D80C6EE01" +
            "&tz_offset_minutes=-180&v=1.04&country_code=US" +
            "&session_key=8c2deec1c42d69a85082ea583f34a81572bc9269-eef47bfa26de11e4b82012313d1b3ac6";
    };

    this.fillSongs = function (jsonData) {
        for (var key in jsonData.result.mosaic_data_by_coord) {
            if (jsonData.result.mosaic_data_by_coord.hasOwnProperty(key) &&
                jsonData.result.mosaic_data_by_coord[key].hasOwnProperty('song_by_id')) {
                var indis = 0;
                for (var subKey in jsonData.result.mosaic_data_by_coord[key].song_by_id) {
                    var prop = jsonData.result.mosaic_data_by_coord[key].song_by_id[subKey];
                    var songData = {};
                    songData.id = prop.id;
                    songData.name = prop.a;
                    songData.song = prop.ip;
                    songData.title = prop.t;
                    songData.ak = prop.ak;
                    songData.backgroundImage = getSongBackgroundImage(prop.ip);
                    this.allSongs.push(songData);
                }

            } //end sub object data for in
        } //end object data forin
    };

    this.getSongWithNextPrevID = function (index) {
        var result = this.allSongs[index];
        if (index === this.allSongs.length - 1) {
            result.next = this.allSongs[0].id;
        } else {
            result.next = this.allSongs[index + 1].id;
        }

        if (index === 0) {
            result.prev = this.allSongs[this.allSongs.length - 1].id;
        } else {
            result.prev = this.allSongs[index - 1].id;
        }

        return result;
    }

    this.getRandom = function () {
        var random = Math.floor(Math.random() * this.allSongs.length);
        return this.getSongWithNextPrevID(random);
    }

    this.getSongByID = function (id) {
        var song;
        for (var i = 0; i < this.allSongs.length; i++) {
            if (this.allSongs[i].id === id) {
                song = i;
                break;
            }
        }
        return this.getSongWithNextPrevID(song);
    }

    this.create = function (cb) {
        if (this.allSongs.length === 0) {
            var self = this;
            //./app/data/song_data.json
            fs.readFile('./app/data/song_data.json', 'utf8', function (err, data) {
                if (err) {
                    return console.log(err);
                }
                self.fillSongs(JSON.parse(data));
                if (typeof cb === 'function') {
                    cb();
                }
            });
        }
    };

    /*
    this.download = function (uri, filename, callback) {
        request.head(uri, function (err, res, body) {
            console.log('content-type:', res.headers['content-type']);
            console.log('content-length:', res.headers['content-length']);
            request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
        });
    };

    this.downloadAllImages = function () {
        var self = this;
        this.create(function () {
            for (var i = 0; i < self.allSongs.length; i++) {
                var link = self.allSongs[i].backgroundImage;
                var imageName = link.substr(link.lastIndexOf('/'));
                self.download(link, imageName, function () {
                    console.log('done');
                });
            }
        });
    };*/
}

//var songx = new Song();
//songx.downloadAllImages();

module.exports = new Song();
