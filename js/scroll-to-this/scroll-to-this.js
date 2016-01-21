/**
 * @require jQuery, ScrollTo, jQuery Bez
 *
 * Scrolls the document to a specific element.
 * Usage: $(element).scrollToThis();
 *
 * Optionally you can specify a $target as the first argument. In this case it will be the target element for scrolling,
 * otherwise the $(document) will be scrolled.
 *
 * You can also modify the default option values by passing them in an object as a second argument. The default values
 * are found in the script.
 *
 * Optionally you can define global scroll offsets by adding attributes to the &lt;body&gt;. This is useful when you
 * have a fixed navigation for example, and you want to exclude it's height from the offset.
 *
 * Use data-scrolltothis-add-0="100" to make the page scroll 100px further.
 * Use data-scrolltothis-add-0="nav" to make the page scroll further according to the height of the "nav"
 * (CSS3 selector) element.
 * Use data-scrolltothis-add-0-type to specify which height to use, e.g. "content" (default) to use .height(), "outer"
 * to use .outerHeight() or "margin" to use .outerHeight(true).
 *
 * Alternatively you can make the page scroll less by using attributes like data-scrolltothis-sub-0.
 *
 * As you can probably see you can add multiple "adds" and "subs" by changing the "0" number in the attribute names.
 * Make sure the numbers are consecutive. If you specify 0 and 2, but not 1, the script will only account for 0.
 *
 * You can also add a custom offset by specifying it in the options: {offset: 12}.
 */
(function($) {
    "use strict";

    if('function' != typeof $) {
        alert('ScrollToThis requires jQuery.');
        return;
    }
    if('function' != typeof $.fn.scrollTo) {
        alert('ScrollToThis requires ScrollTo.');
        return;
    }
    if('function' != typeof $.bez) {
        alert('ScrollToThis requires jQuery Bez.');
        return;
    }

    var $body                   = $('body');

    var resolveSingleOffset     = function(attr) {
        var value               = $body.attr(attr);
        if(!isNaN(parseInt(value))) {
            return parseInt(value);
        }

        var $element            = $(value);
        if(0 == $element.length) {
            return 0;
        }

        if($body[0].hasAttribute(attr + '-type')) {
            switch($body.attr(attr + '-type')) {
                case 'content':
                    return $element.height();
                case 'outer':
                    return $element.outerHeight();
                case 'margin':
                    return $element.outerHeight(true);
            }
        }

        return $element.height();
    };

    var resolveOffset           = function(offset) {
        for(var i = 0; $body[0].hasAttribute('data-scrolltothis-offset-add-' + i); i++) {
            offset              += resolveSingleOffset('data-scrolltothis-offset-add-' + i);
        }
        for(i = 0; $body[0].hasAttribute('data-scrolltothis-offset-sub-' + i); i++) {
            offset              -= resolveSingleOffset('data-scrolltothis-offset-sub-' + i);
        }
        return offset;
    };

    $.fn.scrollToThis           = function(target, options) {
        var $target             = $(target);
        $target                 = 0 < $target.length ? $target : $(document);

        var offset              = $(this).first().offset().top;
        offset                  = 0 == offset ? 0 : offset + resolveOffset('number' == typeof options.offset ?
            options.offset : 0);

        options                 = $.extend({}, {
            duration:           1000,
            interrupt:          true,
            easing:             $.bez([0.55, 0, 0.1, 1])
        }, options);

        return $target.scrollTo(offset, options.duration, {
            interrupt:          options.interrupt,
            easing:             options.easing
        });
    };
})(jQuery);