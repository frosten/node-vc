var executerClasses = {
    player: awePlayer

}

window.addEventListener('click', function (evt) {

    var baseClass = evt.target.getAttribute('data-class');
    if (baseClass) {
        var run = evt.target.getAttribute('data-run');
        var isLock = evt.target.getAttribute('data-lock');
        if (executerClasses[baseClass] && typeof executerClasses[baseClass][run] === 'function') {
            executerClasses[baseClass][run].call(evt.target);
        }
    }
}, false);
