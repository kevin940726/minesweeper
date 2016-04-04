import { connect } from 'react-redux';
import { togglePanel } from '../actions';
import configBar from '../components/ConfigBar';

const mapStateToProps = (state) => ({
	showPanel: state.config.panel
});

const mapDispatchToProps = (dispatch) => ({
	togglePanel: (e) => {
		e.preventDefault();
		dispatch(togglePanel());
	}
});

const ConfigBar = connect(null, mapDispatchToProps)(configBar);

export default ConfigBar;
