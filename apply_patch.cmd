@echo off
echo === CWApp RN CLI Patch Script ===

where npx >nul 2>nul
if %errorlevel% neq 0 (
  echo ERROR: npx is required. Install Node.js first.
  exit /b 1
)

if exist CWApp (
  echo ERROR: Directory "CWApp" already exists. Remove or rename it first.
  exit /b 1
)

echo Creating React Native CLI app "CWApp"... (using new CLI)
npx @react-native-community/cli init CWApp --pm npm

echo language support for "CWApp"
npm install @react-navigation/native @react-navigation/native-stack react-native-screens react-native-safe-area-context

echo Copying JS source files into CWApp...
xcopy src CWApp\src /E /I /Y
xcopy assets CWApp\assets /E /I /Y

echo Copying entry files...
copy /Y index.js CWApp\index.js
copy /Y App.js CWApp\App.js

echo Installing dependencies...
cd CWApp
npm install

echo.
echo === Done! ===
echo To run your Android app:
echo   cd CWApp
echo   npx react-native run-android
echo.
echo Open CWApp in Android Studio if you prefer.
