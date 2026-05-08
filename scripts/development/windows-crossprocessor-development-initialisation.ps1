# Requires Run as Administrator
if (-Not ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Warning "Please run this script as an Administrator."
    Exit
}

Write-Host "Starting Universal Windows Setup for RAGE:MP..." -ForegroundColor Cyan

# ==========================================
# 0. Detect System Architecture
# ==========================================
$sysArch = $env:PROCESSOR_ARCHITECTURE
Write-Host "Detected System Architecture: $sysArch" -ForegroundColor Yellow

$DotNetArch = "x64" # Default
if ($sysArch -match "ARM64") { $DotNetArch = "arm64" }
elseif ($sysArch -match "x86") { $DotNetArch = "x86" }

# ==========================================
# 1. Install NVM, Node.js 24.15, and pnpm
# ==========================================
Write-Host "Checking for Node Version Manager (nvm-windows)..." -ForegroundColor Cyan

if (-not (Get-Command "nvm" -ErrorAction SilentlyContinue)) {
    Write-Host "NVM not found. Downloading and installing nvm-windows..."
    $nvmUrl = "https://github.com/coreybutler/nvm-windows/releases/latest/download/nvm-setup.exe"
    $nvmInstaller = "$env:TEMP\nvm-setup.exe"

    Invoke-WebRequest -Uri $nvmUrl -OutFile $nvmInstaller
    Write-Host "Running NVM installer silently..."
    Start-Process -FilePath $nvmInstaller -ArgumentList "/VERYSILENT" -Wait

    foreach($level in "Machine","User") {
        [Environment]::GetEnvironmentVariables($level).GetEnumerator() | % { [Environment]::SetEnvironmentVariable($_.Name, $_.Value) }
    }
}

Write-Host "Installing Node.js version 24.15..."
nvm install 24.15
nvm use 24.15
npm install -g pnpm

Write-Host "------------------------------------------"

# ==========================================
# 2. Install .NET 9 SDK
# ==========================================
Write-Host "Checking for .NET SDK..." -ForegroundColor Cyan

$dotnetPath = "$env:LOCALAPPDATA\Microsoft\dotnet"

# Встановлюємо змінну DOTNET_ROOT для поточної сесії
$env:DOTNET_ROOT = $dotnetPath

if (-not (Get-Command "dotnet" -ErrorAction SilentlyContinue) -and -not (Test-Path "$dotnetPath\dotnet.exe")) {
    Write-Host "dotnet not found. Installing .NET 9 SDK for $DotNetArch..."
    Invoke-WebRequest -Uri "https://dot.net/v1/dotnet-install.ps1" -OutFile "dotnet-install.ps1"
    .\dotnet-install.ps1 -Channel 9.0 -Architecture $DotNetArch
    Remove-Item "dotnet-install.ps1" -Force
} else {
    Write-Host ".NET SDK is already installed."
}

# Примусово додаємо .NET до PATH для поточної сесії
$env:PATH += ";$dotnetPath"

# ЗБЕРІГАЄМО DOTNET_ROOT НАЗАВЖДИ ДЛЯ КОРИСТУВАЧА, щоб воно працювало після перезапуску ПК
[Environment]::SetEnvironmentVariable("DOTNET_ROOT", $dotnetPath, "User")

Write-Host "------------------------------------------"

# ==========================================
# 3. Install Git (If missing)
# ==========================================
Write-Host "Checking for Git..." -ForegroundColor Cyan

$gitDefaultPath = "C:\Program Files\Git\cmd"
if (-not (Get-Command "git" -ErrorAction SilentlyContinue)) {
    if (Test-Path "$gitDefaultPath\git.exe") {
        $env:PATH += ";$gitDefaultPath"
    } else {
        Write-Host "Git not found. Installing via winget..." -ForegroundColor Yellow
        winget install --id Git.Git -e --source winget --silent --accept-package-agreements --accept-source-agreements

        foreach($level in "Machine","User") {
            [Environment]::GetEnvironmentVariables($level).GetEnumerator() | % { [Environment]::SetEnvironmentVariable($_.Name, $_.Value) }
        }
        if (Test-Path "$gitDefaultPath\git.exe") { $env:PATH += ";$gitDefaultPath" }
    }
}
Write-Host "------------------------------------------"

# ==========================================
# 4. Download and Setup RAGE:MP Files
# ==========================================
$REPO_URL = "https://github.com/efebagri/ragemp-server-files.git"
$TARGET_FOLDER = "to-remove"

Write-Host "Starting repository download..." -ForegroundColor Cyan

if (Test-Path $TARGET_FOLDER) { Remove-Item -Path $TARGET_FOLDER -Recurse -Force }

git clone $REPO_URL $TARGET_FOLDER
if ($LASTEXITCODE -ne 0) { Write-Host "Download failed." -ForegroundColor Red; Exit }

# Clean up
Remove-Item -Path ".\$TARGET_FOLDER\README.md" -ErrorAction SilentlyContinue
Remove-Item -Path ".\$TARGET_FOLDER\.gitattributes" -ErrorAction SilentlyContinue
Remove-Item -Path ".\$TARGET_FOLDER\LICENSE" -ErrorAction SilentlyContinue

# ==========================================
# 5. Extract Files
# ==========================================
Write-Host "Extracting the archive..."

# Copy files
Copy-Item -Path ".\$TARGET_FOLDER\BugTrap-x64.dll" -Destination ".\" -Force
Copy-Item -Path ".\$TARGET_FOLDER\bin" -Destination ".\" -Recurse -Force
Copy-Item -Path ".\$TARGET_FOLDER\dotnet" -Destination ".\" -Recurse -Force
Copy-Item -Path ".\$TARGET_FOLDER\ragemp-server.exe" -Destination ".\" -Force

Remove-Item -Path $TARGET_FOLDER -Recurse -Force

Write-Host "------------------------------------------"
Write-Host "Initialization complete!" -ForegroundColor Green

# Final Output (Using explicit paths if command is missing from current session)
node -v
pnpm -v

if (Get-Command "dotnet" -ErrorAction SilentlyContinue) {
    dotnet --version
} else {
    & "$dotnetPath\dotnet.exe" --version
}

git --version