#!/bin/bash
set -e

SCRATCH_GUI="scratch-gui"
SCRATCH_VM="scratch-vm"
SCRATCH_BLOCKS="scratch-blocks"

git submodule init
git submodule update

cd scratch-blocks
npm install
npm link
cd ..

cd scratch-vm
npm install
npm link scratch-blocks
npm link
cd ..

cd scratch-gui
npm install
npm link scratch-vm scratch-blocks
cd ..


echo "   _______  _______________  __________"
echo "  / ___/ / / / ___/ ___/ _ \/ ___/ ___/"
echo " (__  ) /_/ / /__/ /__/  __(__  |__  ) "
echo "/____/\__,_/\___/\___/\___/____/____/  "
