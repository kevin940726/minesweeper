import React from 'react';

const style = {
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
	paddingBottom: "2px"
};

const Grid = ({ row, col, block, handleClick, handleFlag }) => (
	<div onClick={handleClick.bind(null, row, col)}
		onContextMenu={(e) => {
			e.preventDefault();
			handleFlag(row, col);
		}}
		style={{
			...style,
			backgroundColor: block.hidden ? "#EEE" : "#FFF",
			border: block.hidden ? 0 : "1px solid #EEE"
		}}
	>
		{block.flag ? "🚩" :
			(block.hidden ? " " :
				(block.type === "mine" ? "💣" :
					(block.mines || " ")
				)
			)}
	</div>
);

export default Grid;
