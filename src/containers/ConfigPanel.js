import { connect } from 'react-redux';
import configPanel from '../components/ConfigPanel';
import { saveConfig, togglePanel, toggleFlagMode } from '../actions';

const mapStateToProps = (state) => ({
	rows: state.config.rows,
	cols: state.config.cols,
	mines: state.config.mines,
	show: state.config.show,
	flagMode: state.config.flagMode
});

const mapDispatchToProps = (dispatch) => ({
	saveConfig: (e, target) => {
		dispatch(saveConfig(e.target.value, target));
	},

	togglePanel: (e) => {
		e.preventDefault();
		dispatch(togglePanel());
	},

	toggleFlagMode: () => {
		dispatch(toggleFlagMode());
	},

	saveAllConfig: (rows, cols, mines) => {
		dispatch(saveConfig(rows, "rows"));
		dispatch(saveConfig(cols, "cols"));
		dispatch(saveConfig(mines, "mines"));
	}
});

const ConfigPanel = connect(mapStateToProps, mapDispatchToProps)(configPanel);

export default ConfigPanel;
