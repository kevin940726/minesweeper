import { createAction } from 'redux-actions';
import { BlockRecord } from '../minesweeper';
import Cookie from 'cookies-js';

export const handleClick = createAction('HANDLE_CLICK', (row, col) => (
	new BlockRecord({ row, col })
));

export const handleFlag = createAction('HANDLE_FLAG', (row, col) => (
	new BlockRecord({ row, col })
));

export const toggleMode = createAction('TOGGLE_MODE');

export const restartGame = createAction('RESTART_GAME');

export const updateTime = createAction('UPDATE_TIME');

export const saveConfig = createAction('SAVE_CONFIG', (value, target) => {
	Cookie.set(target, parseInt(value));
	return { value: parseInt(value) || 0, target };
});

export const togglePanel = createAction('TOGGLE_PANEL');

export const toggleFlagMode = createAction('TOGGLE_FLAG_MODE', () => {
	Cookie.set("flagMode", Cookie.get("flagMode") === "true" ? "false" : "true");
});
