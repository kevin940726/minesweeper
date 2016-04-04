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
		mw: state.mw.init()
	}),

	UPDATE_TIME: (state, action) => ({
		...state,
		timePass: state.mw.timePass
	})
});

export default reducers;
