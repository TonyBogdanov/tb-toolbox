@echo off
@cls

del /Q /F dist
mkdir dist

copy /B js\frame\frame.js dist\frame.js
copy /B js\transition-end\transition-end.js dist\transition-end.js
copy /B js\count-to\count-to.js dist\count-to.js
copy /B js\resize-it\resize-it.js dist\resize-it.js
copy /B js\scroll-direction\scroll-direction.js dist\scroll-direction.js
copy /B js\scroll-to-this\scroll-to-this.js dist\scroll-to-this.js
copy /B js\linking\linking.js dist\linking.js

cmd /c minify dist\frame.js
cmd /c minify dist\transition-end.js
cmd /c minify dist\count-to.js
cmd /c minify dist\resize-it.js
cmd /c minify dist\scroll-direction.js
cmd /c minify dist\scroll-to-this.js
cmd /c minify dist\linking.js

copy /B dist\frame.js+dist\transition-end.js+dist\count-to.js+dist\resize-it.js+dist\scroll-direction.js+dist\scroll-to-this.js+dist\linking.js dist\toolbox.js
cmd /c minify dist\toolbox.js

exit /B