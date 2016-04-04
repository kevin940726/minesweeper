import { Map, Record } from 'immutable';
import { EventEmitter } from 'events';

export const BlockRecord = Record({ row: 0, col: 0 });
export const Block = Record({
    type: 'normal',
    mines: 0,
    hidden: true,
    flag: false
});

const randomNumberGenerator = ({
    start = 0,
    end,
    number = 1
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

    _timer: null,
    _eventEmitter: new EventEmitter(),
    on: function(event, callback) {
        return this._eventEmitter.on(event, callback);
    },

    init: function(rows = 9, cols = 9, mines = 10) {
        // initialize variables
        this.rows = rows;
        this.cols = cols;
        this.mines = mines;
        this.minesRemaining = this.mines;
        this.blocks = Map();
        this.status = "ready";
        this.timePass = 0;
        clearInterval(this._timer);
        this._eventEmitter.emit("statuschanged", this.status);

        // initialize blocks
        new Array(this.rows).fill(0).map((cur, row) => (
            new Array(this.cols).fill(0).map((cur, col) => {
                this.blocks = this.blocks.set(
                    new BlockRecord({ row, col }),
                    new Block()
                );
            })
        ));

        // initialize random mines
        randomNumberGenerator({ end: this.rows * this.cols, number: this.mines })
            .forEach(index => {
                const blockRecord = new BlockRecord({
                    row: Math.floor(index / this.cols),
                    col: index % this.cols
                });

                this.blocks = this.blocks.set(blockRecord, new Block({
                    type: 'mine'
                }));

                // initialize numbers of surronding mines.
                this.getSurrounding(blockRecord)
                    .forEach(record => {
                        this.initSurrounding(record);
                    });
            });

        return this;
    },

    getSurrounding: function(blockRecord) {
        return [].concat(...[-1, 0, 1].map(i => (
            [-1, 0, 1].map(j => (new BlockRecord({
                row: blockRecord.row + i,
                col: blockRecord.col + j
            })))
        ))).filter( ({row, col}) => (
            row >= 0 && col >= 0 && row < this.rows && col < this.cols && [row, col] !== [blockRecord.row, blockRecord.col]
        ));
    },

    initSurrounding: function(blockRecord) {
        const block = this.blocks.get(blockRecord);
        this.blocks = this.blocks.set(
            blockRecord,
            new Block({
                type: block ? block.type : 'normal',
                mines: block ? block.mines + 1 : 1
            })
        );

        return this;
    },

    revealBlock: function(blockRecord) {
        const block = this.blocks.get(blockRecord);

        if (block.type === "normal") {
            this.blocks = this.blocks.update(
                blockRecord,
                b => b.set("hidden", false)
            );

            if (!block.mines) {
                this.getSurrounding(blockRecord)
                    .filter(record => this.blocks.get(record).hidden)
                    .forEach(record => {
                        this.revealBlock(record);
                    });
            }
        }

        return this;
    },

    clickOn: function(blockRecord) {
        const block = this.blocks.get(blockRecord);

        if (this.status === "ready") {
            if (!this.firstCheck(blockRecord)) {
                this.init(this.rows, this.cols, this.mines);
                this.clickOn(blockRecord);
                return this.blocks;
            }

            this.status = "playing";
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
        // click on mine
        else if (block.type === "mine") {
            this.status = "lose";
            this._eventEmitter.emit("statuschanged", this.status);

            clearInterval(this._timer);

            this.blocks.keySeq()
                .toArray()
                .filter(key => this.blocks.get(key).type === "mine")
                .forEach(mine => {
                    this.blocks = this.blocks.update(
                        mine,
                        b => b.set("hidden", false)
                    );
                });
        }
        // click on hidden block
        else if (block.hidden) {
            this.revealBlock(blockRecord);
        }
        // click on number, expand surrounding block
        else if (!block.hidden) {
            this.expandBlock(blockRecord);
        }

        this.checkGame();
        return this;
    },

    expandBlock: function(blockRecord) {
        const block = this.blocks.get(blockRecord);

        if (block.mines && this.getSurrounding(blockRecord).filter(record => this.blocks.get(record).flag).length === block.mines) {
            this.getSurrounding(blockRecord)
                .filter(record => this.blocks.get(record).hidden && !this.blocks.get(record).flag)
                .forEach(record => {
                    this.revealBlock(record);
                });
        }

        return this;
    },

    firstCheck: function(blockRecord) {
        const block = this.blocks.get(blockRecord);

        if (this.blocks.some(block => !block.mines)) {
            return !block.mines;
        }
        else {
            return block.type !== "mine";
        }
    },

    setFlag: function(blockRecord) {
        const block = this.blocks.get(blockRecord);

        if (block.hidden) {
            this.blocks = this.blocks.set(
                blockRecord,
                block.set("flag", !block.flag)
            );

            this.minesRemaining += block.flag ? 1 : (this.minesRemaining <= 0 ? 0 : -1);
        }
        else {
            this.expandBlock(blockRecord);
        }

        this.checkGame();
        return this;
    },

    checkGame: function() {
        if (this.blocks
                .filter(block => block.type === "normal")
                .every(block => !block.hidden)
        ) {
            this.status = "win";
            this._eventEmitter.emit("statuschanged", this.status);
            clearInterval(this._timer);
        }

        return this;
    }
});

export default Minesweeper;
