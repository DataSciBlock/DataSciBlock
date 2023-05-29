#!/bin/bash
set -e

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

build_vm=true
build_gui=true

# Loop through the positional parameters
for arg in "$@"; do
    if [ "$arg" = "--vm-only" ] || [ "$arg" = "-vm" ]; then
        echo "BUILDING SCRATCH VM ONLY ..."
        build_gui=false
        break
    fi
done

if [ "$build_vm" = true ]; then
    echo "BUILDING SCRATCH VM ..."
    cd "$SCRATCH_SRC_HOME/scratch-vm"
    npm run build
fi

if [ "$build_gui" = true ]; then
    echo "BUILDING SCRATCH GUI ..."
    cd "$SCRATCH_SRC_HOME/scratch-gui"
    npm run build
fi
