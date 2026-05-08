#!/bin/bash

echo "Starting macOS Setup for RAGE:MP..."

# ==========================================
# 1. Install NVM, Node.js 24.15, and pnpm
# ==========================================
echo "Checking for Node Version Manager (NVM)..."

# Check if NVM directory exists, if not, install it
if [ ! -d "$HOME/.nvm" ]; then
    echo "NVM not found. Installing NVM..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash
fi

# Load NVM into the current script session so we can use it immediately
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

echo "Installing Node.js version 24.15..."
nvm install 24.15
nvm use 24.15

echo "Installing pnpm globally..."
npm install -g pnpm

echo "Node environment setup complete. Using Node $(node -v) and pnpm $(pnpm -v)."
echo "------------------------------------------"


# ==========================================
# 2. Install .NET 9 SDK
# ==========================================
echo "Checking for .NET SDK..."
if ! command -v dotnet > /dev/null 2>&1; then
    echo "dotnet not found. Installing .NET 9 SDK..."

    # Download Microsoft's official bash install script
    curl -sSL https://dot.net/v1/dotnet-install.sh -o dotnet-install.sh
    chmod +x dotnet-install.sh

    # Run the installer targeting the 9.0 release channel
    ./dotnet-install.sh --channel 9.0

    # Clean up the installer script
    rm dotnet-install.sh

    # Add .NET to the PATH for the remainder of this script
    export DOTNET_ROOT=$HOME/.dotnet
    export PATH=$PATH:$DOTNET_ROOT

    echo ".NET 9 SDK installed successfully."
else
    echo ".NET SDK is already installed."
fi
echo "------------------------------------------"


# ==========================================
# 3. Download and Setup RAGE:MP Files
# ==========================================
REPO_URL="https://github.com/efebagri/ragemp-server-files.git"
TARGET_FOLDER="to-remove"

echo "Starting repository download..."

# Check if git is installed
if ! command -v git > /dev/null 2>&1; then
    echo "Error: 'git' is not installed. Please install git (e.g., 'brew install git') and try again."
    exit 1
fi

# Clone the repository
if [ -d "$TARGET_FOLDER" ]; then
    echo "Warning: The target folder '$TARGET_FOLDER' already exists. It will be removed and re-cloned."
    rm -rf "$TARGET_FOLDER"  # Remove existing folder if it exists
fi


git clone "$REPO_URL" "$TARGET_FOLDER"

if [ $? -eq 0 ]; then
    echo "Success! The files have been downloaded into the '$TARGET_FOLDER' directory."
else
    echo "Download failed. Please check your internet connection or the repository URL."
    exit 1
fi

# Clean up repo files
rm ./$TARGET_FOLDER/README.md
rm ./$TARGET_FOLDER/.gitattributes
rm ./$TARGET_FOLDER/LICENSE
echo "Removed unnecessary files."

# Extract the tar.gz file into the target folder
tar -xzf ./$TARGET_FOLDER/linux_x64.tar.gz -C ./$TARGET_FOLDER
echo "Extracted the tar.gz file."

# Copy the extracted files
cp -R ./$TARGET_FOLDER/BugTrap-x64.dll ./
cp -R ./$TARGET_FOLDER/ragemp-srv/bin ./
cp -R ./$TARGET_FOLDER/ragemp-srv/dotnet ./
cp ./$TARGET_FOLDER/ragemp-srv/ragemp-server ./
echo "Copied the necessary files to the current directory."

rm -rf ./$TARGET_FOLDER
echo "Cleaned up the temporary files."

echo "------------------------------------------"
echo "Initialization complete!"
echo "Node: $(node -v)"
echo "pnpm: $(pnpm -v)"
echo "dotnet: $(dotnet --version)"