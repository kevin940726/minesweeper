import { connect } from 'react-redux';
import controlBar from '../components/ControlBar';
import { createSelector } from 'reselect';
import { restartGame, updateTime, updateHighScore } from '../actions';

const statusSelector = state => state.mw.status;

const textSelector = createSelector(
	statusSelector,
	status => status === "win" ? "grin" : (status === "lose" ? "cry" : "blush")
);

const minesRemainingSelector = createSelector(
	state => state.mw.minesRemaining,
	minesRemaining => minesRemaining
);

const timePassSelector = createSelector(
	state => state.timePass,
	timePass => "000".substring(0, 3 - timePass.toString().length) + timePass.toString()
);

const mapStateToProps = (state) => ({
	minesRemaining: minesRemainingSelector(state),
	text: textSelector(state),
	timePass: timePassSelector(state),
	mw: state.mw
});

const mapDispatchToProps = (dispatch) => ({
	restartGame: (e) => {
		e.preventDefault();
		dispatch(restartGame());
	},

	updateTime: timePass => {
		dispatch(updateTime(timePass));
	}
});

const ControlBar = connect(mapStateToProps, mapDispatchToProps)(controlBar);

export default ControlBar;
