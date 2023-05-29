const BlockType = require("../../extension-support/block-type");
const ArgumentType = require("../../extension-support/argument-type");
const TargetType = require("../../extension-support/target-type");
const DataFrame = require("dataframe-js").DataFrame;

// const Cast = require('../../util/cast');
const formatMessage = require("format-message");
/**
 * The instrument and drum sounds, loaded as static assets.
 * @type {object}
 */
let assetData = {};
try {
  assetData = require("./manifest");
  console.log("how to update");
} catch (e) {
  // Non-webpack environment, don't worry about assets.
  console.log(e, "adsfasdf");
}

class Scratch3DataSciBlocks {
  constructor(runtime) {
    /**
     * The runtime instantiating this block package.
     * @type {Runtime}
     */
    this.runtime = runtime;

    /**
     * An array of sound players, one for each drum sound.
     * @type {DataFrame[]}
     * @private
     */
    this._datasets = [];

    // put any setup for your extension here

    // import("dataframe-js").then((dfjs) => {
    //   this.DataFrame = dfjs.DataFrame;
    // });

    this._loadAllDatasets();
  }

  _loadAllDatasets() {
    const loadingPromises = [];
    this.DATASET_INFO.forEach((datasetInfo, index) => {
      const promise = this._storeDataset(
        datasetInfo.fileName,
        index,
        this._datasets
      );
      loadingPromises.push(promise);
    });

    Promise.all(loadingPromises).then(() => {
      // @TODO: Update the extension status indicator.
      console.log(this._datasets);
    });
  }

  /**
   * Gets the dataset into a DataFrame
   * @param {string} fileName - the dataset file name.
   * @param {number} index - the index in the array of datasets.
   * @param {array} datasetsArray - the array of DataFrames in which to store it.
   * @return {Promise} - a promise which will resolve once the dataset has been stored.
   */
  _storeDataset(fileName, index, datasetsArray) {
    console.log(fileName, "fileName");
    if (!assetData[fileName]) return Promise.resolve();

    const buffer = assetData[fileName];
    const csvFile = new File([buffer], fileName + ".csv");

    const df = DataFrame.fromCSV(csvFile);
    console.log(df, "dfdf");
    return df.then((df) => {
      datasetsArray[index] = df;
    });
  }

  /**
   * An array of info about each drum.
   * @type {object[]}
   * @param {string} name - the translatable name to display in the drums menu.
   * @param {string} fileName - the name of the audio file containing the drum sound.
   */
  get DATASET_INFO() {
    return [
      {
        name: formatMessage({
          id: "dataset.sharkAttacks",
          default: "(1) Shark Attacks",
          description: "dataframe of shark attacks",
        }),
        fileName: "shark_attacks",
      },
    ];
  }

