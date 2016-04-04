import React from 'react';
import Radium from 'radium';

const style = {
	base: {
		position: "fixed",
		display: "flex",
		flexDirection: "column",
		top: "50%",
		left: "50%",
		transform: "translate(-50%, -50%)",
		boxShadow: "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)",
		padding: "30px 20px",
		backgroundColor: "#FFF",
		zIndex: "10",
		transition: "transform 0.5s ease-out"
	},
	label: {
		fontSize: "20px",
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: "15px",
		fontFamily: "'AppleColorEmoji', 'Roboto', sans-serif"
	},
	input: {
		flexBasis: "50px",
		width: "100px",
		height: "30px",
		marginLeft: "20px",
		fontFamily: "'Roboto', sans-serif",
		padding: "5px 10px",
		fontSize: "16px",
		boxSizing: "border-box",
		textAlign: "center"
	},
	submit: {
		padding: "5px 10px",
		border: "1px solid #EEE",
		backgroundColor: "#FFF",
		display: "inline-block",
		fontFamily: "'AppleColorEmoji', 'Roboto', sans-serif",
		fontSize: "20px",
		cursor: "pointer",
		transition: "border 0.2s ease-out",
		":hover": {
			border: "1px solid #CCC"
		}
	}
};

const ConfigPanel = ({ rows, cols, mines, saveConfig, togglePanel }) => (
	<form style={style.base} onSubmit={togglePanel}>
		<label style={style.label}>
			↔️
			<input type="tel" onChange={e => saveConfig(e, "rows")} style={style.input} value={rows} />
		</label>
		<label style={style.label}>
			↕️
			<input type="tel" onChange={e => saveConfig(e, "cols")} style={style.input} value={cols} />
		</label>
		<label style={style.label}>
			💣
			<input type="tel" onChange={e => saveConfig(e, "mines")} style={style.input} value={mines} />
		</label>

		<input style={style.submit} type="submit" value="👌" />
	</form>
);

export default Radium(ConfigPanel);
