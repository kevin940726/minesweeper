import { createAction } from 'redux-actions';
import { BlockRecord } from '../minesweeper';
import Cookie from 'cookies-js';

export const setGame = createAction('SET_GAME');

export const toggleLoading = createAction('TOGGLE_LOADING');

export const handleClick = (row, col) => (
	(dispatch, getState) => {
		// dispatch(toggleLoading());
		getState().mw.singleClick({ row, col }).then(mw => {
			// dispatch(toggleLoading());
			return dispatch(setGame(mw));
		});
	}
);

// export const handleClick = createAction('HANDLE_CLICK', (row, col) => (
// 	mw.singleClick({ row, col })
// ));

export const handleFlag = (row, col) => (
	(dispatch, getState) => getState().mw.rightClick({ row, col }).then(mw => dispatch(setGame(mw)))
);

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

export const toggleCheckIsSolvable = createAction('TOGGLE_CHECK_IS_SOLVABLE', () => {
	Cookie.set("checkIsSolvable", Cookie.get("checkIsSolvable") === "true" ? "false" : "true");
});
