#!/bin/sh
set -e

SCRATCH_GUI="scratch-gui"
SCRATCH_VM="scratch-vm"

if [ -d "$SCRATCH_VM" ] && [ -d "$SCRATCH_GUI" ]; then 
    echo "setting environment variable"
    export SCRATCH_SRC_HOME=$(pwd)
fi


# Loop through the positional parameters
for arg in "$@"; do
    if [ "$arg" = "--build-vm" ] || [ "$arg" = "-b" ];  then
        echo "BUILDING SCRATCH VM ..."
        cd "$SCRATCH_SRC_HOME/scratch-vm"
        npm run build
        break
    fi
done

echo "STARTING SCRATCH GUI AT http://localhost:8601"
cd "$SCRATCH_SRC_HOME/scratch-gui"
npm start
