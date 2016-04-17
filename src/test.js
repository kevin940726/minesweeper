import Minesweeper, { BlockRecord } from './minesweeper';

const mw = Minesweeper();
const iterate = 100;

const counter = {
	win: 0,
	lose: 0
};

const now = new Date();

const testset = new Array(iterate).fill(0).map(() => {
	mw.blocks = mw.reset(16, 16, 40, true, false);
	counter[mw.solver(
		mw.clickOn(new BlockRecord({ row: 4, col: 4}))
	) ? 'win' : 'lose'] += 1;
});

const passtime = new Date() - now;

console.log('---------------------------------');
console.log('time: ', passtime);
console.log(counter);
console.log('---------------------------------');
console.log('avg time: ', passtime / iterate);
console.log(counter.win / iterate * 100 + '%');
console.log('---------------------------------');
console.log('waiting time: ', passtime / counter.win );
console.log('---------------------------------');
