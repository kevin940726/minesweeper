import React from 'react';
import Radium from 'radium';

const style = {
	base: {
		position: "fixed",
		display: "flex",
		flexDirection: "column",
		top: "55%",
		left: "50%",
		transform: "translate(-50%, -50%)",
		boxShadow: "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)",
		padding: "30px 20px",
		backgroundColor: "#FFF",
		zIndex: "-1",
		opacity: "0",
		transition: "top 0.3s ease-out, opacity 0.3s ease-out, z-index 0.3s ease-out"
	},
	show: {
		zIndex: "10",
		opacity: "1",
		top: "50%"
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
	},

	upperGroup: {
		display: "flex",
		alignItems: "center",
		marginBottom: "10px"
	},
	checkbox: {
		padding: "5px 5px 5px 3px",
		backgroundColor: "#FFF",
		transition: "background-color 0.2s ease-out",
		width: "30px",
		boxSizing: "border-box",
		height: "30px",
		lineHeight: "22px",
		cursor: "pointer",
		marginBottom: "0px",
		":hover": {
			backgroundColor:  "#EEE"
		}
	},
	line: {
		height: "30px",
		width: "1px",
		backgroundColor: "#EEE",
		margin: "0px 10px"
	},
	level: {
		padding: "5px",
		lineHeight: "20px"
	}
};

const ConfigPanel = ({ show, rows, cols, mines, flagMode, saveConfig, saveAllConfig, togglePanel, toggleFlagMode }) => (
	<form style={[ style.base, show && style.show ]} onSubmit={togglePanel}>
		<div style={style.upperGroup}>
			<label key="flagModeLabel" style={[ style.label, style.checkbox ]}>
				{flagMode ? "⚡" : "🐌"}
				<input key="flagMode" type="checkbox" onChange={e => toggleFlagMode()} style={{display: 'none'}} checked={flagMode}></input>
			</label>
			<div style={style.line}></div>
			<a key="beginner" style={[ style.checkbox, style.level ]} onClick={e => saveAllConfig(9, 9, 10)}>🌱</a>
			<a key="intermediate" style={[ style.checkbox, style.level ]} onClick={e => saveAllConfig(16, 16, 40)}>☘</a>
			<a key="expert" style={[ style.checkbox, style.level ]} onClick={e => saveAllConfig(16, 30, 99)}>🍀</a>
		</div>
		<label style={style.label}>
			↔️
			<input key="rows" type="tel" onChange={e => saveConfig(e, "rows")} style={style.input} value={rows} />
		</label>
		<label style={style.label}>
			↕️
			<input key="cols" type="tel" onChange={e => saveConfig(e, "cols")} style={style.input} value={cols} />
		</label>
		<label style={style.label}>
			💣
			<input key="mines" type="tel" onChange={e => saveConfig(e, "mines")} style={style.input} value={mines} />
		</label>

		<input style={style.submit} type="submit" value="👌" />
	</form>
);

export default Radium(ConfigPanel);
