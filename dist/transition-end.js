(function(e){"use strict";if("function"!=typeof e){alert("TransitionEnd requires jQuery.");return}var t=function(){var e=document.createElement("div"),t={transition:"transitionend",OTransition:"oTransitionEnd",MozTransition:"transitionend",WebkitTransition:"webkitTransitionEnd"};for(var n in t)if("undefined"!=typeof e.style[n])return t[n];return null},n=function(){var e=document.createElement("div"),t={transition:"animationend",OTransition:"oAnimationEnd",MozTransition:"animationend",WebkitTransition:"webkitAnimationEnd"};for(var n in t)if("undefined"!=typeof e.style[n])return t[n];return null};e.fn.transitionEnd=function(r,i,s,o){return e(this).each(function(){var u=e(this),a=o?"undefined"==typeof window._detectedTransitionEventName?window._detectedTransitionEventName=t():window._detectedTransitionEventName:"undefined"==typeof window._detectedAnimationEventName?window._detectedAnimationEventName=n():window._detectedAnimationEventName;if(null===a)return s=parseInt(s),setTimeout(r,isNaN(s)?350:s),!0;var f=u.get(0);u.unbind(a).bind(a,function(t){if(t.originalEvent.target!==f)return;if("string"==typeof i&&-1==i.split(" ").indexOf(t.originalEvent.propertyName))return;e(f).unbind(a),r()})})},e.fn.animationEnd=function(t,n,r){return e(this).transitionEnd(t,n,r,!0)}})(jQuery);