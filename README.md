# minesweeper
Simple minesweeper game built with React, Redux.

[Play Now!](https://kevin940726.github.io/minesweeper)

![screenshot](screenshot.png)

---

### Features

- [x] Custom game board and three different major difficulty.
- [x] Counting Time.
- [x] Mines left.
- [x] Set flags.
- [x] Quick mode and mode switch.
- [x] Settings save in cookie.

### How to Play
Seriously !?

### API
You can find the logic of the game in `./src/minesweeper.js`. If you don't like the UI or you want to make a enhancement, import it to your custom UI.

```js
import Minesweeper, { Block, BlockRecord } from './src/minesweeper.js';
```

#### `Minesweepr()`:
Create the game board, load initial data. There are some game data you can get:

- `rows`: _(Int)_ Game board rows.
- `cols`: _(Int)_ Game board columns.
- `mines`: _(Int)_ Game board mines.
- `minesRemaining`: _(Int)_ How many mines left without flagged.
- `blocks`: _(Immutable Map)_ An immutable Map data for each blocks in the game board.
- `status`: _(String)_
	* `ready`: Ready to play the game before first click.
	* `playing`: Playing the game after first click.
	* `win`: Clear the game board without hitting mines.
	* `lose`: Hit a mine.
- `timePass`: _(Int)_ Current time pass in the game.
- `mode`: _(String)_
	* `regular`: Regular game mode. Single click to reveal the block, right click to set a flag.
	* `quick`: Quick mode. Single click to set a flag, while right click will reveal the block.
- `flagMode`: _(Boolean)_ Quick mode for the game or not

```js
const game = Minesweeper();
```

#### `Minesweepr::init(rows, cols, mines, quickMode)`:
Initialize and start the game. Turning `quickMode` on will make the first click a simple click, and after that will be setting flags.

```js
game.init(9, 9, 10, false);
```

#### `Block`:
An immutable Record store in each block. Check out [immutable.js](https://facebook.github.io/immutable-js/) for methods.

```js
const Block = Record({
    type: 'normal',
    mines: 0,
    hidden: true,
    flag: false
});
```

#### `BlockRecord`:
An immutable Record indicate the row and column of the block.

```js
const BlockRecord = Record({
	row: 0,
	col: 0
});
```

#### `Minesweeper::singleClick(BlockRecord)`:
Perform a single click on a block. Set a flag if `mode` === `quick`, else reveal the block.

#### `Minesweeper::rightClick(BlockRecord)`:
Perform a right click on a block. Reveal the block if `mode` === `quick`, else set a flag.

### TODO

- [ ] Record high score.
- [ ] Cleverly first click init.
- [ ] Mobile friendly.
- [ ] Game solver (_hard_, for non-guessing game).

### Contribute
Issues, PRs, and all the advise and discussion are very welcome!

### Special Thanks

- [muan/emoji](https://github.com/muan/emoji): Great cross-platform emoji collection!

### License
[MIT](./LICENSE)
