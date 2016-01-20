/**
 * @require jQuery, Frame
 *
 * Responsively resizes an element and keeps it in sync.
 * An element can be resized relative to any other element or the window (default).
 *
 * You can even chain it, element 1 can be resized based on the window, element 2 can be resized based on element 1
 * and so on, as long as you don't create a recursion.
 *
 * Syntax: $(elements).resizeIt({type: 'width', target: window, sizing: 'content', add: [100, '#test'], sub: ['150']});
 *
 * In the above example, all $(elements) will be resized once the DOM is ready and on any following "resize" or
 * "resize-it" event on the elements resolved by the "target" option.
 *
 * The "type" option can be one of: width, min-width, max-width, height, min-height or max-height.
 *
 * The "target" option can be a DOM element, jQuery element set or a valid CSS3 selector. If the target isn't specified,
 * the window is used as default.
 *
 * The "sizing" option can be one of "content", "outer" or "margin" to make the script use respectively width(),
 * outerWidth() or outerWidth(true) on the target element.
 *
 * The "add" and "sub" options (also optional) must be arrays containing rules which determine what value is to be
 * respectively added or subtracted from the final result. The values can be valid integers, strings parseable to
 * valid integers or valid CSS3 selectors, in which case the corresponding value (width or height) of the resolved
 * element will be used. If more than one element is resolved, the value will be a summation.
 *
 * You can also auto-spawn the plugin by only using HTML attributes, in which case the above example will look like this:
 * data-resizeit-width="window"
 * data-resizeit-width-sizing="content"
 * data-resizeit-width-add-0="100"
 * data-resizeit-width-add-1="#test"
 * data-resizeit-width-sub-0="150"
 */
(function($) {
    "use strict";

    if('function' != typeof $) {
        alert('ResizeIt requires jQuery.');
        return;
    }
    if('function' != typeof $.frame) {
        alert('ResizeIt requires Frame.');
        return;
    }

    $.resizeIt              = {
        resolveTarget:      function(target) {
            switch(true) {
                case 0 == target.length:
                case 'window' == target:
                    return $(window);
                case 'document' == target:
                    return $(document);
                default:
                    var $target = $(target);
                    return 0 == $target.length ? false : $target;
            }
        },
        resolveOffset:      function(offset, type) {
            switch(true) {
                case !isNaN(parseInt(offset)):
                    return parseInt(offset);
                case 0 < $(offset).length:
                    var size            = 0;
                    $(offset).each(function() {
                        size            += 'width' == type ? $(this).width() : $(this).height();
                    });
                    return size;
                default:
                    return 0;
            }
        },
        resolveSize:        function($target, type, sizing, adds, subs) {
            var baseType    = type.replace(/^m(ax|in)\-/i, '');
            var size        = 0;
            switch(true) {
                case 'width' == baseType && 'content' == sizing:
                    size    = $target.width();
                    break;
                case 'width' == baseType && 'outer' == sizing:
                    size    = $target.outerWidth();
                    break;
                case 'width' == baseType && 'margin' == sizing:
                    size    = $target.outerWidth(true);
                    break;
                case 'height' == baseType && 'content' == sizing:
                    size    = $target.height();
                    break;
                case 'height' == baseType && 'outer' == sizing:
                    size    = $target.outerHeight();
                    break;
                case 'height' == baseType && 'margin' == sizing:
                    size    = $target.outerHeight(true);
                    break;
            }
            $.each(adds, function() {
                size        += $.resizeIt.resolveOffset(this, type);
            });
            $.each(subs, function() {
                size        -= $.resizeIt.resolveOffset(this, type);
            });
            return size;
        }
    };

    $.fn.resizeIt           = function(options) {
        return $(this).each(function() {
            var $target     = $.resizeIt.resolveTarget('undefined' == typeof options.target ? window : options.target);
            if(false === $target) {
                return true;
            }

            var $this       = $(this);
            var registered  = 'undefined' != typeof $target.data('resizeit');

            if(!registered) {
                $target.data('resizeit', {});
            }

            var callbacks   = $target.data('resizeit');
            if('undefined' == typeof callbacks[options.type]) {
                callbacks[options.type] = [];
            }

            callbacks[options.type].push([this, 'undefined' == typeof options.sizing ? 'content' : options.sizing,
                'undefined' == typeof options.add ? [] : options.add, 'undefined' == typeof options.sub ? [] : options.sub]);
            $target.data('resizeit', callbacks);

            if(!registered) {
                $target.frame(['ready', 'resize', 'resize-it'], function() {
                    var callbacks   = $target.data('resizeit');
                    $.each(callbacks, function(type) {
                        $.each(callbacks[type], function() {
                            $(this[0]).css(type, $.resizeIt.resolveSize($target, type, this[1], this[2], this[3])).trigger('resize-it');
                        });
                    });
                });
            }
        });
    };

    $(function() {
        $.each(['width', 'height', 'min-width', 'min-height', 'max-width', 'max-height'], function() {
            var resizeType  = this;
            $('[data-resizeit-' + resizeType + ']').each(function() {
                var $this   = $(this);
                var ops     = {
                    type:   resizeType,
                    target: $this.attr('data-resizeit-' + resizeType),
                    sizing: this.hasAttribute('data-resizeit-' + resizeType + '-sizing') ?
                        $this.attr('data-resizeit-' + resizeType + '-sizing') : 'content',
                    add:    [],
                    sub:    []
                };
                for(var i = 0; this.hasAttribute('data-resizeit-' + resizeType + '-add-' + i); i++) {
                    ops.add.push($this.attr('data-resizeit-' + resizeType + '-add-' + i));
                }
                for(i = 0; this.hasAttribute('data-resizeit-' + resizeType + '-sub-' + i); i++) {
                    ops.sub.push($this.attr('data-resizeit-' + resizeType + '-sub-' + i));
                }
                $this.resizeIt(ops);
            });
        });
    });
})(jQuery);