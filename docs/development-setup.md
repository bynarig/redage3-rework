# Development Setup

This guide describes the development initialization scripts under `scripts/development/` and how to run them from the project root.

## Overview

These scripts bootstrap your local development environment. Run the script that matches your OS from the project root.

## Available Scripts

| OS | Script |
| --- | --- |
| macOS (Apple Silicon) | `scripts/development/macos-arm-development-initialisation.sh` |
| Linux (x64) | `scripts/development/linux-x64-development-initialisation.sh` |
| Windows (PowerShell) | `scripts/development/windows-crossprocessor-development-initialisation.ps1` |

## Run From Project Root

### macOS (Apple Silicon)

```bash
chmod +x scripts/development/macos-arm-development-initialisation.sh
./scripts/development/macos-arm-development-initialisation.sh
```

### Linux (x64)

```bash
chmod +x scripts/development/linux-x64-development-initialisation.sh
./scripts/development/linux-x64-development-initialisation.sh
```

### Windows (PowerShell)

**Important:** Run PowerShell as **Administrator** before executing the script.

```powershell
Set-ExecutionPolicy RemoteSigned -Force
Unblock-File -Path .scripts\development\windows-crossprocessor-development-initialisation.ps1
.\scripts\development\windows-crossprocessor-development-initialisation.ps1
```

## Tips

- If you update the scripts, re-run them to apply changes.
- If you see permission errors on macOS/Linux, re-run the `chmod +x` step.
