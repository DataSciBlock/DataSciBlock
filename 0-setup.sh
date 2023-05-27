#!/bin/bash
set -e

SCRATCH_GUI="scratch-gui"
SCRATCH_VM="scratch-vm"

echo "Verifying if scratch souce is already cloned"

if [ -d "$SCRATCH_VM" ]; then
    echo "Scratch VM already cloned"
else
    echo "Scratch VM not cloned"
    echo "Cloning Scratch VM source"
    git clone --depth=1 https://github.com/LLK/scratch-vm.git
    cd scratch-vm
    npm install
    npm link
    cd ..
fi

if [ -d "$SCRATCH_GUI" ]; then
    echo "Scratch GUI already cloned"
else
    echo "Scratch GUI not cloned"
    echo "Cloning Scratch GUI source"
    git clone --depth=1 https://github.com/LLK/scratch-gui.git
    cd scratch-gui
    npm install
    npm link scratch-vm
    cd ..
fi

if [ -d "$SCRATCH_VM" ] && [ -d "$SCRATCH_GUI" ]; then 
    echo "setting environment variable"
    export SCRATCH_SRC_HOME=$(pwd)
fi

echo "Checking if Scratch source has already been customized"
if [ -e $SCRATCH_SRC_HOME/patched ]; then
    echo "Already patched"
    exit 1
fi

echo "Getting the location of this script"
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
echo $DIR

echo "Adding extension to Scratch source"
cd $SCRATCH_SRC_HOME/scratch-vm/src/extensions
ln -s $DIR/scratch3_datasci scratch3_datasci

echo "Patching Scratch source to enable extension"
cd $SCRATCH_SRC_HOME/scratch-vm
git apply $DIR/patches/scratch-vm.patch
mv package.json $DIR/dependencies/package.json
ln -s $DIR/dependencies/package.json .
mv package-lock.json $DIR/dependencies/package-lock.json
ln -s $DIR/dependencies/package-lock.json .
cd $SCRATCH_SRC_HOME/scratch-gui
git apply $DIR/patches/scratch-gui.patch

echo "Copying in the Scratch extension files"
mkdir -p src/lib/libraries/extensions/datasci
cd src/lib/libraries/extensions/datasci
ln -s $DIR/datasci.png datasci.png
ln -s $DIR/datasci-icon.svg datasci-icon.svg

echo "Marking the Scratch source as customized"
touch $SCRATCH_SRC_HOME/patched

echo "   _______  _______________  __________"
echo "  / ___/ / / / ___/ ___/ _ \/ ___/ ___/"
echo " (__  ) /_/ / /__/ /__/  __(__  |__  ) "
echo "/____/\__,_/\___/\___/\___/____/____/  "
