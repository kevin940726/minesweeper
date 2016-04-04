import { connect } from 'react-redux';
import configPanel from '../components/ConfigPanel';
import { saveConfig, togglePanel } from '../actions';

const mapStateToProps = (state) => ({
	rows: state.config.rows,
	cols: state.config.cols,
	mines: state.config.mines
});

const mapDispatchToProps = (dispatch) => ({
	saveConfig: (e, target) => {
		console.log(e.target.value, target);
		dispatch(saveConfig(e.target.value, target));
	},

	togglePanel: (e) => {
		e.preventDefault();
		dispatch(togglePanel());
	}
});

const ConfigPanel = connect(mapStateToProps, mapDispatchToProps)(configPanel);

export default ConfigPanel;
