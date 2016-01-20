/**
 * @require jQuery
 *
 * Attaches a callback to be called when a CSS Transition end event occurs.
 * Property names a delimited by a space.
 */
(function($) {
    "use strict";

    if('function' != typeof $) {
        alert('TransitionEnd requires jQuery.');
        return;
    }

    var detectTransitionEvent   = function() {
        // Create a dummy element to test for event names
        var element             = document.createElement('div');

        // Map transition properties with the corresponding transitionend event names
        var events              = {
            'transition':       'transitionend',
            'OTransition':      'oTransitionEnd',
            'MozTransition':    'transitionend',
            'WebkitTransition': 'webkitTransitionEnd'
        };

        // Get the first supported event name
        for(var event in events) {
            if("undefined" != typeof element.style[event]) {
                return events[event];
            }
        }

        // Browser does not support the transitionend event
        return null;
    };
    $.fn.transitionEnd          = function(callback, propertyNames, fallbackTimeout) {
        // Call for all elements in the collection
        return $(this).each(function() {
            // Get a jQuery reference to the current element
            var $this           = $(this);

            // Detect the browser supported event name and cache it for future use
            var event           = "undefined" == typeof window._detectedTransitionEventName ? (window._detectedTransitionEventName = detectTransitionEvent()) : window._detectedTransitionEventName;

            // No browser support, use setTimeout
            if(null === event) {
                fallbackTimeout = parseInt(fallbackTimeout);
                setTimeout(callback, isNaN(fallbackTimeout) ? 350 : fallbackTimeout);
                return true;
            }

            // Get a reference to the raw DOM object
            var domElement      = $this.get(0);

            // Remove any previously bound listeners and add a new even handler
            $this.unbind(event).bind(event, function(e) {
                // Is the event actually fired by the current DOM element?
                if(e.originalEvent.target !== domElement) {
                    return;
                }

                // Is the propertyNames argument set?
                if("string" == typeof propertyNames) {
                    // If the current property is not in the list bail early
                    if(-1 == propertyNames.split(' ').indexOf(e.originalEvent.propertyName)) {
                        return;
                    }
                }

                // All's good, detach the handler and run the callback
                $(domElement).unbind(event);
                callback();
            });
        });
    };
})(jQuery);