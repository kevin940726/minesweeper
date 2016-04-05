import React from 'react';
import Radium from 'radium';

const style = {
	base: {
		display: "flex",
		height: "30px",
		lineHeight: "30px",
		marginBottom: "-10px",
		justifyContent: "space-between",
		alignItems: "center"
	},
	btn: {
		textDecoration: "none",
		fontFamily: "'AppleColorEmoji', 'Roboto', sans-serif",
		fontSize: "18px",
		margin: "0 4px",
		width: "30px",
		height: "30px",
		lineHeight: "18px",
		padding: "5px 5px 5px 4px",
		boxSizing: "border-box",
		backgroundColor: "#FFF",
		transition: "background-color 0.2s ease-out",

		":hover": {
			backgroundColor: "#EEE"
		}
	}
};

const ConfigBar = ({ mw, mode, togglePanel, toggleMode }) => (
	<div style={style.base}>
		<a key="panel" style={style.btn} href="#" onClick={togglePanel}>⚙</a>
		<a key="mode"  style={style.btn} href="#" onClick={toggleMode}>
			{mode === "regular" ? "🖱" : "🚩"}
		</a>
	</div>
);

export default Radium(ConfigBar);
