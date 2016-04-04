import { handleActions } from 'redux-actions';
import { BlockRecord, Block } from '../minesweeper';

const reducers = handleActions({
	HANDLE_CLICK: (state, action) => {
		if (state.mw.status === "ready") {
			state.mw.clickOn(action.payload);
		}
		else if (state.mw.status === "playing") {
			state.mw.setFlag(action.payload);
		}

		return {
			...state,
			mw: state.mw
		};
	},

	HANDLE_FLAG: (state, action) => {
		if (state.mw.status === "playing") {
			state.mw.clickOn(action.payload);
		}
		else if (state.mw.status === "ready") {
			state.mw.setFlag(action.payload);
		}

		return {
			...state,
			mw: state.mw
		};
	},

	CHANGE_MODE: (state, action) => ({
		...state,
		mode: action.payload
	}),

	RESTART_GAME: (state) => ({
		...state,
		mw: state.mw.init(state.config.rows, state.config.cols, state.config.mines)
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
	})
});

export default reducers;
