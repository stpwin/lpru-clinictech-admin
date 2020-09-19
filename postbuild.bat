@ECHO OFF
REM echo "Copy config.development.js"
REM xcopy "config.development.js" "src\config.js" /Y
echo "Copy .htaccess"
xcopy ".htaccess" "build\" /Y
echo "Deploy to server..."
"C:\Program Files (x86)\WinSCP\WinSCP.com" /script=winscp-script.txt