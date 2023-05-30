const BlockType = require("../../extension-support/block-type");
const ArgumentType = require("../../extension-support/argument-type");
const TargetType = require("../../extension-support/target-type");
const dfd = require("danfojs");

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
         * An array of datasets.
         * @type {dfd.DataFrame[]}
         * @private
         */
        this._datasets = [];

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
     * @param {dfd.DataFrame[]} datasetsArray - the array of DataFrames in which to store it.
     * @return {Promise} - a promise which will resolve once the dataset has been stored.
     */
    _storeDataset(fileName, index, datasetsArray) {
        console.log(fileName, "fileName");
        if (!assetData[fileName]) return Promise.resolve();

        const buffer = assetData[fileName];
        const csvFile = new File([buffer], fileName + ".csv");

        const df = dfd.readCSV(csvFile);
        return df.then((df) => {
            df.max({ axis: 0 }).print();
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
            blockIconURI: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAFW2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS41LjAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICAgeG1sbnM6ZXhpZj0iaHR0cDovL25zLmFkb2JlLmNvbS9leGlmLzEuMC8iCiAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIKICAgIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIKICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIKICAgIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIgogICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgZXhpZjpQaXhlbFhEaW1lbnNpb249IjEwMCIKICAgZXhpZjpQaXhlbFlEaW1lbnNpb249IjEwMCIKICAgZXhpZjpDb2xvclNwYWNlPSIxIgogICB0aWZmOkltYWdlV2lkdGg9IjEwMCIKICAgdGlmZjpJbWFnZUxlbmd0aD0iMTAwIgogICB0aWZmOlJlc29sdXRpb25Vbml0PSIyIgogICB0aWZmOlhSZXNvbHV0aW9uPSI3Mi8xIgogICB0aWZmOllSZXNvbHV0aW9uPSI3Mi8xIgogICBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIgogICBwaG90b3Nob3A6SUNDUHJvZmlsZT0ic1JHQiBJRUM2MTk2Ni0yLjEiCiAgIHhtcDpNb2RpZnlEYXRlPSIyMDIzLTA1LTMwVDEzOjA2OjI4KzA3OjAwIgogICB4bXA6TWV0YWRhdGFEYXRlPSIyMDIzLTA1LTMwVDEzOjA2OjI4KzA3OjAwIj4KICAgPGRjOnRpdGxlPgogICAgPHJkZjpBbHQ+CiAgICAgPHJkZjpsaSB4bWw6bGFuZz0ieC1kZWZhdWx0Ij5kYXRhc2NpLXNtYWxsPC9yZGY6bGk+CiAgICA8L3JkZjpBbHQ+CiAgIDwvZGM6dGl0bGU+CiAgIDx4bXBNTTpIaXN0b3J5PgogICAgPHJkZjpTZXE+CiAgICAgPHJkZjpsaQogICAgICBzdEV2dDphY3Rpb249InByb2R1Y2VkIgogICAgICBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZmZpbml0eSBEZXNpZ25lciAyIDIuMC40IgogICAgICBzdEV2dDp3aGVuPSIyMDIzLTA1LTMwVDEzOjA2OjI4KzA3OjAwIi8+CiAgICA8L3JkZjpTZXE+CiAgIDwveG1wTU06SGlzdG9yeT4KICA8L3JkZjpEZXNjcmlwdGlvbj4KIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+Cjw/eHBhY2tldCBlbmQ9InIiPz6CWJT8AAABgGlDQ1BzUkdCIElFQzYxOTY2LTIuMQAAKJF1kd8rg1EYxz/bDDFNoVxIS+NqxNTiRtnSqKU1U4ab7bUfaj/e3neS3Cq3ihI3fl3wF3CrXCtFpOSWa+IGvZ53U5PsOT3n+ZzvOc/TOc8BazSr5PSafsjli1ok6HfNxGZddU/Y6aQWG21xRVdHw+EQVe39FosZr3vNWtXP/WuNC0ldAUu98IiiakXhceHQclE1eUu4VcnEF4RPhD2aXFD4xtQTZX42OV3mT5O1aCQA1mZhV/oXJ36xktFywvJy3LnskvJzH/MljmR+ekpil3gHOhGC+HExwRgBfAwwLLOPXrz0yYoq+f2l/EkKkqvIrLKCxiJpMhTxiLok1ZMSU6InZWRZMfv/t696atBbru7wg/3RMF67oW4TvjYM4+PAML4OwfYA5/lKfmEfht5E36ho7j1wrsHpRUVLbMPZOrTfq3EtXpJs4tZUCl6OoSkGLVfQMFfu2c8+R3cQXZWvuoSdXeiR8875bwlMZ7sGYnrIAAAACXBIWXMAAAsTAAALEwEAmpwYAAAXPElEQVR4nO2ce3Bc1Z3nP6cft7vVar0flmzJMn5E8gMb2zJgm4RSyGYCzkKcbJylNkwItRNCFoqpuFzLa0JSLMVskiGwmXiKZMabFElcC+xskVRc5RBiYkhs/FgDNhK2sa1XS2qpJbVa/X6c/eP2OdxuS7bkOMPs5H6rTl1Zuveec37fc36v87sGGzZs2LBhw4YNGzZs2LBhw4YNGzZs2LBhw4YNGzZs2LBhw4YNGzZs/H8O8WEP4M8BUsrlQAfgA/JAtxDi5Ic7qj9DSCmXSSl/LS9GXko5KqXc+WGP8c8GUsoHS1nI5XIzcCPflVJ+7MMe779pSClblbTHx8flF7/4RenxeCQgAblmzRr5/PPPW0mZlFK2ftjj/jcLKeWdUkqZTqdldXW1JsLaysvLZVdXl0yn04qUOwFcc+ygGdiK6QQIwGFpzsJ73JarasYMV2tTv3MVmrPkZ4flqn5+HfilEOL/XJG0/mXgAshms8RisRlvyGazhEIhcrkcbrcbzLnNToiUchMmCT7gr4HaqzzoK8VHgHuklH8thPjehz2YUhTswVKAfD5PPp+f7T5SqZT17w6YhZACGYdLX6Ca6iifz5PL5chms2QyGX1VLZ1OX3S1NvW7bDZLNpvV71I/q/db+9q2bRvXX389wNNSyg7gCSFE/9UQ5pVCSrkac/H+e+AvKIQT77zzDrlcbrZnSCaTcyME+G8A/f39JBIJ4vE40WiUiYkJJiYmGB8f19dYLKbvUddUKlVEkBJyPp8vIlY1IS4Oh9TvrFchBL/4xS946KGH2LFjB8BfAZ+XUt4ihDg2f1HOD1LKAKamaMAkYDOwHlhive/06dP8+Mc/5sknn7zc+6yEzayypJSVwM0AjzzyiCYhGo2SSqVIJpP6mk6ni3aL2j1SynlPdq6khEIhvvnNb9Ld3c2jjz6Ky+WqAo5IKTvnQoqUshFoBDwFITiBNqAM8Beu1nZNobVg2jyYIaAOh8McOXKEF154gT179lxWBoZhsGbNGvx+v/rVzMZGSnmDMvstLS2ypqZGGoYhhRBFjRk8hz9lU/06nU5pGIZsa2uTO3bskIODg2q4ey8lACnlx6WUpwtB2R+Nvr4+uXfvXrlr1y75yU9+clZvarYWCATknj17rLHJDpiBaSnlJ4D9ANXV1aRSqVLj8y8O6w7J5/M4HA5cLhdNTU185jOf4emnnwYzJXGtEOJU6fNSyruBf2SWVFE6nSYejxOLxYjH40Xt3LlznDt3jv7+fsLhMOFwmNHRUUKhEIlEYsadoMY72y7x+Xx4PB5+//vf09HRATBeGPvgTDbkAyvjcOBwOLT+vlQnVxOl6stKiMvl0no3FovR09PD+Pg4NTU1Dky9XkSIlPI/Av8EcPbsWe655x5GRkZIpVLkcrkip0Q5GdbFV6o2Le/F6XRqG6j+blXfM8HtdpPP53nmmWdYtmyZ+vX9QohBmNmo92FuK9Ha2sr09DTT09N6AspAKyP9p0DpZNS/hRAYhqEJSSQSJJNJhoeHqampAVhQ8lwF8CzAgQMHuPvuu5mcnMQwDP1e1cAUlsvluqjP2QSudqxyXC5nPz0eD0IIdu3axWc/+1kVf0QwYytgZkLOUtjay5YtIxqNakKsZFhJsbqlVnfVugJn8q6sKPWmrE3t1GQyidPpLHounU4zPDzMypUrLyIE2A3UATzwwANMTU1RXV2Nz+fD6XQihLjInbeOeya3W91rlcFctEZ5eTmZTIbHHnuM++67TxnzBLBRCNE3KyFCCCmlfAPY8v3vf197VbFYjGg0qglS+lbZmFQqpWOL2dxbK3lqd6nJqHucTidut7uo9ff386tf/YpUKoXL5dLCFEKQSqU4c+YMXV1dAMvVPKSUnwTuBNi5cye9vb1UV1dTVlamVqZeUGrRzHZVO8Dy7qLrbHA4HHi9XqSUrFy5kp07d/KpT32K8vJygCywQQhx1vrMbHHIfwGONzY2zmT0+cMf/sCNN96oV3U6nWZqaoq6urpLDvBKsXv3bvbv369XtNLDQgji8Th9fXqBWRN0uwHGxsZ48cUX8fl8eL1enE4nk5OTRCKRWQVbqp6EEDidziJ1NdMuVzAMA4/HQy6XY+XKldxyyy3cddddrFixQu3wJLBeCNFd+uyMhAghTkgp12MaSS+mz+4HHgIuij4zmYwWVmEyA3yQ97I2R0mDDzwfdU8OyFha6+rVq3E4HLjdbi2cUsEV4CgIeCGFYO32228nFotRW1uLw+HA5/MxMDAwY8xUupvVz6oftXsdDkeRajMMA8MwtE3xeDxs2LCBbdu2sW3bNhobG/F4PKqbCeB6IcSZmWQ/ay5LCHECOGEZ7J1Akd5UA81kMjgcDuvjXxdC/K/Z3j1XSCmfBB4qLy/H6XTidDq11yelxOFwzBjtAt8GiEaj9Pf36+BLkaFWekNDgx53KUHq3VbCFPGqf6XSlAve2trK5s2buf7661m2bBkNDQ3W6UQxMwuvCyEGZpvznLK9BbiBi/QpQCqVwuv1zuNVc0YcoKysDMMwcLlcRQK8BCFdAI8//jipVIrKykoAXC4XiUQCgEAgwMaNG2lrayMSiTA6Osr4+DjRaFS/30qOw+EgnU6Ty+VwOBwYhsGiRYvYtGkTXV1dtLS0UFFRQVlZWekcngDewyTiwuUmPB9CvADJZFKTotzHZDJpTQFcTSQArf+VS2oNEPP5vHWBlEkp/xNmrolXX32VsrIyLcCxsTHAFPCiRYtYvnw5b775pnZdM5mM7svr9VJWVkZNTQ0dHR10dHSwatUqDMPQzobL5dJjsiAOPIfprb4uhHhrPhOeDyE+QEenmUymiJCZclFXARJMApQAFBFqpQLaHRVC1ALbAXHixAlCoRA+nw+AhoYGTp06hZSS+vp6Vq9ezTvvvMMjjzyisseovpRaLFHDlxqjAMKY8cSzQohXr3TCc+vRPKB6FD4gJJ1O67+nUqm5Dn6+WAgwODiobZbX6yWfz2ub4na7qaioUAsiTGHhvPvuuzqSzufzTE5OkslkkFJSV1dHa2srQgiuu+46bZTV6le2CtPBGAV+V3j3TFArsRa4HXhFSvmtK53wXHfIVqBWSql1cCaT0X9MpVIXBWxXCX4wUyQqRvF6vcRiMe3VBAIBlizR2e/jFA7SBgcHi9RJMpkETPUXCAQ4efIkH/3oR1VMkASeAiqBZswAc2Oh//pCK/LCjh07xm9/+1sOHTqEEILGxkYeeOABOjo6BPBYYQH9zXwnPFdChBpQIpHQwZTCnzCNsgBgeHhYp26UgVXCLi8vZ/Hixer+XswTRUZGRnTeyzAMvZD8fj9+v59QKMRHPvIR9ZwXeLy0c+WN9fb2sm/fPvbv38/U1BSGYRTZr1wux+TkJLt27eLWW2/lq1/9KpikvCqEODCfCV8xIVZ3UAhBJpNRnpbSpX8UpJTXALcA9PT04PF4mJqa0glGpY7Kyspobm5WjwWBCoCpqSkdzPn9fiKRCGAS6Pf7OXLkCD/84Q+ZnJykubmZ+vp6IpEIwWCQ4eFhjh49yttvv00gEMDv92sPr7KykkgkQjQaJRaLkUwmteu7YMEC9u3bR1dXlyL7PuDAfOY9V0IcYK6YeDxOLpcrMuJCCKun87AQIjifQcyCrYA/kUhw6tQpKisr9ZGnChD9fj+BQICFCxeqZwYxdX5VfX29XjjxeJy6ujp6e3uJRCKMj49zxx130N/fz3e+8x1yuRw+n0+TpWxIR0cHqVSKcDjMxMRE0fG0sk3K48zlcgwNDeHz+fjBD37AM888o+YwL8ybkEQicVGkLoSYKRa4YhSciL8DGB0dpbe3F8MwaG1tpa+vT6urQCBAW1sb1dXVYBrg14EbgOW33HILP/vZz3QQ19bWxuDgINPT04RCIcD0zlTwpoK8cDh80fGzVR2ro2qVplcLMRAIIKUkFosRDmv7v0BKuWE+x8tzJcQAM2cVDAZpamoqMuJqtRRwNdwt7UQ8//zz+P1+Tp48SXt7O7lcDq/XSy6XIxAIWO3Hb4UQ70opXwHuvvnmm1m8eDEjIyNkMhmGhoZYsWIFPT09vP/++0SjUUWkFrpa/cqNVkfVyWSyaI4qIPV4PLjdbl1DAGh1FgwGaW5uFoW5XD1CCqv1vwM6w6siZzDd4KmpKWuuJjXXzi/R3w/APFD65S9/SUNDA1u2bOH8+fNaXfl8PsrKyti0aZN69M3C9QAQFkLUbt++nWeffRYpJdPT09TV1XHTTTfx1ltvMTo6SjAYLErzz5ShdrvdOlkYCATwer1MT08TiUS0o+BwOMhkMjidTqampojFYpw4cULZtnXzmf9cdoherePj46RSprxVimB6ehohxFUhpEDG26q/5557jkWLFnH48GE6OjpIp9N4vV6y2SxNTU1cd911rFu3Dszg7HUAIURQSvlD4L/ef//9nDp1ijfeeINoNIqUknA4zKpVq6irq+P8+fNEIhGmp6dJp9O43W59vGoYBg0NDfj9ft577z16e3uJx+NUVlZqTy2bzZJMJrXHZU1IWuKyebmfcyFE249gMKjrqBRisRgej8eqwmYuRJobbqJAxksvvcTBgwcZHR3lc5/7HK+88oo+x3C5XBiGwcc+pmuUnxNC7LO8538A/1kIUfv444/z4IMP8vbbbyOEIBqNcuHCBS5cuEAikSCVSmEYBn6/n2QyydDQEKlUCrfbzcDAABUVFYDpLquzoEQigdPpLDp4A3Tw6nQ6rYnF0HwEMBd9rwkZGBjA6XSSSqV0Pml6elrniwqYd0AipVwnpXwG2Auwf/9+vv3tb+Pz+bjtttt44403yOfzlJeXI6Vk6dKldHR0WAl5zfq+gpf37wCamprYu3cvX/jCF8hms9TW1uLz+XQZk0pagnmOUVVVRU1NDR6PR694v99PU1MTnZ2dbN++ndbWVl2PpmRTmAcOhwOn00l9fb0azuh8ZDHvHWL1yaWUTExMFKWxmSMh8oN6YS/wPynEOr/73e/41re+RXV1NWvXruXo0aM6eRmPx1mwYAHZbJYdO3ZY0yWvlb5fCHFcSrkB2C+EqP3GN77BrbfeygsvvEB3dzehUIiKigptHzwejz6atR7btre3s3HjRtasWUMqleLRRx+lt7dXG3ownR2Px4PD4aC8vJz6+npaWlrUUOYVk82FkBqA8fFxRkZGWLFihc4d5XI5pqamWLx4sVU4sw7AQoID+D6WeuGRkRH27NnD0aNHqa2tZf369Rw+fJjJyUntVRmGQSAQ4I477mD9+vXq0b+cLe4pkHIt8DfAX3V2dorOzk7ADDb7+vp09hqgtraW2tpaKioqcDgcuijh+PHjvPzyy/z617+mt7dXl0W5XC6y2axORgLU1dWxdu1aNYTDQog3LxrYJXBJQqSUiyikFAYGBshms/h8Pq1XE4mEVlkFPFYqnEuRIAv1radPn+bhhx9m1apVvPXWWzz11FP85Cc/YWxsDJ/Pp1dsR0cHCxcu5M4777QekF0y718Yz71Syl8B/6Ewlrb29nba29tnmzfvvfceL7/8Mnv37uXcuXOEw2Edqyg7oc5ilMZoaGhg8eLF3H333epV885YXG6HbAWqc7kcwaAp50wmQ1VVFUIIIpEIHo/nonLIApFbMYX1t5SQkM/nicVinD9/nu9973s6QOvr6+PrX/86u3fvJhqNUlZWpoWwevVqqqqquPfee3WRA5YdWUK8wEwUNgJNmGWgLZjZ42o+SJlrNZVKpTh79iy/+c1vOHjwIMeOHSMUCumo3AplP5XNUITU19ezefNmVZKUB/bMj47LE1IJZrDT09OD3+8nkUjoHTE+Pq5tSgHlUsqngb8sTLyIBFXjderUKX70ox/pNMXQ0BBf+tKX2LdvHz/96U/JZrM0NDTolLlyU++9916repzAPBL4C2nWIz/CPD6ZOHbsGAcPHuTVV1+lt7eX0dFRJiYmSKVSsxYvWIsFVfbZ5XLhdrtZunQp7e3tfO1rX1O3PzVTFeXlcKnvQzowVQyDg4McPXqUDRs20NTUpBN9IyMjBAIBq0H/e/VDLpcjFosRiUQIhUIcOXKEAwcOaBezubmZsrIyPvGJT/Dzn/+c3bt3k8/nMQyDuro6QqEQHo+H5cuX09DQwJe//GWWLFmi+ophrvDdJWPWKzcSiTAyMsLQ0BD9/f309/czODhIMBhkbGyMYDDI5OSkToPMBVaiVNZZZQs2bdrEzp07rTv372d7z6VwqR2yFXBNTk4yNDREdXU1DoeDzs5OhBAEg0Hi8Tjt7e0645lOpzlz5gynT5/m7NmzjIyM4Ha78Xq9+P1+1qxZQ1VVFddccw2GYfDiiy/y3e9+V/v9dXV1RCIRwuGw9lRaWlrYvn07S5YsscY6fkCrvkgkwtjYGO+//z49PT2cPHmSM2fOMDw8zNjYWJHAL1dLdTmoqN7pdFJbW0trayu33XYbDz/8sFVT3H6lCdZZz10LO+QUID7/+c+zdOlSfD4fbW1tujCu9NsPlQPKZDKaiMrKShYuXMjy5csJBoMcPnyYCxcu6NUJpnejPnmQUrJgwQLWrFnDunXr+PjHP65PB1V+SQk1mUxy/vx5vQOGh4cZGhpiYGCAUChEJBJhamqKqampos8lrhTqWNfn81FTU0NbWxv33HMPd911l7plEtgmhHjjivu41B+llAeBrYcOHeK1117j5ptv5uzZszrCtVZlVFRUUF1dzfLly2ltbWVgYICBgQGCwSATExOEw2FGRkaIRCLE43HKy8spKysjFAoxPT0NmLW1nZ2dbNy4kWuvvZbGxkZ9MlhKBqA9tJ6eHrq7u+nr62NgYIDBwUHGx8d1JaX1dPOKhFTYFVVVVdTV1dHQ0MCNN97I9u3bueGGG9Rt/wA8Kf7Ir7kuZ9T/Dthyww03iCeeeIKVK1fS1dXF8ePHyeVyLFq0iHg8rqPebDZLd3c33d3dZDIZzp8/TzAYZHx8XB8mlZeX6zPuUCiEy+WioaGBtWvX0tXVxdKlS/F4PNpYKsTj8YtWdzqd1qWuapdaixNKE4dXAq/XS1VVFS0tLaxatYqbbrqJLVu2WE8bJfCQEOJvr6iDElySECHEP0sp/y+w/sknn+Sll17Sh1SxWIwLFy4Qi8WIxWJMT08Tj8eRUupck8vl0km7RCLB8PAwiUSCiooK6urqqKysZNGiRXz605+mtfWDKlB1RIpZGb4HeHCGeifcbjcLFy5ECKHfWTgjJ5vN6k/sSmuJS087rf263W6d2a2srKS5uZmuri42b95MZ2dn0SIBngf+txDin+cn9kvI/HI3SLNoeR8gvvKVr9Dc3FxURlnaksmk/kxAnfBVV1dTUVFBVVUVhmFQX1/P1q1bWbduXdFxsCW+APMjluswi5LfZgaXNpfLFR2ljoyMMDAwwNDQEGNjY0xMTDA2NqZVpXVs1pRJTU0N1dXVlJeX09raytKlS2lra6OqqoqmpibrETGYi+Q7mDVXB65c9DNjTsVUUsqXgU+fO3eO++67j1wupydjGIYux/F4PNTV1dHU1IRhGFqVORwOXWa5YEHpFwMXfQwTBr6GOeHBQv8q6LPiHyjEOorQ0k8jlL1SB01qN8fjcQCqqqpYsGAB9fX1uFwuPB7PTJWHYKqlZ4AjhXH1zXTT1cBcCdlCISI+dOiQTsCplIYSqPLLGxsbaW5uLsrxXAZh4H4Kx7BzcRkt2YCidMxlnin69yxjiwMHgQuYXtNQYUx/8q98YR7/PZOU8jPAS/N5poAwcBrzy6zfA8Mz3DMnEmYZl3X3lP4PE5WYX9J6MAkvJS6MeXYyiqkaU4WxvH8lY7kamJdwC6Rs5YP/+kL9txdq6eUxq7xHMEty8vwRwr6amEXt/asYmw0bNmzYsGHDhg0bNmzYsGHDhg0bNmzYsGHDhg0bNmzYsGHDhg0bNmzYsGHDhg0bNv714f8BewmMNn484zAAAAAASUVORK5CYII=`,
            menuIconURI: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAFW2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS41LjAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICAgeG1sbnM6ZXhpZj0iaHR0cDovL25zLmFkb2JlLmNvbS9leGlmLzEuMC8iCiAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIKICAgIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIKICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIKICAgIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIgogICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgZXhpZjpQaXhlbFhEaW1lbnNpb249IjEwMCIKICAgZXhpZjpQaXhlbFlEaW1lbnNpb249IjEwMCIKICAgZXhpZjpDb2xvclNwYWNlPSIxIgogICB0aWZmOkltYWdlV2lkdGg9IjEwMCIKICAgdGlmZjpJbWFnZUxlbmd0aD0iMTAwIgogICB0aWZmOlJlc29sdXRpb25Vbml0PSIyIgogICB0aWZmOlhSZXNvbHV0aW9uPSI3Mi8xIgogICB0aWZmOllSZXNvbHV0aW9uPSI3Mi8xIgogICBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIgogICBwaG90b3Nob3A6SUNDUHJv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`,

            // your Scratch blocks
            blocks: [
                // {
                //     // name of the function where your block code lives
                //     opcode: "myFirstBlock",

                //     // type of block - choose from:
                //     //   BlockType.REPORTER - returns a value, like "direction"
                //     //   BlockType.BOOLEAN - same as REPORTER but returns a true/false value
                //     //   BlockType.COMMAND - a normal command block, like "move {} steps"
                //     //   BlockType.HAT - starts a stack if its value changes from false to true ("edge triggered")
                //     blockType: BlockType.REPORTER,

                //     // label to display on the block
                //     text: "My first block [MY_NUMBER] and [MY_STRING]",

                //     // true if this block should end a stack
                //     terminal: false,

                //     // where this block should be available for code - choose from:
                //     //   TargetType.SPRITE - for code in sprites
                //     //   TargetType.STAGE  - for code on the stage / backdrop
                //     // remove one of these if this block doesn't apply to both
                //     filter: [TargetType.SPRITE, TargetType.STAGE],

                //     // arguments used in the block
                //     arguments: {
                //         MY_NUMBER: {
                //             // default value before the user sets something
                //             defaultValue: 123,

                //             // type/shape of the parameter - choose from:
                //             //     ArgumentType.ANGLE - numeric value with an angle picker
                //             //     ArgumentType.BOOLEAN - true/false value
                //             //     ArgumentType.COLOR - numeric value with a colour picker
                //             //     ArgumentType.NUMBER - numeric value
                //             //     ArgumentType.STRING - text value
                //             //     ArgumentType.NOTE - midi music value with a piano picker
                //             type: ArgumentType.NUMBER,
                //         },
                //         MY_STRING: {
                //             // default value before the user sets something
                //             defaultValue: "hello",

                //             // type/shape of the parameter - choose from:
                //             //     ArgumentType.ANGLE - numeric value with an angle picker
                //             //     ArgumentType.BOOLEAN - true/false value
                //             //     ArgumentType.COLOR - numeric value with a colour picker
                //             //     ArgumentType.NUMBER - numeric value
                //             //     ArgumentType.STRING - text value
                //             //     ArgumentType.NOTE - midi music value with a piano picker
                //             type: ArgumentType.STRING,
                //         },
                //     },
                // },
                {
                    // name of the function where your block code lives
                    opcode: "sharkAttackData",

                    blockType: BlockType.REPORTER,

                    // label to display on the block
                    text: "Dataframe of Sharks Attacks [LINES] people",

                    // true if this block should end a stack
                    terminal: false,

                    filter: [TargetType.SPRITE, TargetType.STAGE],

                    arguments: {
                        LINES: {
                            defaultValue: 20,

                            type: ArgumentType.NUMBER,
                        },
                    },
                },
                {
                    opcode: "dropNa",
                    blockType: BlockType.REPORTER,

                    // label to display on the block
                    text: "DropNa of df: [DF]",

                    // true if this block should end a stack
                    terminal: false,

                    // where this block should be available for code - choose from:
                    //   TargetType.SPRITE - for code in sprites
                    //   TargetType.STAGE  - for code on the stage / backdrop
                    // remove one of these if this block doesn't apply to both
                    filter: [TargetType.SPRITE, TargetType.STAGE],

                    // arguments used in the block
                    arguments: {
                        DF: {
                            type: ArgumentType.DATAFRAME,
                        },
                        COLUMN: {
                            defaultValue: "age",

                            type: ArgumentType.STRING,
                        },
                    },
                },
                {
                    opcode: "dropNaSeries",
                    blockType: BlockType.REPORTER,

                    // label to display on the block
                    text: "DropNa of series: [SERIES]",

                    // true if this block should end a stack
                    terminal: false,

                    // where this block should be available for code - choose from:
                    //   TargetType.SPRITE - for code in sprites
                    //   TargetType.STAGE  - for code on the stage / backdrop
                    // remove one of these if this block doesn't apply to both
                    filter: [TargetType.SPRITE, TargetType.STAGE],

                    arguments: {
                        SERIES: {
                            type: ArgumentType.SERIES,
                        },
                    },
                },
                {
                    opcode: "seriesFromCol",
                    blockType: BlockType.REPORTER,
                    text: "Series from df: [DF] col: [COLUMN]",
                    terminal: false,
                    filter: [TargetType.SPRITE, TargetType.STAGE],

                    // arguments used in the block
                    arguments: {
                        DF: {
                            type: ArgumentType.DATAFRAME,
                        },
                        COLUMN: {
                            defaultValue: "age",
                            type: ArgumentType.STRING,
                        },
                    },
                },
                {
                    opcode: "countSeries",
                    blockType: BlockType.REPORTER,

                    // label to display on the block
                    text: "length of [SERIES]",

                    // true if this block should end a stack
                    terminal: false,

                    // where this block should be available for code - choose from:
                    //   TargetType.SPRITE - for code in sprites
                    //   TargetType.STAGE  - for code on the stage / backdrop
                    // remove one of these if this block doesn't apply to both
                    filter: [TargetType.SPRITE, TargetType.STAGE],
                    arguments: {
                        SERIES: {
                            type: ArgumentType.SERIES,
                        },
                    },
                },
                {
                    opcode: "mean",
                    blockType: BlockType.REPORTER,

                    // label to display on the block
                    text: "mean of [SERIES]",

                    // true if this block should end a stack
                    terminal: false,

                    // where this block should be available for code - choose from:
                    //   TargetType.SPRITE - for code in sprites
                    //   TargetType.STAGE  - for code on the stage / backdrop
                    // remove one of these if this block doesn't apply to both
                    filter: [TargetType.SPRITE, TargetType.STAGE],
                    arguments: {
                        SERIES: {
                            type: ArgumentType.SERIES,
                        },
                    },
                },
                // {
                //     opcode: "mode",
                //     blockType: BlockType.REPORTER,

                //     // label to display on the block
                //     text: "mode of [DF] column: [COLUMN]",

                //     // true if this block should end a stack
                //     terminal: false,

                //     // where this block should be available for code - choose from:
                //     //   TargetType.SPRITE - for code in sprites
                //     //   TargetType.STAGE  - for code on the stage / backdrop
                //     // remove one of these if this block doesn't apply to both
                //     filter: [TargetType.SPRITE, TargetType.STAGE],

                //     // arguments used in the block
                //     arguments: {
                //         DF: {
                //             type: ArgumentType.DATAFRAME,
                //         },
                //         COLUMN: {
                //             defaultValue: "age",

                //             type: ArgumentType.STRING,
                //         },
                //     },
                // },
                // {
                //     opcode: "median",
                //     blockType: BlockType.REPORTER,
                //     text: "median of [DF] column: [COLUMN]",
                //     terminal: false,
                //     filter: [TargetType.SPRITE, TargetType.STAGE],
                //     arguments: {
                //         DF: {
                //             type: ArgumentType.DATAFRAME,
                //         },
                //         COLUMN: {
                //             defaultValue: "age",

                //             type: ArgumentType.STRING,
                //         },
                //     },
                // },
                // {
                //     opcode: "sd",
                //     blockType: BlockType.REPORTER,
                //     text: "standard deviation of [DF] column: [COLUMN]",
                //     terminal: false,
                //     filter: [TargetType.SPRITE, TargetType.STAGE],
                //     arguments: {
                //         DF: {
                //             type: ArgumentType.DATAFRAME,
                //         },
                //         COLUMN: {
                //             defaultValue: "age",

                //             type: ArgumentType.STRING,
                //         },
                //     },
                // },
            ],
        };
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

        return df.head(LINES);
    }
    /**
     * @param {object} args - the block arguments
     * @param {dfd.DataFrame} args.DF - the dataframe argument
     * @param {string} args.COLUMN - the column argument
     * @returns {dfd.Series} the result of the block
     *
     */
    seriesFromCol({ DF, COLUMN }) {
        const series = new dfd.Series(DF[COLUMN].values);
        series.print();
        return series;
    }

    /**
     * implementation of the block with the opcode that matches this name
     * this will be called when the block is used
     * @param {object} args - the block arguments
     * @param {dfd.DataFrame} args.DF - the dataframe argument
     * @param {string} args.COLUMN - the column argument
     * @returns {dfd.DataFrame} the result of the block
     *
     */
    dropNa({ DF }) {
        const df = DF;
        df.dropNa({ axis: 1, inplace: true });
        console.log(df, "dropna");
        df.print();
        return df;
    }

    /**
     * implementation of the block with the opcode that matches this name
     * this will be called when the block is used
     * @param {object} args - the block arguments
     * @param {dfd.Series} args.SERIES - the dataframe argument
     * @returns {dfd.DataFrame} the result of the block
     *
     */
    dropNaSeries({ SERIES }) {
        const series = SERIES;
        series.dropNa({ inplace: true });
        series.print();
        return series;
    }

    /**
     * implementation of the block with the opcode that matches this name
     * this will be called when the block is used
     * @param {object} args - the block arguments
     * @param {dfd.Series} args.SERIES - the dataframe argument
     * @returns {number} the result of the block
     */
    countSeries({ SERIES }) {
        // get csv from ../data/shark_attacks.csv

        const series = SERIES;

        console.log(series.count());
        return series.count();
    }

    /**
     * implementation of the block with the opcode that matches this name
     * this will be called when the block is used
     * @param {object} args - the block arguments
     * @param {dfd.Series} args.SERIES - the dataframe argument
     * @returns {number} the result of the block
     */
    mean({ SERIES }) {
        // get csv from ../data/shark_attacks.csv

        const series = SERIES;

        console.log(series.mean());
        return series.mean();
    }

    /**
     * implementation of the block with the opcode that matches this name
     * this will be called when the block is used
     * @param {object} args - the block arguments
     * @param {dfd.DataFrame} args.DF - the dataframe argument
     * @param {string} args.COLUMN - the column argument
     * @returns {number} the result of the block
     */
    mode({ DF, COLUMN }) {
        const df = DF;
        const series = new dfd.Series(df[COLUMN].values);

        console.log(series.mode());
        return series.mode();
    }

    /**
     * implementation of the block with the opcode that matches this name
     * this will be called when the block is used
     * @param {object} args - the block arguments
     * @param {object} args.DF - the dataframe argument
     * @param {string} args.COLUMN - the column argument
     * @returns {number} the result of the block
     */
    median({ DF, COLUMN }) {
        let df = DF;
        const series = new dfd.Series(df[COLUMN].values);

        console.log(series.median());
    }

    /**
     * implementation of the block with the opcode that matches this name
     * this will be called when the block is used
     * @param {object} args - the block arguments
     * @param {object} args.DF - the dataframe argument
     * @param {string} args.COLUMN - the column argument
     * @returns {number} the result of the block
     */
    sd({ DF, COLUMN }) {
        const df = DF;
        const series = new dfd.Series(df[COLUMN].values);

        console.log(series.std());
    }
}

module.exports = Scratch3DataSciBlocks;
