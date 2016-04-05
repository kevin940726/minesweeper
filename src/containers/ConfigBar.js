import { connect } from 'react-redux';
import { togglePanel, toggleMode } from '../actions';
import configBar from '../components/ConfigBar';

const mapStateToProps = (state) => ({
	mode: state.mw.mode
});

const mapDispatchToProps = (dispatch) => ({
	togglePanel: (e) => {
		e.preventDefault();
		dispatch(togglePanel());
	},

	toggleMode: (e) => {
		e && e.preventDefault();
		dispatch(toggleMode());
	}
});

const ConfigBar = connect(mapStateToProps, mapDispatchToProps)(configBar);

export default ConfigBar;
