import React from 'react';
import Grid from '../containers/Grid';
import ControlBar from '../containers/ControlBar';
import ConfigBar from '../containers/ConfigBar';
import ConfigPanel from '../containers/ConfigPanel';
import { BlockRecord } from '../minesweeper';
import Radium from 'radium';

const style = {
	base: {
		display: "block",
		position: "absolute",
		left: "50%",
		top: "50%",
		transform: "translate(-50%, -50%)",
		padding: "20px 30px",
		boxShadow: "0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)",
		backgroundColor: "#FFF"
	},
	row: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		flexDirection: "row",
		backgroundColor: "#FFF"
	}
};

let Row = ({ cols, row }) => (
	<div style={style.row}>
		{new Array(cols).fill(0).map((cur, col) => {
			return (
				<Grid key={`${row}${col}`}
					row={row}
					col={col}
				>
				</Grid>
			);
		})}
	</div>
);
Row = Radium(Row);

const Weeper = ({ rows, cols }) => (
	<div style={style.base}>
		<ControlBar />
		{new Array(rows).fill(0).map((cur, row) => (
			<Row key={"row" + row} cols={cols} row={row} />
		))}
		<ConfigBar />
		<ConfigPanel />
	</div>
);

export default Radium(Weeper);
