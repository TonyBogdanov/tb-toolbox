(function(e){"use strict";if("function"!=typeof e){alert("ScrollToThis requires jQuery.");return}if("function"!=typeof e.fn.scrollTo){alert("ScrollToThis requires ScrollTo.");return}if("function"!=typeof e.bez){alert("ScrollToThis requires jQuery Bez.");return}var t=e("body"),n=function(n){var r=t.attr(n);if(!isNaN(parseInt(r)))return parseInt(r);var i=e(r);if(0==i.length)return 0;if(t[0].hasAttribute(n+"-type"))switch(t.attr(n+"-type")){case"content":return i.height();case"outer":return i.outerHeight();case"margin":return i.outerHeight(!0)}return i.height()},r=function(e){for(var r=0;t[0].hasAttribute("data-scrolltothis-offset-add-"+r);r++)e+=n("data-scrolltothis-offset-add-"+r);for(r=0;t[0].hasAttribute("data-scrolltothis-offset-sub-"+r);r++)e-=n("data-scrolltothis-offset-sub-"+r);return e};e.fn.scrollToThis=function(t,n){var i=e(t);i=0<i.length?i:e(document);var s=e(this).first().offset().top;return s=0==s?0:s+r("number"==typeof n.offset?n.offset:0),n=e.extend({},{duration:1e3,interrupt:!0,easing:e.bez([.55,0,.1,1])},n),i.scrollTo(s,n.duration,{interrupt:n.interrupt,easing:n.easing})}})(jQuery);