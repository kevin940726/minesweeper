import { connect } from 'react-redux';
import controlBar from '../components/ControlBar';
import { createSelector } from 'reselect';
import { restartGame, updateTime } from '../actions';

const statusSelector = state => state.mw.status;

const textSelector = createSelector(
	statusSelector,
	status => status === "win" ? "😁" : (status === "lose" ? "😢" : "😊")
);

const minesRemainingSelector = createSelector(
	state => state.mw.minesRemaining,
	minesRemaining => minesRemaining
);

const timePassSelector = createSelector(
	state => state.mw.timePass,
	timePass => "0000".substring(0, 4 - timePass.toString().length) + timePass.toString()
);

const mapStateToProps = (state) => ({
	minesRemaining: minesRemainingSelector(state),
	text: textSelector(state),
	timePass: timePassSelector(state),
	on: state.mw.on
});

const mapDispatchToProps = (dispatch) => ({
	restartGame: (e) => {
		e.preventDefault();
		dispatch(restartGame());
	},

	updateTime: () => {
		dispatch(updateTime());
	}
});

const ControlBar = connect(mapStateToProps, mapDispatchToProps)(controlBar);

export default ControlBar;
