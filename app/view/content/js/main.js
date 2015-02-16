var animationEndHandler = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';


function hideLoading() {
    $('.footer-logo').unbind(animationEndHandler);
    $('.footer-logo').removeClass('animated flash');
}


function loadImage(src) {
    $("<img/>")
        .load(function () {
            $.backstretch(src, {
                duration: 3000,
                fade: 750
            });
            var tmp_timer = setTimeout(function () {
                hideLoading();
                clearTimeout(tmp_timer);
            }, 1100)
        })
        .error(function () {
            console.log("error loading image");
        })
        .attr("src", src)
}


function showLoading() {
    $('.footer-logo').addClass('animated flash').on(animationEndHandler, function () {
        $('.footer-logo').removeClass('animated');
        var x_timer = setTimeout(function () {
            $('.footer-logo').addClass('animated');
            clearTimeout(x_timer);
        }, 200);
    });
}


$(document).ready(function () {
    /* var footerControl = $('.footer .control-area .left a')
    footerControl.click(function (e) {
        e.preventDefault();
        footerControl.removeClass('active');
        $(this).addClass('active');
    });*/
    $.backstretch('/app/view/content/images/load.gif');


    $('.control-pause').click(function (e) {
        e.preventDefault();
    });

    $('.track-like').click(function () {
        $(this).toggleClass('active');
    });

    $('.volume').click(function () {
        $(this).toggleClass('active');
    });
    /*
    $('.track-share').click(function () {
        $(this).next().toggleClass('active');
    });*/

    $('.js-about').click(function (e) {
        e.preventDefault();
        $('.terms-popup').fadeIn();

    });

    $('.close-btn').click(function (e) {
        e.preventDefault();

        $('.terms-popup').fadeOut();
    });


    //start animations
    var nextEffect = 'flipInY'
    $('.next-btn, .prev-btn').on(animationEndHandler, function () {
        $(this).removeClass('animated ' + nextEffect);
    });

    $('.next-btn, .prev-btn').click(function (e) {
        e.preventDefault();
        $(this).addClass('animated ' + nextEffect);
    });

    $('.control-next, .control-pause, .control-prev, .control-my-list, .control-play').on(animationEndHandler, function () {
        $(this).removeClass('animated bounceIn')
    });

    $('.track-share-area').on(animationEndHandler, function () {
        if (!$(this).hasClass('bounceOut')) {
            $(this).attr('class', 'track-share-area active');
            return;
        }
        $(this).attr('class', 'track-share-area');
    });

    $('.track-share').click(function (e) {
        e.preventDefault();
        var shareArea = $('.track-share-area');
        if (shareArea.hasClass('active')) {
            shareArea.addClass('animated bounceOut');
        } else {
            shareArea.addClass('animated bounceIn active');
        }
    });

    $('.control-next, .control-pause, .control-prev, .control-my-list, .control-play').on('click', function (e) {
        e.preventDefault();
        $(this).addClass('animated bounceIn');

        if ($(this).hasClass('control-pause')) {
            $(this).removeClass('control-pause').addClass('control-play');
        } else
        if ($(this).hasClass('control-play')) {
            $(this).removeClass('control-play').addClass('control-pause');
        }
    });

    var trackLikeAnimationEvent = 'swing'
    $('.track-like').on(animationEndHandler, function () {
        $(this).removeClass('animated ' + trackLikeAnimationEvent);
    });

    $('.track-like').click(function (e) {
        e.preventDefault();
        $(this).addClass('animated ' + trackLikeAnimationEvent);
    });

   loadImage($('#modelBg').attr("src"));

});
