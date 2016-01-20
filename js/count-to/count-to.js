/**
 * @require jQuery, Frame
 *
 * Counts from and to a specific number updating certain element properties on each count based on the progress.
 * Great for counting up to a number or event animating CSS or other properties.
 * Uses requestAnimationFrame and only runs on a draw-animation-frame event.
 * Speed and accuracy only depend on the CPU / Browser performance.
 *
 * Usage: $(element).countTo({
 *  from: 0,
 *  to: 0,
 *  duration: 1000,
 *  easing: "linear",
 *  format: {
 *      decimals: 0,
 *      trimZeroes: true,
 *      point: {
 *          decimals: '.',
 *          thousands: ','
 *      }
 *  },
 *  mutator: 'html',
 *  trigger: 'immediate'
 * });
 *
 * From is a starting value.
 * To is the target value.
 * Duration is the animation duration in milliseconds.
 * Format: Decimals is the number of numbers after the decimal point to render.
 * Format: TrimZeros defines whether leading or end zeroes must be removed.
 * Format: Point: Decimals defines the decimals point separator.
 * Format: Point: Thousands defines the thousands point separator.
 * Mutator defines the callback to use for modifying the value, can be a function or "text" (default is "html").
 * Trigger defines the even that triggers the counting animation. An option is to supply an integer, this would be
 * shorthand for {type: "immediate", delay: number}. Animation starts immediately with a delay in ms. Another option
 * is "viewport", shorthand for {type: "viewport"}. Animation starts once the element or part of it is in the viewport.
 * You can also specify what percentage of the element should be visible before the animation starts with
 * {type: "viewport", visible: 0.5}. The viewport option only works vertically. Default is "immediate" shorthand for
 * {type: "immediate"}. Animation starts immediately.
 *
 * All options can also be specified using HTML attributes, e.g. {format: {point: {decimals: '.'}}} would be
 * data-count-format-point-decimals=",".
 */
