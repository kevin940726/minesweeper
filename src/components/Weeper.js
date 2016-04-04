import React from 'react';
import Grid from '../containers/Grid';
import Popup from '../containers/Popup';
import ControlBar from '../containers/ControlBar';
import { BlockRecord } from '../minesweeper';
import Radium from 'radium';

const style = {
	display: "block",
	position: "fixed",
	left: "50%",
	top: "50%",
	transform: "translate(-50%, -50%)",
	padding: "30px",
	boxShadow: "0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)",
	backgroundColor: "#FFF"
};

const rowStyle = {
	display: "flex",
	justifyContent: "center",
	alignItems: "center",
	flexDirection: "row"
};

let Row = ({ cols, row }) => (
	<div style={rowStyle}>
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
	<div style={style}>
		<ControlBar />
		{new Array(rows).fill(0).map((cur, row) => (
			<Row key={"row" + row} cols={cols} row={row} />
		))}
		{/*<Popup />*/}
	</div>
);

export default Radium(Weeper);
