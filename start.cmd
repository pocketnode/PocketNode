@echo off
title PocketNode : Minecraft Bedrock Edition Server Software
set loop=true
set /A "loops=1"

where node >nul 2>&1 && goto startScript || (
echo You require Node.js to run this program!
echo Download it from https://nodejs.org/en/ and try again!
pause>nul & exit
)

:startScript
node .\start.js
if /i "%loop%"=="true" (
    set /A "loops=loops + 1"
    echo Restarted %loops% time^(s^)
    echo To escape the loop, press CTRL+C now. Otherwise, wait 5 seconds for the server to restart.
    echo.
    ping localhost -n 5 >nul
    goto startScript
)
pause>nul & exit