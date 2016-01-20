@echo off
@cls

del /F /Q .\js\toolbox.js >nul 2>&1
copy /B .\js\frame\frame.js+.\js\transition-end\transition-end.js+.\js\count-to\count-to.js+.\js\resize-it\resize-it.js+.\js\scroll-direction\scroll-direction.js+.\js\scroll-to-this\scroll-to-this.js+.\js\linking\linking.js .\js\toolbox.js >nul 2>&1
minify .\js\toolbox.js