import { createAction } from 'redux-actions';
import { BlockRecord } from '../minesweeper';

export const handleClick = createAction('HANDLE_CLICK', (row, col) => (
	new BlockRecord({ row, col })
));

export const handleFlag = createAction('HANDLE_FLAG', (row, col) => (
	new BlockRecord({ row, col })
));

export const changeMode = createAction('CHANGE_MODE');

export const restartGame = createAction('RESTART_GAME');

export const updateTime = createAction('UPDATE_TIME');
