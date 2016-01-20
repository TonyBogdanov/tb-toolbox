/**
 * @require jQuery, Frame, ScrollToThis
 *
 * Include this in your project for a quick start into one-page-navigation linking.
 * Features:
 *
 *  - Null Anchors      - Any anchor with href of "#" or "#!" will do nothing when clicked. Disable this feature by
 *                        adding a data-linking-disable-null attribute (value doesn't matter) to the body tag.
 *
 *  - Scroll-To Anchors - You can make the page scroll down or up to a certain element, first add id="something"
 *                        to that element, so you can target it by the ID attribute. Next create an anchor in like this:
 *                        href="some-page.php#!something", if not already on the page, no scrolling will happen and
 *                        you'll navigate to that page as normal. If you're already on that page, the window will
 *                        scroll down to the id="something" element. Disable this feature by adding a
 *                        data-linking-disable-scroll-to attribute (value doesn't matter) to the body tag.
 *
 *  - Auto-Scroll       - When you first load a page, if there's a #!something in the URL, once everything is loaded,
 *                        the page will automatically scroll down to that element (if available). Generally this will
 *                        occur on a "load" event on the window, but if you have a pre-loader animation, you can specify
 *                        a custom event name on which the auto-scroll should be triggered by adding a
 *                        data-linking-auto-scroll-event="new-event-name" attribute to the body tag. The event should
 *                        still be triggered on the window. Disable this feature by adding a
 *                        data-linking-disable-auto-scroll attribute (value doesn't matter) to the body tag.
 *
 * By default if the page includes a "#!..." part in the URL, upon loading an auto-scroll will be triggered. In many
 * cases however, its really important to let all assets like images and styles load before auto-scrolling, or the
 * target offset might be incorrect. This is why the auto-scroll will occur on the $(window).bind('load') event.
 *
 * In special cases one might also want to trigger the auto-scroll even later, accounting for any custom pre-loaders
 * for example. In such cases you can add a data-linking-auto-scroll-event="event-name" attribute to the &lt;body&gt;
 * element. The auto-scroll will only be triggered on the "event-name" event on the window. Making sure the event
 * spawns (eventually), and spawns only once is your responsibility.
 */
(function($) {
    "use strict";

    if('function' != typeof $) {
        alert('Linking requires jQuery.');
        return;
    }
    if('function' != typeof $.frame) {
        alert('Linking requires Frame.');
        return;
    }
    if('function' != typeof $.fn.scrollToThis) {
        alert('Linking requires ScrollToThis.');
        return;
    }

    $(function() {
        var $body                   = $('body');

        // Null anchors
        if(!$body[0].hasAttribute('data-linking-disable-null')) {
            $body.on('click', 'a[href$="#"], a[href$="#!"]', function (e) {
                e.preventDefault();
            });
        }

        // Scroll-To Anchor
        if(!$body[0].hasAttribute('data-linking-disable-scroll-to')) {
            $body.on('click', 'a[href*="#!"]:not([href$="#!"])', function(e) {
                var $this           = $(this);
                var split           = $this.attr('href').split('#!');
                var normalizePath   = function(path) {
                    if(null === path.match(/^https?:\/\//)) {
                        path        = document.location.protocol.replace(':', '') + ':/' + document.location.host + '/' + path;
                    }
                    path            = path.replace(/\/\./, '');
                    path            = path.replace(/\/[^\/]+\/\.\./, '/');
                    path            = path.replace(/index\.(php|html)$/i, '');
                    path            = path.replace(/\/{2,}/g, '/');
                    path            = path.replace(/(https?:\/)/i, '$1/');
                    path            = path.replace(/^(https?:\/\/[^\/]+)\/?$/i, '$1/');
                    return path;
                };
                var relativePath    = function(path, base) {
                    path            = path.replace(/^\/|\/$/, '');
                    base            = base.replace(/^\/|\/$/, '');

                    if(path.split('://')[1] != base.split('://')[1]) {
                        return path;
                    }

                    var left        = path.split('/');
                    var right       = base.split('/');

                    for(var i = 0; i < left.length; i++) {
                        if('undefined' != typeof right[i] && left[i] == right[i]) {
                            delete left[i];
                            delete right[i];
                        }
                    }

                    var result      = '';
                    for(i = 0; i < right.length; i++) {
                        if('undefined' == typeof right[i]) {
                            continue;
                        }
                        result      += '../';
                    }

                    var hasLeft     = false;
                    for(i = 0; i < left.length; i++) {
                        if('undefined' == typeof left[i]) {
                            continue;
                        }
                        result      += left[i] + '/';
                        hasLeft     = true;
                    }

                    if(hasLeft) {
                        result      = result.substr(0, result.length - 1);
                    }

                    return result;
                };

                var currentURL      = normalizePath(document.location.toString());
                var targetURL       = '' == split[0] ? currentURL : normalizePath(split[0]);
                var relativeURL     = relativePath(targetURL, currentURL);

                if(0 == relativeURL.length) {
                    e.preventDefault();
                    var $target     = $('#' + split[1]);
                    if(0 < $target.length) {
                        $target.scrollToThis();
                    }
                }
            });
        }

        // Auto-Scroll to target on page load
        if(!$body[0].hasAttribute('data-linking-disable-scroll-to')) {
            $.frame($body[0].hasAttribute('data-linking-auto-scroll-event') ?
                $body.attr('data-linking-auto-scroll-event') : 'load', function() {
                var split           = document.location.href.split('#!');
                if(1 < split.length && 0 < split[1].length) {
                    var $target     = $('#' + split[1]);
                    if(0 < $target.length) {
                        $target.scrollToThis();
                    }
                }
            });
        }
    });
})(jQuery);