import Immutable, { Map, Record, OrderedMap } from 'immutable';
import { EventEmitter } from 'events';
import rref from './rref';

export const BlockRecord = Record({ row: 0, col: 0 });
export const Block = Record({
    type: 'normal',
    mines: 0,
    hidden: true,
    flag: false
});

Map.prototype.initSurrounding = function(record) {
    const block = this.get(record);
    return this.set(
        record,
        new Block({
            type: block ? block.type : 'normal',
            mines: block ? block.mines + 1 : 1
        })
    );
};

Map.prototype.revealBlock = function(blockRecord) {
    // click on normal hidden block
    let blocks = this.update(
        blockRecord,
        b => b.set("hidden", false)
    );

    if (!this.get(blockRecord).mines) {
        blockRecord.getSurrounding()
            .filter(record => this.get(record).hidden)
            .forEach(record => {
                blocks = blocks.revealBlock(record);
            });
    }

    return blocks;
};

Map.prototype.expandBlock = function(blockRecord) {
    const block = this.get(blockRecord);
    let blocks = this;

    if (block.mines && blockRecord.getSurrounding().filter(record => this.get(record).flag).length === block.mines) {
        blockRecord.getSurrounding()
            .filter(record => this.get(record).hidden && !this.get(record).flag)
            .forEach(record => {
                blocks = blocks.revealBlock(record);
            });
    }

    return blocks;
};

Map.prototype.setFlag = function(blockRecord) {
    return this.update(
        blockRecord,
        b => b.set("flag", !b.flag)
    );
};

Map.prototype.checkGame = function() {
    if (this.filter(block => block.type === "normal")
            .every(block => !block.hidden)
    ) {
        return true;
    }

    return false;
};


const randomNumberGenerator = ({
    start = 0,
    end,
    number = 1,
    exclude = []
}) => (
    new Array(number)
        .fill(0)
        .map( (cur, index) => index )
        .reduce( (random, index) => {
            let r = Math.floor(Math.random() * (random.length - index));
            random.push(random[r]);
            random.splice(r, 1);
            return random;
        }, new Array(end - start)
            .fill(0)
            .map( (cur, index) => index )
            .filter(cur => !exclude.includes(cur))
        )
        .slice(-number)
);

