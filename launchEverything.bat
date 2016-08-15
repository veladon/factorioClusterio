cd "Factorio 0.13.9"
@RD /S /Q "temp"
cd ..

start cmd /k node client.js
start cmd /C node master.js

cd "Factorio 0.13.9 - Copy/bin/x64"
@start factorio.exe

pause