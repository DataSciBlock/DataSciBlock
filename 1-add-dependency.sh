#!/bin/bash
set -e

MODULE=$1

SCRATCH_GUI="scratch-gui"
SCRATCH_VM="scratch-vm"

if [ -d "$SCRATCH_VM" ] && [ -d "$SCRATCH_GUI" ]; then 
    echo "setting environment variable"
    export SCRATCH_SRC_HOME=$(pwd)
fi

echo "Verifying location of Scratch source is known"
if [ -z "$SCRATCH_SRC_HOME" ]; then
    echo "Error: SCRATCH_SRC_HOME environment variable is not set."
    exit 1
fi


echo "Adding new dependency"
cd $SCRATCH_SRC_HOME/scratch-vm
npm install --save $MODULE

