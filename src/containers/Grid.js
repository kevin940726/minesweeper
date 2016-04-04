import { connect } from 'react-redux';
import grid from '../components/Grid';
import { BlockRecord } from '../minesweeper';
import { handleClick, handleFlag } from '../actions';
import { createSelector } from 'reselect';

const blockSelector = createSelector(
	state => state.mw.blocks,
	(state, ownProps) => ownProps,
	(blocks, ownProps) => blocks.get(new BlockRecord({
		row: ownProps.row,
		col: ownProps.col
	}))
);

const mapStateToProps = (state, ownProps) => ({
	block: blockSelector(state, ownProps)
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
