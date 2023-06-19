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

build_vm=false
build_gui=false
build_blocks=false

# if no flags are passed, build both, otherwise build only what is specified
for arg in "$@"; do
    if [ "$arg" = "--vm" ] || [ "$arg" = "-vm" ]; then
        echo "BUILDING SCRATCH VM ONLY ..."
        build_vm=true
        break
    elif [ "$arg" = "--gui" ] || [ "$arg" = "-gui" ]; then
        echo "BUILDING SCRATCH GUI ONLY ..."
        build_gui=true
        break
    elif [ "$arg" = "--blocks" ] || [ "$arg" = "-blocks" ]; then
        echo "BUILDING SCRATCH BLOCKS ONLY ..."
        build_blocks=true
        break
    fi
done

# if all are false, build all
if [ "$build_vm" = false ] && [ "$build_gui" = false ] && [ "$build_blocks" = false ]; then
    echo "BUILDING ALL SCRATCH COMPONENTS ..."
    build_vm=true
    build_gui=true
    build_blocks=true
fi

if [ "$build_blocks" = true ]; then
    echo "BUILDING SCRATCH BLOCKS ..."
    cd "$SCRATCH_SRC_HOME/scratch-blocks"
    npm i
fi

if [ "$build_vm" = true ]; then
    echo "BUILDING SCRATCH VM ..."
    cd "$SCRATCH_SRC_HOME/scratch-vm"
    npm i
    npm run build
fi

if [ "$build_gui" = true ]; then
    echo "BUILDING SCRATCH GUI ..."
    cd "$SCRATCH_SRC_HOME/scratch-gui"
    npm i
    npm run build
fi
