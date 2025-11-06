@echo off
setlocal ENABLEDELAYEDEXPANSION

:: Git secret cleanup helper for Windows
:: - Untrack backend/.env and frontend/.env
:: - Ensure .gitignore ignores **/.env
:: - Prompt you to rotate Stripe secret (manual)
:: - Optionally rewrite history using an orphan branch and force-push main
::   WARNING: Orphan rewrite DESTROYS existing history.

cd /d "%~dp0"

if not exist ".git" (
  echo [ERROR] This script must be run at the repository root where the .git folder exists.
  echo         Current dir: %cd%
  pause
  exit /b 1
)

where git >nul 2>&1
if errorlevel 1 (
  echo [ERROR] Git is not installed or not in PATH. Please install Git for Windows and retry.
  pause
  exit /b 1
)

echo.
echo === Step 1/4: Ensure .gitignore ignores **/.env ===
set "GITIGNORE=.gitignore"
if not exist "%GITIGNORE%" (
  echo Creating .gitignore
  type nul > "%GITIGNORE%"
)
findstr /C:"**/.env" "%GITIGNORE%" >nul 2>&1 || echo **/.env>>"%GITIGNORE%"

:: optional: ensure common ignore entries are present (idempotent)
findstr /C:"backend/vendor/" "%GITIGNORE%" >nul 2>&1 || echo backend/vendor/>>"%GITIGNORE%"
findstr /C:"frontend/node_modules/" "%GITIGNORE%" >nul 2>&1 || echo frontend/node_modules/>>"%GITIGNORE%"
findstr /C:"backend/storage/" "%GITIGNORE%" >nul 2>&1 || echo backend/storage/>>"%GITIGNORE%"
findstr /C:"frontend/dist/" "%GITIGNORE%" >nul 2>&1 || echo frontend/dist/>>"%GITIGNORE%"
findstr /C:"backend/public/storage/" "%GITIGNORE%" >nul 2>&1 || echo backend/public/storage/>>"%GITIGNORE%"

echo.
echo === Step 2/4: Untrack .env files if they are tracked ===
call :untrack_if_tracked "backend/.env"
call :untrack_if_tracked "frontend/.env"

:: commit ignore changes and untracking (if any)
git add .gitignore >nul 2>&1
git commit -m "chore(security): untrack .env and enforce ignore" >nul 2>&1

echo.
echo === Step 3/4: Rotate your Stripe Secret Key (sk_test...) ===
echo Open Stripe Dashboard ^> Developers ^> API keys ^> Regenerate Test Secret Key.
echo Update backend/.env locally and on your hosting later.
echo Press any key to continue once you have rotated the key...
pause >nul

echo.
echo === Step 4/4: Rewrite Git history (optional) ===
echo This will create a CLEAN orphan branch and FORCE-PUSH main, destroying previous history.
set choice=
set /p choice="Rewrite history now? [Y/N]: "
if /I "%choice%"=="Y" goto rewrite_history
echo.
echo Skipping history rewrite. Recommended next step: use BFG Repo-Cleaner or git filter-repo to scrub old commits.
echo https://rtyley.github.io/bfg-repo-cleaner/
echo.
goto done

:rewrite_history
echo Creating orphan branch 'clean-main'...
git checkout --orphan clean-main || goto fail
git reset
git add -A
git commit -m "fresh history: secrets removed" || goto fail

echo Deleting old 'main' branch if it exists...
git show-ref --verify --quiet refs/heads/main && git branch -D main
git branch -m main

echo Checking for 'origin' remote...
git remote | findstr /I "^origin$" >nul
if errorlevel 1 (
  echo [WARN] No 'origin' remote configured. Add and push manually:
  echo        git remote add origin https://github.com/<user>/<repo>.git
  echo        git push -f origin main
  goto done
)

echo Force pushing to origin/main...
git push -f origin main || goto fail
echo Force push completed.

goto done

:untrack_if_tracked
set "_file=%~1"
git ls-files --error-unmatch "%_file%" >nul 2>&1
if %errorlevel%==0 (
  echo Untracking %_file% ...
  git rm --cached "%_file%" || echo [WARN] Could not untrack %_file%
) else (
  if exist "%_file%" echo Found %_file% (ignored by .gitignore)
)
goto :eof

:fail
echo.
echo [ERROR] An error occurred. Please check the output above and resolve issues.
pause
exit /b 1

:done
echo.
echo All done.
echo - Verify on GitHub: Security ^> Secret scanning alerts.
echo - If you skipped rewrite, run BFG later to scrub history.
pause
exit /b 0
