import { connect } from 'react-redux';
import grid from '../components/Grid';
import { BlockRecord } from '../minesweeper';
import { handleClick, handleFlag } from '../actions';

const mapStateToProps = (state, ownProps) => ({
	block: state.mw.blocks.get(new BlockRecord({
		row: ownProps.row,
		col: ownProps.col
	}))
});

const mapDispatchToProps = (dispatch) => ({
	handleClick: (row, col) => {
		dispatch(handleClick(row, col));
	},

	handleFlag: (row, col) => {
		dispatch(handleFlag(row, col));
	}
});

const Grid = connect(mapStateToProps, mapDispatchToProps)(grid);

export default Grid;
