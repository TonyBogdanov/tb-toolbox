@echo off
@cls

del /Q /F dist

copy /B js\frame\frame.js dist\frame.js >nul 2>&1
copy /B js\transition-end\transition-end.js dist\transition-end.js >nul 2>&1
copy /B js\count-to\count-to.js dist\count-to.js >nul 2>&1
copy /B js\resize-it\resize-it.js dist\resize-it.js >nul 2>&1
copy /B js\scroll-direction\scroll-direction.js dist\scroll-direction.js >nul 2>&1
copy /B js\scroll-to-this\scroll-to-this.js dist\scroll-to-this.js >nul 2>&1
copy /B js\linking\linking.js dist\linking.js >nul 2>&1

cmd /c minify dist\frame.js >nul 2>&1
cmd /c minify dist\transition-end.js >nul 2>&1
cmd /c minify dist\count-to.js >nul 2>&1
cmd /c minify dist\resize-it.js >nul 2>&1
cmd /c minify dist\scroll-direction.js >nul 2>&1
cmd /c minify dist\scroll-to-this.js >nul 2>&1
cmd /c minify dist\linking.js >nul 2>&1

copy /B dist\frame.js+dist\transition-end.js+dist\count-to.js+dist\resize-it.js+dist\scroll-direction.js+dist\scroll-to-this.js+dist\linking.js dist\toolbox.js >nul 2>&1
cmd /c minify dist\toolbox.js >nul 2>&1

exit /B