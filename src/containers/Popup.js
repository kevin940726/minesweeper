import { connect } from 'react-redux';
import popup from '../components/Popup';
import { createSelector } from 'reselect';

const statusSelector = state => state.mw.status;

const displaySelector = createSelector(
	statusSelector,
	status => status === "win" || status === "lose"
);

const textSelector = createSelector(
	statusSelector,
	status => status
);

const mapStateToProps = (state) => ({
	display: displaySelector(state),
	text: textSelector(state)
});

const mapDispatchToProps = (dispatch) => ({

});

const Popup = connect(mapStateToProps, mapDispatchToProps)(popup);

export default Popup;
