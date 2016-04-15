import { handleActions } from 'redux-actions';
import { BlockRecord, Block } from '../minesweeper';

const reducers = handleActions({
	HANDLE_CLICK: (state, action) => {
		state.mw.singleClick(action.payload);

		return {
			...state,
			mw: state.mw
		};
	},

	HANDLE_FLAG: (state, action) => {
		state.mw.rightClick(action.payload);

		return {
			...state,
			mw: state.mw
		};
	},

	TOGGLE_MODE: (state, action) => {
		state.mw.mode = state.mw.mode === "regular" ? "quick" : "regular";

		return {
			...state,
			mw: state.mw
		};
	},

	RESTART_GAME: (state) => ({
		...state,
		mw: state.mw.reset(state.config.rows, state.config.cols, state.config.mines, state.config.flagMode)
	}),

	UPDATE_TIME: (state, action) => ({
		...state,
		timePass: state.mw.timePass
	}),

	SAVE_CONFIG: (state, action) => ({
		...state,
		config: {
			...state.config,
			[action.payload.target]: action.payload.value
		}
	}),

	TOGGLE_PANEL: (state) => ({
		...state,
		config: {
			...state.config,
			show: !state.config.show
		}
	}),

	TOGGLE_FLAG_MODE: (state) => {
		state.mw.flagMode = !state.mw.flagMode;
		return {
			...state,
			mw: state.mw,
			config: {
				...state.config,
				flagMode: state.mw.flagMode
			}
		};
	},
	TOGGLE_CHECK_IS_SOLVABLE: (state) => {
		state.mw.checkIsSolvable = !state.mw.checkIsSolvable;
		return {
			...state,
			mw: state.mw,
			config: {
				...state.config,
				checkIsSolvable: state.mw.checkIsSolvable
			}
		};
	}
});

export default reducers;
