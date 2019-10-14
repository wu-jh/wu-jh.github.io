var RegExps = {};
function cacheRegExp(klass){
    return RegExps[klass] || (RegExps[klass] = new RegExp("(?:^|\\s)" + klass + "(?:$|\\s)", "gi"))
}

Element.prototype.toggleClass = function(klass) {
    if ( this.hasClass(klass) ) {
        this.removeClass(klass);
    } else {
        this.addClass(klass);
    }
};

Element.prototype.addClass = function(klass) {
    if ( !this.hasClass(klass) ) {
        this.className += " " + klass;
    }
};

Element.prototype.removeClass = function(klass) {
    if ( this.hasClass(klass) ) {
        this.className = this.className.replace(cacheRegExp(klass), ' ');
    }
};

Element.prototype.hasClass = function(klass) {
    return this.className.match(cacheRegExp(klass))
};

// Move footnotes to end

window.addEventListener('load', moveFootnotes);

function moveFootnotes(e) {
    if (document.getElementsByClassName('footnotes').length > 0) {
        var Footnotes = {};
        Footnotes.div = document.getElementsByClassName('footnotes')[0];
        Footnotes.container = document.createElement('div');
        Footnotes.container.addClass('backdrop-footnotes');
        Footnotes.container.appendChild(Footnotes.div);

        Footnotes.sibling = document.getElementsByTagName('hr');
        Footnotes.sibling = Footnotes.sibling[Footnotes.sibling.length - 1];
        Footnotes.parent  = Footnotes.sibling.parentNode;
        Footnotes.parent.insertBefore(Footnotes.container, Footnotes.sibling);

        Footnotes.heading = document.createElement('h2');
        Footnotes.heading.innerHTML = "Notes";
        Footnotes.div.insertBefore(Footnotes.heading, Footnotes.div.firstChild);
    }
}

var Contact = {};

Contact.deobfuscateLink = function(element) {
    var absolutePath   = element.href,
        pathSegments   = absolutePath.split('/'),
        obfuscatedLink = pathSegments[pathSegments.length - 1],
        unreversedLink = obfuscatedLink.split('').reverse().join(''),
        deobfuscation  = decodeURIComponent(unreversedLink);
    return deobfuscation;
}

Contact.patchButtons = function(klass) {
    var elements = document.getElementsByClassName(klass);
    for (i = 0; i < elements.length; i++) {
        elements[i].href = Contact.deobfuscateLink(elements[i]);
    }
}

Contact.patchButtons('email');

var navList   = document.getElementsByClassName("nav__list")[0],
    navButton = document.getElementsByClassName("nav__toggle")[0];

// click to toggle nav menu
navButton.addEventListener("click", toggleNav.bind(navList));
window.addEventListener("click", closeNav.bind(navList));

var Toggle = {};

function toggleNav(e) {
    var klass = "collapsed";
    this.toggleClass(klass);
    Toggle.recent = true;
    setTimeout(function() { Toggle.recent = false; }, 25);
}

function closeNav(e) {
    var klass     = "collapsed",
        footprint = this.getBoundingClientRect(),
        pointer   = { "belowFloor": e.clientY - footprint.bottom > 0,
                      "wideOfLeft": e.clientX - footprint.left < 0 },
        screen    = { "mobile": window.innerWidth < 600,
                      "tablet": window.innerWidth >= 600 && window.innerWidth < 900 };

    if (!this.hasClass(klass) && !Toggle.recent) {
        if ((screen.mobile && pointer.belowFloor) || 
            (screen.tablet && pointer.wideOfLeft)) {
                e.preventDefault();
                this.addClass(klass);
        }
    }
}

// swipe to hide nav menu
window.addEventListener('touchstart', swipeNavStart.bind(navList));
window.addEventListener('touchmove', swipeNavMvmt.bind(navList), { passive:  false });
window.addEventListener('touchend', swipeNavEnd.bind(navList));

var Swipe = { 'threshold': 30,
              'travel': {} };

function swipeNavStart(e) {
    // initialize Swipe object
    if (!this.hasClass("collapsed")) {
        Swipe.ready     = true;
        Swipe.start     = { "x": e.changedTouches[0].clientX,
                            "y": e.changedTouches[0].clientY };
        Swipe.timeout   = setTimeout(flickExpire.bind(this), 250);
    }

    function flickExpire() {
        if (!Swipe.ready) { return; }
        Swipe.ready = false;
    }
}

function swipeNavMvmt(e) {
    // bail out if swipe event has been reset
    if (!Swipe.ready) { return; }

    // prevent touch-scroll
    e.preventDefault();

    // update Swipe object
    Swipe.travel.x = e.changedTouches[0].clientX - Swipe.start.x;
    Swipe.travel.y = e.changedTouches[0].clientY - Swipe.start.y;
}

function swipeNavEnd(e) {
    // bail out if swipe event has been reset
    if (!Swipe.ready) { return; }

    // reset Swipe object
    Swipe.ready = false;

    if ((window.innerWidth < 600 && Swipe.travel.y < 0) ||
        (window.innerWidth > 599 && window.innerWidth < 900 && Swipe.travel.x > 0)) {
        this.addClass("collapsed");
    }
}

// scroll to hide nav menu
window.addEventListener("scroll", scrollOff.bind(navList));

function scrollOff(e) {
    if (window.innerWidth < 900 && !this.hasClass("collapsed")) {
        this.addClass("collapsed");
    }
}

var header = document.getElementsByClassName("header")[0];

// hide header on scrolldown (and pageload, if below threshold)
window.addEventListener("scroll", toggleHeader.bind(header));

var Scroll = { "threshold": 120,
               "end":       window.scrollY,
               "dir":       "up", // initial value for calculating Scroll.turn
               "flick":     { "ready": false }, // prevent undefined var error
               "last":      {} };

function toggleHeader(e) {
    var klass = "hidden";

    // update Scroll object
    Scroll.last.end = Scroll.end;
    Scroll.last.dir = Scroll.dir;
    Scroll.end      = window.scrollY;
    Scroll.delta    = Scroll.end - Scroll.last.end;
    Scroll.dir      = Math.sign(Scroll.delta) < 0 ? "up" : "dn";
    Scroll.turn     = Scroll.dir !== Scroll.last.dir;
    Scroll.travel   = Math.abs(Scroll.delta);

    if (Scroll.dir === "up") {
        // initialize / reset flick timer
        if (Scroll.turn || !Scroll.flick.ready) {
            Scroll.flick = { "origin":  Scroll.last.end,
                             "ready":   true,
                             "timeout": setTimeout(function() {
                                            Scroll.flick.ready = false;
                                        }, 180) };
            return;
        // at top of page or on fast scrollup, show
        } else if (Scroll.end < Scroll.threshold ||
                  (Scroll.travel > Scroll.threshold && Scroll.flick.ready)) {
            this.removeClass(klass);
        }
    // on turn or when crossing threshold, hide
    } else if (Scroll.end > Scroll.threshold) {
        this.addClass(klass);
    }
}

// edge case: resized window
window.addEventListener("resize", restoreHeader.bind(header));

function restoreHeader(e) {
    if (window.scrollY < Scroll.threshold) {
        this.removeClass("hidden");
    }
}

