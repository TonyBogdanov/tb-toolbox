(function(e){"use strict";if("function"!=typeof e){alert("TransitionEnd requires jQuery.");return}var t=function(){var e=document.createElement("div"),t={transition:"transitionend",OTransition:"oTransitionEnd",MozTransition:"transitionend",WebkitTransition:"webkitTransitionEnd"};for(var n in t)if("undefined"!=typeof e.style[n])return t[n];return null};e.fn.transitionEnd=function(n,r,i){return e(this).each(function(){var s=e(this),o="undefined"==typeof window._detectedTransitionEventName?window._detectedTransitionEventName=t():window._detectedTransitionEventName;if(null===o)return i=parseInt(i),setTimeout(n,isNaN(i)?350:i),!0;var u=s.get(0);s.unbind(o).bind(o,function(t){if(t.originalEvent.target!==u)return;if("string"==typeof r&&-1==r.split(" ").indexOf(t.originalEvent.propertyName))return;e(u).unbind(o),n()})})}})(jQuery);