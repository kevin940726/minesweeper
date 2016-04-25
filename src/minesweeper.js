import Immutable, { Map, Record, List, Range } from 'immutable';
import { EventEmitter } from 'events';
import rref from './rref';

export const BlockRecord = Record({ row: 0, col: 0 });
export const Block = Record({
    type: 'normal',
    mines: 0,
    hidden: true,
    flag: false
});
/* create an instance of Immutable Map, append it's prototype. */
export const Blocks = Map;

/* get surrounding blocks, return a Map containing surrounding
   blocks except itself. */
Blocks.prototype.getSurrounding = function(record) {
    return this.filter( (block, r) => (
        Math.abs(r.row - record.row) <= 1 &&
        Math.abs(r.col - record.col) <= 1 &&
        !(r.row === record.row && r.col === record.col)
    ));
};

/* initial the 'mines' of surrounding block of mine.
   return blocks. */
Blocks.prototype.initSurrounding = function(record) {
    const block = this.get(record);
    return this.update(
        record,
        b => b.set("mines", block.mines + 1)
    );
};

/* open the blocks and the surrounding blocks recursively */
Blocks.prototype.revealBlock = function(blockRecord, revealMineCallback) {
    // if click on mine, game lose, reveal all the mines.
    if (this.get(blockRecord).type === 'mine') {
        return revealMineCallback();
    }
    // click on normal hidden block
    else {
        let blocks = this.update(
            blockRecord,
            b => b.set("hidden", false)
        );

        if (!this.get(blockRecord).mines) {
            this.getSurrounding(blockRecord)
                .filter(block => block.hidden)
                .forEach( (block, record) => {
                    blocks = blocks.revealBlock(record, revealMineCallback);
                });
        }

        return blocks;
    }
};

/* click on number, expand the surrounding blocks recursively */
Blocks.prototype.expandBlock = function(blockRecord, revealMineCallback) {
    const block = this.get(blockRecord);
    let blocks = this;

    if (block.mines && this.getSurrounding(blockRecord).filter(b => b.flag).size === block.mines) {
        this.getSurrounding(blockRecord)
            .filter(b => b.hidden && !b.flag)
            .forEach( (b, record) => {
                blocks = blocks.revealBlock(record, revealMineCallback);
            });
    }

    return blocks;
};

/* set a flag on the block */
Blocks.prototype.setFlag = function(blockRecord) {
    return this.update(
        blockRecord,
        b => b.set("flag", !b.flag)
    );
};

/* check if this blocks is game over */
Blocks.prototype.checkGame = function() {
    if (this.filter(block => block.type === "normal")
            .every(block => !block.hidden)
    ) {
        return true;
    }

    return false;
};

/* random number generator */
const RNG = ({
    start = 0,
    end,
    number = 1,
    exclude = List()
}) => (
    Range(0, number)
        .reduce( (random, index) => {
            let r = Math.floor(Math.random() * (random.size - index));
            return random.push(random.get(r)).delete(r);
        }, Range(start, end).toList().filterNot(n => exclude.includes(n)))
        .takeLast(number)
);

