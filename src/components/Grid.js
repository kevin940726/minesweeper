import React from 'react';
import Radium from 'radium';

const style = {
	base: {
		display: "flex",
		height: "30px",
		width: "30px",
		alignItems: "center",
		justifyContent: "center",
		fontSize: "20px",
		margin: "5px",
		boxSizing: "border-box",
		lineHeight: "28px", // fuck you, waste 4 hours on this shit...
		cursor: "default",
		paddingBottom: "2px",
		transition: "background-color 0.1s ease-out",
		backgroundColor: "#FFF",
		border: "1px solid #EEE",
	},

	hidden: {
		backgroundColor: "#EEE",
		border: 0,
		":hover": {
			backgroundColor: "#F5F5F5"
		}
	}
};

const Grid = ({ row, col, block, handleClick, handleFlag }) => (
	<div onClick={handleClick.bind(null, row, col)}
		onContextMenu={(e) => {
			e.preventDefault();
			handleFlag(row, col);
		}}
		style={[
			style.base,
			block.hidden && style.hidden
		]}
	>
		{block.flag ? "🚩" :
			(block.hidden ? " " :
				(block.type === "mine" ? "💣" :
					(block.mines || " ")
				)
			)}
	</div>
);

export default Radium(Grid);
