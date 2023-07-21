# Development environment scratch datasci

this phase the product is provided as a scratch extension. After installing the extension, the user can use the blocks in the extension to access the data science functions.

## Project structure

`vm` holds the extension code in `src/extensions/scratch3_datasci` which contains all the main extension code

## Pre-requisites
- [nodejs](https://nodejs.org/en/download/ "nodejs")
- [npm](https://www.npmjs.com/get-npm "npm")
- [python2](https://www.python.org/downloads/ "python2")

## Development


### environment setup

run `./0-setup.sh` to setup the environment

### building and running
run `./2-build.sh` to build the extension
run `./3-run-private.sh` to run the extension

### TODO
#### better ux for uploading data

- [ ] add blocks like this to select data and upload in a dropdown

    DataSciBlock/scratch-blocks/core/field_matrix.js
    scratch-blocks/blocks_vertical/extensions.js
    ```js
    Blockly.Blocks['extension_datasci_display'] = {
    /**
     * @this Blockly.Block
    */
    init: function() {
        this.jsonInit({
        "message0": "%1 %2 play note %3 for %4 beats",
        "args0": [
            {
                "type": "field_image",
                "src": Blockly.mainWorkspace.options.pathToMedia + "extensions/music-block-icon.svg",
                "width": 40,
                "height": 40
            },
            {
                "type": "field_vertical_separator"
            },
            {
                "type": "input_value",
                "name": "NOTE"
            },
            {
                "type": "input_value",
                "name": "BEATS"
            }
        ],
        "category": Blockly.Categories.pen,
        "extensions": ["colours_pen", "shape_statement", "scratch_extension"]
        });
    }
    ```

- [ ] render graph better

    ./scratch-blocks/vertical_extensions/datasci/datasci.js