  /**
   * Returns the metadata about your extension.
   * @returns {object} metadata about the extension
   */
  /**
   * Returns the metadata about your extension.
   * @returns {object} metadata about the extension
   */
  getInfo() {
    return {
      // unique ID for your extension
      id: "datasci",

      // name that will be displayed in the Scratch UI
      name: "Data Science",

      // colours to use for your extension blocks
      color1: "#000099",
      color2: "#660066",

      // icons to display
      blockIconURI:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAFCAAAAACyOJm3AAAAFklEQVQYV2P4DwMMEMgAI/+DEUIMBgAEWB7i7uidhAAAAABJRU5ErkJggg==",
      menuIconURI:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAFCAAAAACyOJm3AAAAFklEQVQYV2P4DwMMEMgAI/+DEUIMBgAEWB7i7uidhAAAAABJRU5ErkJggg==",

      // your Scratch blocks
      blocks: [
        {
          // name of the function where your block code lives
          opcode: "myFirstBlock",

          // type of block - choose from:
          //   BlockType.REPORTER - returns a value, like "direction"
          //   BlockType.BOOLEAN - same as REPORTER but returns a true/false value
          //   BlockType.COMMAND - a normal command block, like "move {} steps"
          //   BlockType.HAT - starts a stack if its value changes from false to true ("edge triggered")
          blockType: BlockType.REPORTER,

          // label to display on the block
          text: "My first block [MY_NUMBER] and [MY_STRING]",

          // true if this block should end a stack
          terminal: false,

          // where this block should be available for code - choose from:
          //   TargetType.SPRITE - for code in sprites
          //   TargetType.STAGE  - for code on the stage / backdrop
          // remove one of these if this block doesn't apply to both
          filter: [TargetType.SPRITE, TargetType.STAGE],

          // arguments used in the block
          arguments: {
            MY_NUMBER: {
              // default value before the user sets something
              defaultValue: 123,

              // type/shape of the parameter - choose from:
              //     ArgumentType.ANGLE - numeric value with an angle picker
              //     ArgumentType.BOOLEAN - true/false value
              //     ArgumentType.COLOR - numeric value with a colour picker
              //     ArgumentType.NUMBER - numeric value
              //     ArgumentType.STRING - text value
              //     ArgumentType.NOTE - midi music value with a piano picker
              type: ArgumentType.NUMBER,
            },
            MY_STRING: {
              // default value before the user sets something
              defaultValue: "hello",

              // type/shape of the parameter - choose from:
              //     ArgumentType.ANGLE - numeric value with an angle picker
              //     ArgumentType.BOOLEAN - true/false value
              //     ArgumentType.COLOR - numeric value with a colour picker
              //     ArgumentType.NUMBER - numeric value
              //     ArgumentType.STRING - text value
              //     ArgumentType.NOTE - midi music value with a piano picker
              type: ArgumentType.STRING,
            },
          },
        },
        {
          // name of the function where your block code lives
          opcode: "sharkAttackData",

          // type of block - choose from:
          //   BlockType.REPORTER - returns a value, like "direction"
          //   BlockType.BOOLEAN - same as REPORTER but returns a true/false value
          //   BlockType.COMMAND - a normal command block, like "move {} steps"
          //   BlockType.HAT - starts a stack if its value changes from false to true ("edge triggered")
          blockType: BlockType.REPORTER,

          // label to display on the block
          text: "Dataframe of Sharks Attacks [LINES] people",

          // true if this block should end a stack
          terminal: false,

          // where this block should be available for code - choose from:
          //   TargetType.SPRITE - for code in sprites
          //   TargetType.STAGE  - for code on the stage / backdrop
          // remove one of these if this block doesn't apply to both
          filter: [TargetType.SPRITE, TargetType.STAGE],

          arguments: {
            LINES: {
              defaultValue: 20,

              type: ArgumentType.NUMBER,
            },
          },
        },
      ],
    };
  }

  /**
   * implementation of the block with the opcode that matches this name
   *  this will be called when the block is used
   * @param {object} args - the block arguments
   * @param {number} args.MY_NUMBER - the number argument
   * @param {string} args.MY_STRING - the string argument
   * @returns {string} the result of the block
   */
  myFirstBlock({ MY_NUMBER }) {
    // example implementation to return a string
    // return `${MY_STRING} : doubled would be ${MY_NUMBER * 2}`;
    return MY_NUMBER * 2;
  }

  /**
   * implementation of the block with the opcode that matches this name
   *  this will be called when the block is used
   * @param {object} args - the block arguments
   * @param {number} args.LINES - the number argument
   * @returns {Array.<{caseNumber: number, gender: string, age: number, activity: string}>} the result of the block (an array of objects with caseNumber, gender, age, and activity properties)
   */
  sharkAttackData({ LINES }) {
    // get csv from ../data/shark_attacks.csv

    const df = this._datasets[0];

    console.log(df.head(LINES).show());

    return df.head(LINES);
  }
}

module.exports = Scratch3DataSciBlocks;