const Minesweeper = () => ({
    rows: 9,
    cols: 9,
    mines: 10,
    minesRemaining: 10,
    blocks: Map(),
    status: "reading",
    timePass: 0,
    mode: "regular",
    flagMode: false,

    _timer: null,
    _eventEmitter: new EventEmitter(),
    on: function(event, callback) {
        return this._eventEmitter.on(event, callback);
    },


    reset: function(rows, cols, mines, flagMode) {
        // reset variables
        this.rows = rows || this.rows;
        this.cols = cols || this.cols;
        this.mines = mines || this.mines;
        this.minesRemaining = this.mines;
        this.blocks = Map();
        this.status = "ready";
        this.timePass = 0;
        this.mode = "regular";
        this.flagMode = flagMode || this.flagMode;
        clearInterval(this._timer);
        this._eventEmitter.emit("statuschanged", this.status);

        // inject this game's rows and cols.
        BlockRecord.prototype.getSurrounding = function() {
            return [].concat(...[-1, 0, 1].map(i => (
                [-1, 0, 1].map(j => (new BlockRecord({
                    row: this.row + i,
                    col: this.col + j
                })))
            ))).filter( ({row, col}) => (
                row >= 0 && col >= 0 && row < rows && col < cols && !(row === this.row && col === this.col)
            ));
        };

        // reset blocks
        new Array(this.rows).fill(0).map((cur, row) => (
            new Array(this.cols).fill(0).map((cur, col) => {
                this.blocks = this.blocks.set(
                    new BlockRecord({ row, col }),
                    new Block()
                );
            })
        ));

        return this;
    },

    init: function(rows, cols, mines, flagMode, exclude = []) {
        this.reset(rows, cols, mines, flagMode);

        exclude = exclude.map(record => record.row * this.cols + record.col);

        // initialize random mines
        randomNumberGenerator({ end: this.rows * this.cols, number: this.mines, exclude })
            .forEach(index => {
                const blockRecord = new BlockRecord({
                    row: Math.floor(index / this.cols),
                    col: index % this.cols
                });

                this.blocks = this.blocks.set(blockRecord, new Block({
                    type: 'mine'
                }));

                // initialize numbers of surronding mines.
                blockRecord.getSurrounding()
                    .forEach(record => {
                        this.blocks = this.blocks.initSurrounding(record);
                    });
            });

        return this;
    },

    clickOn: function(blockRecord) {
        const block = this.blocks.get(blockRecord);

        // first click, ensure no mines put in the surrounding of the clicked position.
        if (this.status === "ready") {
            const exclude = blockRecord.getSurrounding().concat([blockRecord]);
            this.init(this.rows, this.cols, this.mines, this.flagMode, exclude);

            this.status = "playing";
            this.mode = this.flagMode ? "quick" : "regular";
            this._eventEmitter.emit("statuschanged", this.status);
            this._timer = setInterval(() => {
                if (this.status === "playing") {
                    this.timePass += 1;
                    this._eventEmitter.emit("timeupdated", this.timePass);
                }
            }, 1000);
        }

        // click on flag
        if (block.flag) {
            // do nothing
        }
        // click on hidden block
        else if (block.hidden) {
            if (block.type === 'mine') {
                this.status = "lose";
                this._eventEmitter.emit("statuschanged", this.status);

                clearInterval(this._timer);

                let blocks = this.blocks;

                this.keySeq()
                    .toArray()
                    .filter(key => blocks.get(key).type === "mine")
                    .forEach(mine => {
                        blocks = blocks.update(
                            mine,
                            b => b.set("hidden", false)
                        );
                    });

                this.blocks = blocks;
            }
            else {
                this.blocks = this.blocks.revealBlock(blockRecord);
            }
        }
        // click on number, expand surrounding block
        else if (!block.hidden) {
            this.blocks = this.blocks.expandBlock(blockRecord);
        }

        // for testing only
        this.solver(this.blocks);
        return this;
    },

    rightClickOn: function(blockRecord) {
        const block = this.blocks.get(blockRecord);

        if (block.hidden) {
            this.blocks = this.blocks.setFlag(blockRecord);

            this.minesRemaining += this.blocks.get(blockRecord).flag ? (this.minesRemaining <= 0 ? 0 : -1) : 1;
        }
        else {
            this.blocks = this.blocks.expandBlock(blockRecord);
        }

        return this;
    },

    singleClick: function(blockRecord) {
        if (this.status !== "win" && this.status !== "lose") {
            if (this.mode === "regular") {
                this.clickOn(new BlockRecord(blockRecord));
            }
            else if (this.mode === "quick") {
                this.rightClickOn(new BlockRecord(blockRecord));
            }

            this.checkGame();
        }
        return this;
    },
    rightClick: function(blockRecord) {
        if (this.status !== "win" && this.status !== "lose") {
            if (this.mode === "regular") {
                this.rightClickOn(new BlockRecord(blockRecord));
            }
            else if (this.mode === "quick") {
                this.clickOn(new BlockRecord(blockRecord));
            }

            this.checkGame();
        }
        return this;
    },

    checkGame: function() {
        if (this.blocks.checkGame()) {
            this.status = "win";
            this._eventEmitter.emit("statuschanged", this.status);
            clearInterval(this._timer);
            return true;
        }

        return false;
    },


    testingDelay: function(callback) {
        return new Promise(
            function(resolve, reject) {
                callback();
                setTimeout(() => {
                    resolve();
                }, 1000);
            }
        );
    },

    getEdgeBlockRecord: function(blocks) {
        return blocks.keySeq()
            .toArray()
            .filter(key => blocks.get(key).type === "normal" && blocks.get(key).mines && !blocks.get(key).hidden)
            .filter(record => record.getSurrounding().some(
                r => blocks.get(r).hidden && !blocks.get(r).flag
            ));
    },
    getEdgeHiddenBlock: function(edges, blocks) {
        return edges.reduce( (edgeBlock, record) => {
            record.getSurrounding()
                .filter(r => blocks.get(r).hidden && !blocks.get(r).flag)
                .forEach(r => {
                    edgeBlock = edgeBlock.set(
                        r,
                        blocks.get(r)
                    );
                });
            return edgeBlock;
        }, OrderedMap());
    },
    getAllPossibility: function(edges, edgeBlocks, blocks) {
        return edgeBlocks.keySeq()
            .toArray()
            .reduce( (possible, record) => {
                return possible.reduce( (p, cur) => {
                    return [
                        ...p,
                        cur.update(record, block => block.set("flag", true)),
                        cur.update(record, block => block.set("flag", false))
                    ];
                }, []);
            }, [blocks]);
    },
    getIsValid: function(edges, AllPossibility) {
        return AllPossibility.filter(blocks => (
            edges.every(record => (
                record.getSurrounding().filter(r => blocks.get(r).flag).length === blocks.get(record).mines
            ))
        ));
    },
    getConfirmedRecord: function(edgeBlock, validPossibility) {
        return edgeBlock.keySeq()
            .toArray()
            .filter(record => (
                validPossibility.every(
                    blocks => blocks.get(record).flag
                ) ||
                validPossibility.every(
                    blocks => !blocks.get(record).flag
                )
            ));
    },

    solver: function(blocks) {
        const beforeSolved = blocks.filter(block => !block.hidden || block.flag).size;
        const edges = this.getEdgeBlockRecord(blocks);

        // set flag to those satisfy the mines number
        edges.forEach(record => {
            const surroundingHidden = record.getSurrounding()
                .filter(r => blocks.get(r).hidden);

            if (blocks.get(record).mines === surroundingHidden.length) {
                surroundingHidden.forEach(r => {
                    blocks = blocks.update(
                        r,
                        b => b.set("flag", true)
                    );
                });
            }
        });

        this.blocks = blocks; // testing only

        // reveal those edge blocks being set flag.
        edges.forEach(record => {
            const block = blocks.get(record);

            if (record.getSurrounding().filter(r => blocks.get(r).flag).length === block.mines) {
                record.getSurrounding()
                    .filter(r => blocks.get(r).hidden && !blocks.get(r).flag)
                    .forEach(r => {
                        blocks = blocks.revealBlock(r);
                    });
            }
        });

        this.blocks = blocks;

        const afterSolved = blocks.filter(block => !block.hidden || block.flag).size;

        if (afterSolved > beforeSolved) {
            this.solver(blocks);
        }
        else {
            if (!blocks.checkGame()) {
                /*
                 *  inspired by the great article by @ROBERT MASSAIOLI
                 *  https://massaioli.wordpress.com/2013/01/12/solving-minesweeper-with-matricies/
                 */

                let changed = false;
                const edgeBlocks = this.getEdgeHiddenBlock(edges, blocks).keySeq().toArray();

                console.log(edges);
                console.log(edgeBlocks);

                const matrix = edges.map(edge => {
                    const hiddenBlock = edge.getSurrounding()
                        .filter(record => blocks.get(record).hidden && !blocks.get(record).flag);
                    return edgeBlocks.map(unknown => (
                        hiddenBlock.find(h => Immutable.is(h, unknown)) ? 1 : 0
                    )).concat([
                        blocks.get(edge).mines - edge.getSurrounding().filter(record => blocks.get(record).hidden && blocks.get(record).flag).length
                    ]);
                });

                console.log(matrix);

                if (matrix.length) {
                    const rrefMatrix = rref(matrix);

                    const bounds = matrix.map(row =>
                        row.slice(0, row.length - 1)
                            .reduce( (bound, col) => (
                                [
                                    bound[0] + (col === 1 ? 1 : 0), // maximum bound
                                    bound[1] + (col === -1 ? -1 : 0) // minimum bound
                                ]
                            ), [0, 0])
                            .concat(row.slice(-1)) // concat with the augmented column
                    );

                    console.log(bounds);

                    bounds.forEach( (bound, row) => {
                        if (bound[0] === bound[2] || bound[1] === bound[2]) {
                            const boundCondition = bound[0] === bound[2] ? 1 : -1;
                            matrix[row].slice(0, matrix[row].length - 1)
                                .forEach( (col, i) => {
                                    if (col === boundCondition) {
                                        console.log("flag", edgeBlocks[i]);
                                        blocks = blocks.update(edgeBlocks[i], b => b.set("flag", true));
                                        changed = true;
                                    }
                                    else if (col === -boundCondition) {
                                        console.log("reveal", edgeBlocks[i]);
                                        blocks = blocks.revealBlock(edgeBlocks[i]);
                                        changed = true;
                                    }
                                });
                        }
                    });

                    this.blocks = blocks;

                    if (changed) {
                        this.solver(blocks);
                    }
                }

            }
        }

    }
});

export default Minesweeper;
