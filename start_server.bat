@echo off
title FreshCheck - Local Server
echo ======================================================================
echo    FreshCheck - Community Service Project (CSP)
echo    Department of Computer Science and Engineering
echo ======================================================================
echo.
echo Starting local web server with CORS enabled on port 8000...
echo Opening FreshCheck in your default browser...
echo.
timeout /t 1 >nul
start http://localhost:8000
echo Server is running at: http://localhost:8000
echo Press Ctrl+C in this window to stop the server when done.
echo.
python cors_server.py
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Falling back to python -m http.server 8000...
    python -m http.server 8000
    if %ERRORLEVEL% NEQ 0 (
        echo Falling back to Node.js npx serve...
        npx --yes serve -p 8000 .
    )
)
pause
