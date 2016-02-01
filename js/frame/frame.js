
/**
 * @require jQuery
 *
 * Schedules a callback to be executed on requestAnimationFrame (the next frame draw).
 *
 * Use: $.frame('event-name', callback) or $.frame(['event1', 'event2'], callback) to register a callback to specific events.
 * Use: $.frame('event-name', true, callback) to register a callback to be executed only once then detached.
 * Use: $.frame(callback) to execute the callback immediately on the next frame draw.
 *
 * You can also target multiple events and an immediate execution by using a null: $.frame([null, 'event'], callback)
 */
(function($) {
    "use strict";

    if('function' != typeof $) {
        alert('Frame requires jQuery.');
        return;
    }

    (function() {
        var lastTime = 0;
        var vendors = ['ms', 'moz', 'webkit', 'o'];
        for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
            window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
            window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
        }

        if(!window.requestAnimationFrame) {
            window.requestAnimationFrame = function(callback, element) {
                var currTime = new Date().getTime();
                var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                var id = window.setTimeout(function() { callback(currTime + timeToCall); }, timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };
        }

        if(!window.cancelAnimationFrame) {
            window.cancelAnimationFrame = function (id) {
                clearTimeout(id);
            };
        }
    })();

    $.fn.frame                      = function(a, b, c) {
        return $(this).each(function() {
            // Target
            var $this               = $(this);

            // a is null and b is a function (immediate execution)
            if(null === a && 'function' == typeof b) {
                requestAnimationFrame.call(this, b);
                return true;
            }

            // a is a traversable object (array)
            if('object' == typeof a) {
                $.each(a, function() {
                    $this.frame(this, b, c);
                });
                return true;
            }

            // a is a function
            if('function' == typeof a) {
                requestAnimationFrame.call(this, a);
                return true;
            }

            // Prepare
            if('undefined' == typeof $this.data('frame-callbacks')) {
                $this.data('frame-callbacks', {});
            }
            if('undefined' == typeof $this.data('frame-locks')) {
                $this.data('frame-locks', {});
            }

            // a is a string
            if('string' == typeof a) {
                // No such event has been registered just yet
                var callbacks       = $this.data('frame-callbacks');
                if('undefined' == typeof callbacks[a]) {
                    callbacks[a]    = [];
                    (('ready' == a) ? $(document) : $this).bind(a, (function(a) {
                        return function() {
                            $.frame.dispatch($this, a);
                        };
                    })(a));
                }

                // b is a function
                if('function' == typeof b) {
                    callbacks[a].push([b, false]);
                }

                // b is boolean and c is function
                if((true === b || false === b) && 'function' == typeof c) {
                    callbacks[a].push([c, b]);
                }

                $this.data('frame-callbacks', callbacks);
            }
        });
    };

    $.frame                         = function(a, b, c) {
        return $(window).frame(a, b, c);
    };

    $.frame.dispatch                = function($target, event) {
        var locks                   = $target.data('frame-locks');
        if(locks[event]) {
            return;
        }
        locks[event]                = true;
        $target.data('frame-locks', locks);

        requestAnimationFrame(function() {
            var callbacks           = $target.data('frame-callbacks');
            if('object' == typeof callbacks[event]) {
                $.each(callbacks[event], function () {
                    this[0].call($target);
                    if(this[1]) {
                        $.frame.detach($target, event, this[0]);
                    }
                });
            }
            locks                   = $target.data('frame-locks');
            locks[event]            = false;
            $target.data('frame-locks', locks);
        });
    };

    $.frame.detach                  = function(target, event, callback) {
        var $target                 = $(target);
        var callbacks               = $target.data('frame-callbacks');
        if('undefined' == typeof callbacks || 'undefined' == typeof callbacks[event]) {
            return;
        }
        var oldArray                = callbacks[event];
        callbacks[event]            = [];
        $.each(oldArray, function(i) {
            if(this[0] != callback) {
                callbacks[event].push(this);
            }
        });
        $target.data('frame-callbacks', callbacks);
    };
})(jQuery);