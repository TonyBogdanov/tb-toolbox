(function(e){"use strict";if("function"!=typeof e){alert("Frame requires jQuery.");return}(function(){var e=0,t=["ms","moz","webkit","o"];for(var n=0;n<t.length&&!window.requestAnimationFrame;++n)window.requestAnimationFrame=window[t[n]+"RequestAnimationFrame"],window.cancelAnimationFrame=window[t[n]+"CancelAnimationFrame"]||window[t[n]+"CancelRequestAnimationFrame"];window.requestAnimationFrame||(window.requestAnimationFrame=function(t,n){var r=(new Date).getTime(),i=Math.max(0,16-(r-e)),s=window.setTimeout(function(){t(r+i)},i);return e=r+i,s}),window.cancelAnimationFrame||(window.cancelAnimationFrame=function(e){clearTimeout(e)})})(),e.fn.frame=function(t,n,r){return e(this).each(function(){var i=e(this);if("object"==typeof t)return e.each(t,function(){i.frame(this,n,r)}),!0;if("function"==typeof t)return requestAnimationFrame.call(this,t),!0;"undefined"==typeof i.data("frame-callbacks")&&i.data("frame-callbacks",{}),"undefined"==typeof i.data("frame-locks")&&i.data("frame-locks",{});if("string"==typeof t){var s=i.data("frame-callbacks");"undefined"==typeof s[t]&&(s[t]=[],("ready"==t?e(document):i).bind(t,function(t){return function(){e.frame.dispatch(i,t)}}(t))),"function"==typeof n&&s[t].push([n,!1]),(!0===n||!1===n)&&"function"==typeof r&&s[t].push([r,n]),i.data("frame-callbacks",s)}})},e.frame=function(t,n,r){return e(window).frame(t,n,r)},e.frame.dispatch=function(t,n){var r=t.data("frame-locks");if(r[n])return;r[n]=!0,t.data("frame-locks",r),requestAnimationFrame(function(){var i=t.data("frame-callbacks");"object"==typeof i[n]&&e.each(i[n],function(){this[0].call(t),this[1]&&e.frame.detach(t,n,this[0])}),r=t.data("frame-locks"),r[n]=!1,t.data("frame-locks",r)})},e.frame.detach=function(t,n,r){var i=e(t),s=i.data("frame-callbacks");if("undefined"==typeof s||"undefined"==typeof s[n])return;var o=s[n];s[n]=[],e.each(o,function(e){this[0]!=r&&s[n].push(this)}),i.data("frame-callbacks",s)}})(jQuery);