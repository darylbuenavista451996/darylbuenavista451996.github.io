@echo off
setlocal EnableDelayedExpansion
cd /d "%~dp0"
title Make My Animation
echo.
echo ==================================================
echo    MAKE MY ANIMATION
echo ==================================================
echo.

if not exist "%~dp0rife-ncnn-vulkan.exe" (
  echo The kit is not complete: rife-ncnn-vulkan.exe is missing.
  echo Please tell your teacher.
  goto :fail
)
if not exist "%~dp0ffmpeg.exe" (
  echo The kit is not complete: ffmpeg.exe is missing.
  echo Please tell your teacher.
  goto :fail
)
if not exist "%~dp0rife-v4.6" (
  echo The kit is not complete: the folder rife-v4.6 is missing.
  echo Please tell your teacher.
  goto :fail
)
if not exist "put_your_frames_here\*.jpg" (
  echo I cannot find your pictures.
  echo Put your numbered .jpg drawings in the folder put_your_frames_here
  echo and name them 01.jpg, 02.jpg, 03.jpg, 04.jpg and so on.
  echo If this window closed by itself before, copy the whole AnimationKit
  echo folder to your Desktop first, then try again.
  goto :fail
)

set LEN=
set /p LEN=How many seconds long should your animation be? Type 3, 4 or 5 and press Enter. Just press Enter for 4: 
if "%LEN%"=="" set LEN=4
set /a LENNUM=%LEN% 2>nul
if %LENNUM% LSS 2 set LENNUM=4
if %LENNUM% GTR 8 set LENNUM=4
set /a TARGET=LENNUM*12
echo.
echo OK. Your animation will be %LENNUM% seconds long, with %TARGET% pictures.
echo.

echo Step 1 of 3: getting your pictures ready...
if exist work rmdir /s /q work
if exist work_out rmdir /s /q work_out
mkdir work
mkdir work_out
set /a COUNT=0
for %%F in ("put_your_frames_here\*.jpg") do (
  set /a COUNT+=1
  set "NUM=000!COUNT!"
  "%~dp0ffmpeg.exe" -y -loglevel error -i "%%~fF" -vf "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2:white" "work\!NUM:~-4!.png"
)
if %COUNT% LSS 2 (
  echo I found only %COUNT% picture. I need at least 2 pictures.
  goto :fail
)
echo Found %COUNT% pictures.

echo.
echo Step 2 of 3: the computer is drawing the in between pictures.
echo This is the slow step. Please wait and do not close this window...
"%~dp0rife-ncnn-vulkan.exe" -i work -o work_out -n %TARGET% -m "%~dp0rife-v4.6"
if errorlevel 1 (
  echo.
  echo The fast way did not work on this laptop. Trying the slower way...
  "%~dp0rife-ncnn-vulkan.exe" -i work -o work_out -n %TARGET% -m "%~dp0rife-v4.6" -g -1
)
dir /b "work_out\*.png" >nul 2>nul
if errorlevel 1 (
  echo Something went wrong while making the in between pictures.
  echo Please tell your teacher.
  goto :fail
)

echo.
echo Step 3 of 3: making your video...
"%~dp0ffmpeg.exe" -y -loglevel error -framerate 12 -i "work_out\%%08d.png" -c:v libx264 -pix_fmt yuv420p -crf 18 "my_animation.mp4"
if errorlevel 1 (
  echo Something went wrong while making the video.
  echo Please tell your teacher.
  goto :fail
)

rmdir /s /q work
rmdir /s /q work_out
echo.
echo ==================================================
echo    DONE. Your video is my_animation.mp4
echo ==================================================
echo.
pause
exit /b 0

:fail
echo.
pause
exit /b 1
