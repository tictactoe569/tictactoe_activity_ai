@echo off
setlocal

:: Ensure exactly one argument is passed
if "%~1"=="" (
    echo Usage: %~nx0 [ON^|OFF]
    exit /b 1
)

set "ARG=%~1"

:: Remove existing .github folder
if exist ".github" (
    echo Removing existing .github directory...
    rmdir /s /q ".github"
)

:: Create empty .github directory
mkdir ".github" >nul 2>&1

:: Check argument and perform extraction
if /I "%ARG%"=="ON" (
    echo Enabling: extracting .__tools__\enabled.zip to .github
    powershell -Command "Expand-Archive -Path '.__tools__\enabled.zip' -DestinationPath '.__tools__\_tmp_enabled' -Force; Copy-Item -Path '.__tools__\_tmp_enabled\enabled\*' -Destination '.github\' -Recurse -Force; Remove-Item -Path '.__tools__\_tmp_enabled' -Recurse -Force"
) else if /I "%ARG%"=="OFF" (
    echo Disabling: pipeline OFF — .github is now empty
    REM .github already exists (created above), leave it empty
) else (
    echo Invalid argument. Please use 'ON' or 'OFF'.
    exit /b 1
)

git add .github/
git commit -m "chore: pipeline %ARG%"

echo Operation complete.
endlocal
