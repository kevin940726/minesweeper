import { connect } from 'react-redux';
import weeper from '../components/Weeper';
import { handleClick, handleFlag } from '../actions';

const mapStateToProps = (state) => ({
	rows: state.mw.rows,
	cols: state.mw.cols,
	showPanel: state.config.show
});

const Weeper = connect(mapStateToProps)(weeper);

export default Weeper;