/* main class */
const Minesweeper = () => ({
    _timer: null,
    _eventEmitter: new EventEmitter(),
    on: function(event, callback) {
        return this._eventEmitter.on(event, callback);
    },

    /* reset the game board */
    reset: function(rows, cols, mines, flagMode, checkIsSolvable) {
        // reset variables
        this.rows = rows || 9;
        this.cols = cols || 9;
        this.mines = mines || 10;
        this.minesRemaining = this.mines;
        this.blocks = Blocks();
        this.status = "ready";
        this.timePass = 0;
        this.mode = "regular";
        this.flagMode = flagMode || false;
        this.checkIsSolvable = checkIsSolvable || false;
        clearInterval(this._timer);
        this._eventEmitter.emit("statuschanged", this.status);

        let blocks = this.blocks;

        // reset blocks
        Range(0, this.rows).forEach(row => (
            Range(0, this.cols).forEach(col => {
                blocks = blocks.set(
                    new BlockRecord({ row, col }),
                    new Block()
                );
            })
        ));

        return blocks;
    },

    /* initialize the game */
    init: function(rows, cols, mines, flagMode, exclude = Map()) {
        let blocks = this.reset(rows, cols, mines, flagMode);

        exclude = exclude.keySeq().map(record => record.row * this.cols + record.col);

        // initialize random mines
        RNG({ end: this.rows * this.cols, number: this.mines, exclude })
            .forEach(index => {
                const blockRecord = new BlockRecord({
                    row: Math.floor(index / this.cols),
                    col: index % this.cols
                });

                blocks = blocks.update(blockRecord, b => b.set("type", 'mine'));

                // initialize numbers of surronding mines.
                blocks.getSurrounding(blockRecord)
                    .forEach( (block, record) => {
                        blocks = blocks.initSurrounding(record);
                    });
            });

        return blocks;
    },

    /* gameover, and reveal all the mines */
    revealMine: function() {
        this.status = "lose";
        this._eventEmitter.emit("statuschanged", this.status);

        clearInterval(this._timer);

        let blocks = this.blocks;

        blocks.keySeq()
            .toArray()
            .filter(key => blocks.get(key).type === "mine")
            .forEach(mine => {
                blocks = blocks.update(
                    mine,
                    b => b.set("hidden", false)
                );
            });

        return blocks;
    },

    /* reveal the block */
    clickOn: function(blockRecord) {
        let blocks = this.blocks;

        // first click, ensure no mines put in the surrounding of the clicked position.
        if (this.status === "ready") {
            const exclude = blocks.getSurrounding(blockRecord).set(blockRecord, blocks.get(blockRecord));

            blocks = this.init(this.rows, this.cols, this.mines, this.flagMode, exclude);
            if (this.checkIsSolvable) {
                return this.solver(blocks.revealBlock(blockRecord))
                    .then(solved => {
                        if (!solved) {
                            return this.clickOn(blockRecord);
                        }
                        else {
                            this.status = "playing";
                            this.mode = this.flagMode ? "quick" : "regular";
                            this._eventEmitter.emit("statuschanged", this.status);
                            this._timer = setInterval(() => {
                                if (this.status === "playing") {
                                    this.timePass += 1;
                                    this._eventEmitter.emit("timeupdated", this.timePass);
                                }
                            }, 1000);

                            return blocks.revealBlock(blockRecord);
                        }
                    });
            }
            else {
                this.status = "playing";
                this.mode = this.flagMode ? "quick" : "regular";
                this._eventEmitter.emit("statuschanged", this.status);
                this._timer = setInterval(() => {
                    if (this.status === "playing") {
                        this.timePass += 1;
                        this._eventEmitter.emit("timeupdated", this.timePass);
                    }
                }, 1000);

                return Promise.resolve(blocks.revealBlock(blockRecord));
            }
        }

        const block = blocks.get(blockRecord);
        // click on flag
        if (block.flag) {
            // do nothing
        }
        // click on hidden block
        else if (block.hidden) {
            if (block.type === 'mine') {
                blocks = this.revealMine();
            }
            else {
                blocks = blocks.revealBlock(blockRecord, () => this.revealMine());
            }
        }
        // click on number, expand surrounding block
        else if (!block.hidden) {
            blocks = blocks.expandBlock(blockRecord, () => this.revealMine());
        }

        this.checkGame(blocks);

        return Promise.resolve(blocks);
    },

    /* set flag to a block */
    rightClickOn: function(blockRecord) {
        let blocks = this.blocks;
        const block = blocks.get(blockRecord);

        if (block.hidden) {
            blocks = blocks.setFlag(blockRecord);

            this.minesRemaining += blocks.get(blockRecord).flag ? (this.minesRemaining <= 0 ? 0 : -1) : 1;
        }
        else {
            blocks = blocks.expandBlock(blockRecord, () => this.revealMine());
        }

        this.checkGame(blocks);

        return Promise.resolve(blocks);
    },

    /* perform single click,
       reveal block for regular mode,
       set flag for quick mode */
    singleClick: function(blockRecord) {
        if (this.status !== "win" && this.status !== "lose") {
            if (this.mode === "regular") {
                return this.clickOn(new BlockRecord(blockRecord));
            }
            else if (this.mode === "quick") {
                return this.rightClickOn(new BlockRecord(blockRecord));
            }
        }

        return Promise.resolve(this.blocks);
    },
    /* perform right click,
       reveal block for quick mode,
       set flag for regular mode */
    rightClick: function(blockRecord) {
        if (this.status !== "win" && this.status !== "lose") {
            if (this.mode === "regular") {
                return this.rightClickOn(new BlockRecord(blockRecord));
            }
            else if (this.mode === "quick") {
                return this.clickOn(new BlockRecord(blockRecord));
            }
        }

        return Promise.resolve(this.blocks);
    },

    /* check if game is over, emit the event */
    checkGame: function(blocks) {
        if (blocks.checkGame()) {
            this.status = "win";
            this._eventEmitter.emit("statuschanged", this.status);
            clearInterval(this._timer);
            return true;
        }

        return false;
    },


    /* --------------------- SOLVER --------------------- */

    /* get all the revealed blocks with number > 0
       and have surrounding hidden blocks */
    getEdgeBlockRecord: function(blocks) {
        return blocks
            .filter(block => block.type === "normal" && block.mines && !block.hidden)
            .filter( (block, record) =>
                blocks.getSurrounding(record).some(b => b.hidden && !b.flag)
            );
    },
    solveByRref: function(blocks, edges) {
        return new Promise(
            resolve => {
                /*
                 *  inspired by the great article by @ROBERT MASSAIOLI
                 *  https://massaioli.wordpress.com/2013/01/12/solving-minesweeper-with-matricies/
                 */
                let changed = false;

                const edgeBlocks = blocks.filter(block => block.hidden).keySeq().toList();

                const matrix = edges.map( (block, edge) => {
                    const hiddenBlock = blocks.getSurrounding(edge)
                        .filter(b => b.hidden && !b.flag);
                    return edgeBlocks.map(unknown => (
                        hiddenBlock.find( (b, r) => Immutable.is(r, unknown)) ? 1 : 0
                    )).toList().push(
                        block.mines - blocks.getSurrounding(edge).filter(b => b.hidden && b.flag).size
                    );
                }).toList();

                const remainBlocks = blocks.filter(block => block.hidden && !block.flag).keySeq().toList();

                const remainCondition = List([
                    ...edgeBlocks.map(record =>
                        remainBlocks.find(r => Immutable.is(record, r) ) ? 1 : 0
                    ),
                    this.mines - blocks.filter(block => block.flag && block.hidden).size
                ]);

                const rrefMatrix = rref(matrix.push(remainCondition));

                const bounds = rrefMatrix.map(row =>
                    row.slice(0, row.size - 1)
                        .reduce( (bound, col) => (
                            List([
                                bound.get(0) + (col === 1 ? 1 : 0), // maximum bound
                                bound.get(1) + (col === -1 ? -1 : 0) // minimum bound
                            ])
                        ), List([0, 0]))
                        .push(row.last()) // concat with the augmented column
                );

                bounds.forEach( (bound, row) => {
                    if (bound.get(0) === bound.get(2) || bound.get(1) === bound.get(2)) {
                        const boundCondition = bound.get(0) === bound.get(2) ? 1 : -1;
                        rrefMatrix.get(row).slice(0, rrefMatrix.get(row).size - 1)
                            .forEach( (col, i) => {
                                if (col === boundCondition) {
                                    // console.log('flag', edgeBlocks[i]);
                                    blocks = blocks.update(edgeBlocks.get(i), b => b.set("flag", true));
                                    changed = true;
                                }
                                else if (col === -boundCondition) {
                                    // console.log('reveal', edgeBlocks[i]);
                                    blocks = blocks.revealBlock(edgeBlocks.get(i));
                                    changed = true;
                                }
                            });
                    }
                });

                if (!blocks.checkGame()) {
                    if (changed) {
                        setTimeout(() => {
                            resolve(this.solver(blocks));
                        }, 0);
                    }
                    else {
                        resolve(false);
                    }
                }
                else {
                    resolve(true);
                }
            }
        );
    },

    solver: function(blocks) {
        return new Promise(
            resolve => {
                const edges = this.getEdgeBlockRecord(blocks);
                let changed = false;

                // set flag to those satisfy the mines number
                edges.forEach( (block, record) => {
                    const surroundingHidden = blocks.getSurrounding(record)
                        .filter(b => b.hidden);

                    if (block.mines === surroundingHidden.size) {
                        surroundingHidden.forEach( (b, r) => {
                            blocks = blocks.update(
                                r,
                                b => b.set("flag", true)
                            );
                        });
                        changed = true;
                    }
                });

                // reveal those edge blocks being set flag.
                edges.forEach( (block, record) => {
                    const surrounding = blocks.getSurrounding(record);

                    if (surrounding.filter(b => b.hidden && b.flag).size === block.mines) {
                        surrounding.filter(b => b.hidden && !b.flag)
                            .forEach( (b, r) => {
                                blocks = blocks.revealBlock(r);
                            });
                        changed = true;
                    }
                });

                if (changed) {
                    setTimeout(() => {
                        resolve(this.solver(blocks));
                    }, 0);
                }
                else {
                    if (!blocks.checkGame()) {
                        setTimeout(() => {
                            resolve(this.solveByRref(blocks, edges));
                        }, 0);
                    }
                    else {
                        resolve(true);
                    }
                }
            }
        );
    }
});

export default Minesweeper;
