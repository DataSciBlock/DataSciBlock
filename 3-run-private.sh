#!/bin/sh
set -e

SCRATCH_GUI="scratch-gui"
SCRATCH_VM="scratch-vm"
SCRATCH_BLOCKS="scratch-blocks"

if [ -d "$SCRATCH_VM" ] && [ -d "$SCRATCH_GUI" ]; then 
    echo "setting environment variable"
    export SCRATCH_SRC_HOME=$(pwd)
fi


# Loop through the positional parameters
for arg in "$@"; do
    if [ "$arg" = "--build-vm" ] || [ "$arg" = "-b" ];  then
        echo "BUILDING SCRATCH VM ..."
        cd "$SCRATCH_SRC_HOME/scratch-vm"
        npm link 
        npm run build
        break
    fi

    if [ "$arg" = "--build-gui" ] || [ "$arg" = "-g" ];  then
        echo "BUILDING SCRATCH GUI ..."
        cd "$SCRATCH_SRC_HOME/scratch-gui"
        npm run build
        break
    fi

    if [ "$arg" = "--build-blocks" ] || [ "$arg" = "-bl" ];  then
        echo "BUILDING SCRATCH BLOCKS ..."
        cd "$SCRATCH_SRC_HOME/scratch-blocks"
        npm link
        npm run prepublish
        break
    fi
    
done

echo "STARTING SCRATCH GUI AT http://localhost:8601"
cd "$SCRATCH_SRC_HOME/scratch-gui"
npm link scratch-vm scratch-blocks
npm start
