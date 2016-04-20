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
	},
	loading: {
		position: "relative",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		height: "100%",
		width: "100%",
		filter: "blur(0px)",
		transition: "filter 0.5s ease-out"
	},
	isLoading: {
		filter: "blur(5px)"
	},

	loadingIcon: {
		display: "block",
		fontFamily: "'AppleColorEmoji', 'Roboto', sans-serif",
		fontSize: "30px",
		textAlign: "center",
		position: "absolute",
		top: "50%",
		left: 0,
		right: 0,
		margin: "auto",
		transform: "translateY(-50%)"
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

let LoadingWrapper = ({ isLoading, children }) => (
	<div style={[ style.loading, isLoading && style.isLoading ]}>
		{children}
	</div>
);
LoadingWrapper = Radium(LoadingWrapper);

let LoadingIcon = ({ isLoading }) => (
	<span style={style.loadingIcon}>⏳</span>
);
LoadingIcon = Radium(LoadingIcon);

const Weeper = ({ rows, cols, isLoading }) => (
	<div style={[ style.base ]}>
		<LoadingWrapper isLoading={isLoading}>
			<ControlBar />
			{new Array(rows).fill(0).map((cur, row) => (
				<Row key={"row" + row} cols={cols} row={row} />
			))}
			<ConfigBar />
			<ConfigPanel />
		</LoadingWrapper>
		{ isLoading && (<LoadingIcon />) }
	</div>
);

export default Radium(Weeper);
