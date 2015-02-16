// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;

function onYouTubeIframeAPIReady() {
    player = new YT.Player('playerDiv', {
        height: '390',
        width: '640',
        videoId: 'e4Is32W-ppk',
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function jumpVolume() {
    if (player.isMuted()) {
        $('.volume').addClass('active').addClass('animated bounce').on(animationEndHandler, function () {
            $('.volume').removeClass('animated bounce');
        });

    }
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
    jumpVolume();
    player.addEventListener('onStateChange', function (newState) {
        switch (newState) {
        case YT.PlayerState.ENDED:
                awePlayer.next();
            break;
        }
    });
    event.target.playVideo();
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
var done = false;

function onPlayerStateChange(event) {
    switch (event.data) {
    case YT.PlayerState.PLAYING:
        jumpVolume();
        break;
    }
}

function stopVideo() {
    player.stopVideo();
}

function onSearchResponse(response, callback) {
    if (!response && !response.items && response.items.length <= 0) {
        console.log('video not found skip next');
    }

    try {
        videoId = response.items[0].id.videoId;

        if (player && typeof player.loadVideoById === 'function') {
            player.loadVideoById(videoId);
        } else {
            startPlayerById(videoId);
        }

        if (typeof callback === 'function') {
            callback();
        }
    } catch (e) {
        console.log(e);
    }
}

function search(name, title, callback) {
    var request = gapi.client.youtube.search.list({
        part: 'id',
        q: name + " " + title
    });
    request.execute(function (resp) {
        onSearchResponse(resp, callback);
    });
}

function loadAwe() {
    gapi.client.setApiKey('AIzaSyCQ8aq-58fPc_9Eusl_65yLkqrGWEGsvSk');
    gapi.client.load('youtube', 'v3', function () {
        console.log('searching music');
        search($('.title h1').text(), $.trim($('.title h2').text()));
    });
}


var awePlayer = {
    lastSongData: null,
    muteUnmute: function () {
        if (player) {
            if ($(this).hasClass('active')) {
                player.mute();
            } else {
                player.unMute();
            }
        }
    },
    play: function () {
        if (player) {
            if ($(this).hasClass('control-pause')) {
                player.playVideo();
            } else {

                player.stopVideo();

            }
        }
    },
    action: function (type) {
        var url = '';
        if (awePlayer.lastSongData === null) {
            url = '/song/' + $('.information').attr('data-' + type) + '?type=json'
        } else {
            url = '/song/' + awePlayer.lastSongData[type] + '?type=json'
        }
        $.backstretch('/app/view/content/images/load.gif');
        $.ajax({
            url: url,
            dataType: "json"
        }).done(function (data) {
            showLoading();
            search(data.name, data.title, function () {
                $('.title h1').text(data.name);
                $('.title h2').text(data.title);
                awePlayer.lastSongData = data;
                /*
                $('.information').attr('data-id', data.id)
                    .attr('data-songname', data.name)
                    .attr('data-title', data.title)
                    .attr('data-prev', data.prev)
                    .attr('data-next', data.next);*/
                loadImage(data.backgroundImage);
            });
        });
        $('.control-play').toggleClass('control-pause');
    },
    prev: function () {
        awePlayer.action('prev');
    },
    next: function () {
        awePlayer.action('next');
    },
    share: function () {
        var socialType = $(this).attr('data-params')

        var songLink = '/song/' + $('.information').attr('data-id');
        if (awePlayer.lastSongData !== null) {
            songLink = '/song/' + awePlayer.lastSongData.id;
        }
        switch (socialType) {
        case 'twitter':
            var link = "https://twitter.com/intent/tweet?hashtags=AuralHappiness&amp;related=auralhappiness&amp;" +
                "text=I%27m%20listening to " + $('.information').attr('data-songname') + " / " + $('.information').attr('data-title') +
                "&amp;tw_p=tweetbutton&amp;url=http%3A%2F%2Fauralhappiness.com" +
                songLink + ";via=auralhappiness";
            window.open(link, "twt", "width=600, height=400");
            break;
        case 'facebook':
            FB.ui({
                method: 'share',
                href: location.host + songLink,
            }, function (response) {});
            break;
        }
    }
};
