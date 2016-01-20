/**
 * @require jQuery, Frame
 *
 * Register callbacks for when page changes scroll direction.
 */
(function($) {
    "use strict";

    if('function' != typeof $) {
        alert('ScrollDirection requires jQuery.');
        return;
    }
    if('function' != typeof $.frame) {
        alert('ScrollDirection requires Frame.');
        return;
    }

    // Optionally add callbacks to be executed when:
    // goingUp      - The page is being scrolled up
    // goingDown    - The page is being scrolled down
    // atTop        - The page is at the top of the document
    // notAtTop     - The page is not at the top of the document
    // atBottom     - The page is at the bottom of the document
    // notAtBottom  - The page is not at the bottom of the document
    // Pass TRUE to callImmediately to immediately simulate a scroll event
    $.scrollDirection               = function(goingUp, goingDown, atTop, notAtTop, atBottom, notAtBottom, callImmediately) {
        $.scrollDirection.listeners.push([goingUp, goingDown, atTop, notAtTop, atBottom, notAtBottom]);
        if(callImmediately) {
            $.frame($.scrollDirection.callback);
        }
    };

    // Cached scrollTop position
    $.scrollDirection.position      = 0;

    // Cached direction of scrolling (null = no direction)
    $.scrollDirection.direction     = null;

    // Array of all registered listeners
    $.scrollDirection.listeners     = [];

    // Execute all callbacks
    $.scrollDirection.callback      = function() {
        // Get current & last scrollTop offsets
        var currentScrollTop        = Math.max(0, $(window).scrollTop());
        var lastScrollTop           = $.scrollDirection.position;
        $.scrollDirection.position  = currentScrollTop;

        // Determine scroll direction
        var lastDirection           = $.scrollDirection.direction;
        var currentDirection        = null;
        if(currentScrollTop > lastScrollTop) {
            currentDirection        = false; // down
        } else if(currentScrollTop < lastScrollTop) {
            currentDirection        = true; // up
        }
        if(null !== currentDirection) {
            $.scrollDirection.direction = currentDirection;
        }

        // Has direction changed
        var changedDirection        = null !== currentDirection && currentDirection !== lastDirection;

        // At top or at bottom?
        var isAtTop                 = 0 == currentScrollTop;
        var isAtBottom              = $(document).height() - $(window).height() == currentScrollTop;

        // Execute callbacks
        $.each($.scrollDirection.listeners, function() {
            if(changedDirection && true === currentDirection && 'function' == typeof this[0]) {
                this[0]();
            }
            if(changedDirection && false === currentDirection && 'function' == typeof this[1]) {
                this[1]();
            }
            if(isAtTop && 'function' == typeof this[2]) {
                this[2]();
            } else if('function' == typeof this[3]) {
                this[3]();
            }
            if(isAtBottom && 'function' == typeof this[4]) {
                this[4]();
            } else if('function' == typeof this[5]) {
                this[5]();
            }
        });
    };

    // Bind callbacks to the scroll event
    $.frame('scroll', $.scrollDirection.callback);
})(jQuery);