(function($) {
    "use strict";

    if('function' != typeof $) {
        alert('CountTo requires jQuery.');
        return;
    }
    if('function' != typeof $.frame) {
        alert('CountTo requires Frame.');
        return;
    }

    $.countTo                   = {
        // Resolves a setting with a name of the type "data-count-option" and merges it with the specified options object.
        // Returns the merged options object.
        resolveOption:          function(options, name, value) {
            var trail           = name.split('-');
            if('data' != trail[0] || 'count' != trail[1]) {
                return {};
            }
            trail.shift();
            trail.shift();
            var merge           = value;
            var tmp;
            $.each(trail.reverse(), function() {
                tmp             = merge;
                merge           = {};
                merge[this]     = tmp;
            });
            return $.extend({}, options, merge);
        },

        // Resolves easing name based on the specified value.
        // You can pass a string name for a valid supported easing like "linear" or "swing".
        // You can also pass non-standard easing names if you have previously included a 3rd party library.
        // If the $.bez plugin has been included you can also use an array or a string with 4 numbers for a cubic-bezier easing.
        // If for some reason it's not possible to resolve the easing, "linear" is used as default.
        resolveEasing:          function(value) {
            if('string' == typeof value) {
                if('undefined' != typeof jQuery.easing[value]) {
                    return jQuery.easing[value];
                }
                var split       = value.split(/[^0-9\.]+/);
                if(
                    'string' == typeof split[0] &&
                    'string' == typeof split[1] &&
                    'string' == typeof split[2] &&
                    'string' == typeof split[3] &&
                    !isNaN(parseFloat(split[0])) &&
                    !isNaN(parseFloat(split[1])) &&
                    !isNaN(parseFloat(split[2])) &&
                    !isNaN(parseFloat(split[3]))
                ) {
                    return $.countTo.resolveEasing([parseFloat(split[0]), parseFloat(split[1]), parseFloat(split[2]), parseFloat(split[3])]);
                }
            }
            if(
                'object' == typeof value &&
                'number' == typeof value[0] &&
                'number' == typeof value[1] &&
                'number' == typeof value[2] &&
                'number' == typeof value[3] &&
                'undefined' != $.bez
            ) {
                return jQuery.easing[$.bez(value)];
            }
            return jQuery.easing['linear'];
        },

        // Resolves a count-to animation trigger.
        // An option is to supply an integer, this would be shorthand for {type: "immediate", delay: number}. Animation starts immediately with a delay in ms.
        // Another option is "viewport", shorthand for {type: "viewport"}. Animation starts once the element or part of it is in the viewport.
        // You can also specify what percentage of the element should be visible before the animation starts with {type: "viewport", visible: 0.5}.
        // The viewport option only works vertically.
        // Default is "immediate" shorthand for {type: "immediate"}. Animation starts immediately.
        resolveTrigger:         function(value, elements) {
            if('string' == typeof value) {
                return $.countTo.resolveTrigger({type: value});
            }
            if('object' == typeof value && 'string' == typeof value['type']) {
                switch(value['type']) {
                    case 'immediate':
                        if('undefined' != typeof value['delay'] && !isNaN(parseInt(value['delay'])) && isFinite(parseInt(value['delay']))) {
                            return (function(delay) {
                                return function(callback) {
                                    setTimeout(callback, delay);
                                };
                            })(parseInt(value['delay']));
                        } else {
                            return function(callback) {
                                callback();
                            };
                        }
                    case 'viewport':
                        return (function(visible, delay) {
                            return function(callback) {
                                $.each(elements, function() {
                                    var $this           = $(this);
                                    var refresh         = function() {
                                        var $viewport   = $(window);
                                        var a1          = $viewport.scrollTop();
                                        var a2          = a1 + $viewport.height();
                                        var b1          = $this.offset().top;
                                        var b2          = b1 + $this.height();
                                        var overlap     = Math.max(0, Math.min(1, (Math.min(a2, b2) - Math.max(a1, b1)) / Math.min(a2 - a1, b2 - b1)));
                                        if(overlap >= visible) {
                                            $.frame.detach(window, 'scroll', refresh);
                                            if(0 == delay) {
                                                callback();
                                            } else {
                                                setTimeout(callback, delay);
                                            }
                                        }
                                    };
                                    $.frame('scroll', refresh);
                                });
                            };
                        })(
                            'undefined' != typeof value['visible'] && !isNaN(parseFloat(value['visible'])) && isFinite(parseFloat(value['visible'])) ? Math.max(0, Math.min(1, parseFloat(value['visible']))) : 0.00001,
                            'undefined' != typeof value['delay'] && !isNaN(parseInt(value['delay'])) && isFinite(parseInt(value['delay'])) ? parseInt(value['delay']) : 0
                        );
                }
            }
            return $.countTo.resolveTrigger({type: 'immediate'});
        },

        // Resolves the formatter used to filter the final value.
        // This can either be a custom function or an object of options for the default number formatter (see defaults).
        resolveFormatter:       function(value) {
            if('function' == typeof value) {
                return value;
            }
            var options         = $.extend({}, $.countTo.defaults.format);
            if('object' == typeof value) {
                if('number' == typeof value['decimals'] || ('string' == typeof value['decimals'] && !isNaN(parseInt(value['decimals'])) && isFinite(parseInt(value['decimals'])))) {
                    options.decimals        = Math.abs(parseInt(value['decimals']));
                }
                if('boolean' == typeof value['trimZeroes']) {
                    options.trimZeroes      = value['trimZeroes'];
                }
                if('string' == typeof value['trimZeroes'] && ('true' == value['trimZeroes'] || 'false' == value['trimZeroes'])) {
                    options.trimZeroes      = 'true' == value['trimZeroes'];
                }
                if('object' == typeof value['point']) {
                    if('string' == typeof value['point']['decimals']) {
                        options.point.decimals  = value['point']['decimals'];
                    }
                    if('string' == typeof value['point']['thousands']) {
                        options.point.thousands = value['point']['thousands'];
                    }
                }
            }
            return (function(options) {
                return function(value) {
                    value       = (value + '').replace(/[^0-9+\-Ee.]/g, '');
                    var n       = !isFinite(+value) ? 0 : +value,
                        s       = '',
                        toFixed = function(n, prec) {
                            var k   = Math.pow(10, prec);
                            return '' + (Math.round(n * k) / k).toFixed(prec);
                        };

                    s           = (options.decimals ? toFixed(n, options.decimals) : '' + Math.round(n)).split('.');

                    if(s[0].length > 3) {
                        s[0]    = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, options.point.thousands);
                    }
                    if((s[1] || '').length < options.decimals) {
                        s[1]    = s[1] || '';
                        s[1]    += new Array(options.decimals - s[1].length + 1).join('0');
                    }

                    if(options.trimZeroes) {
                        s[0]    = '0' == s[0] ? '0' : s[0].replace(/^0+/, '');
                        if('undefined' != typeof s[1]) {
                            s[1] = '0' == s[1] ? '0' : s[1].replace(/0+$/, '');
                        }
                    }

                    return s.join(options.point.decimals);
                };
            })(options);
        },

        // Attempts to resolve a mutator to be used to modify the animated value of a set of elements.
        // This can be a custom function to which will be passed the animated set of elements and the resulting value.
        // This can also be set to the name of a supported default mutator:
        // "html" - uses $.fn.html()
        // "text" - uses $.fn.text()
        resolveMutator:         function(value) {
            if('function' == typeof value) {
                return value;
            }
            if('string' == typeof value) {
                switch(value) {
                    case 'text':
                        return function(elements, value) {
                            return $(elements).each(function() {
                                $(this).text(value);
                            });
                        };
                }
            }
            return function(elements, value) {
                return $(elements).each(function() {
                    $(this).html(value);
                });
            };
        },

        // Animates using requestAnimationFrame and calls callback on each tick.
        // A simple alternative to jQuery .animate() which does not support requestAnimationFrame yet.
        animate:                function(duration, callback, time, stop) {
            if(true === stop) {
                return;
            }
            if('undefined' == typeof time) {
                time            = new Date().getTime();
            }
            var current         = new Date().getTime();
            var progress        = (current - time) / duration;
            if(progress >= 1) {
                progress        = 1;
                stop            = true;
            }
            callback.call(progress);
            $.frame(function() {
                $.countTo.animate(duration, callback, time, stop);
            });
        },

        // Default plugins options.
        defaults:               {
            from:               0,
            duration:           1000,
            easing:             "linear",
            format:             {
                decimals:       0,
                trimZeroes:     true,
                point:          {
                    decimals:   '',
                    thousands:  ''
                }
            },
            mutator:            'html',
            trigger:            'immediate'
        }
    };

    // Init the plugin for a set of elements.
    $.fn.countTo                = function(options) {
        // Merge with default options
        options                 = $.extend({}, $.countTo.defaults, options);

        // Filter options
        options.from            = parseFloat(options.from);
        options.to              = parseFloat(options.to);
        options.duration        = parseInt(options.duration);

        // Animated elements
        var elements            = this;

        // Resolve easing
        var easing              = $.countTo.resolveEasing(options.easing);

        // Resolve formatter
        var formatter           = $.countTo.resolveFormatter(options.format);

        // Resolve mutator
        var mutator             = $.countTo.resolveMutator(options.mutator);

        // Resolve trigger
        var trigger             = $.countTo.resolveTrigger(options.trigger, elements);

        // Trigger the animator
        trigger((function(options, elements) {
            return function() {
                $.countTo.animate(options.duration, function() {
                    mutator(elements, formatter(easing(this, this, 0, 1, 1) * (options.to - options.from) + options.from));
                });
            };
        })(options, elements));
    };

    // Auto-apply countTo to elements with data-count-to attribute. Parse options from attributes.
    $.frame('ready', function() {
        $('[data-count-to]').each(function() {
            var options         = {};
            $.each(this.attributes, function() {
                var trail       = this.name.split("-");
                var subTree     = this.value;
                for(var i = trail.length - 1; i >= 0; i--) {
                    var val     = subTree;
                    subTree     = {};
                    subTree[trail[i]] = val;
                }
                options         = $.extend(true, {}, options, subTree);
            });
            $(this).countTo('undefined' == typeof options['data'] || 'undefined' == typeof options['data']['count'] ? {} : options['data']['count']);
        });
    });
})(jQuery);