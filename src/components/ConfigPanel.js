import React from 'react';
import Radium from 'radium';
import hasFont from '../hasAppleColorEmoji';

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
		fontFamily: "'AppleColorEmoji', 'Roboto', sans-serif",
		width: "100%"
	},
	input: {
		flexBasis: "50px",
		width: "120px",
		height: "30px",
		marginLeft: "20px",
		fontFamily: "'Roboto', sans-serif",
		padding: "5px 10px",
		fontSize: "16px",
		boxSizing: "border-box",
		textAlign: "center",
		color: "#000"
	},
	submit: {
		padding: "5px 10px",
		border: "1px solid #EEE",
		backgroundColor: "#FFF",
		display: "inline-block",
		fontFamily: "'AppleColorEmoji', 'Roboto', sans-serif",
		fontSize: "20px",
		cursor: "pointer",
		width: "100%",
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
		fontFamily: "'AppleColorEmoji', 'Roboto', sans-serif",
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
	},
	levelHack: {
		width: "24px",
		height: "24px",
		margin: "3px",
		transition: "background-color 0.2s ease-out, box-shadow 0.2s ease-out",
		":hover": {
			backgroundColor: "#EEE",
			boxShadow: "0 0 0 3px #EEE"
		}
	}
};

const ConfigPanel = ({ show, rows, cols, mines, flagMode, checkIsSolvable, saveConfig, saveAllConfig, togglePanel, toggleFlagMode, toggleCheckIsSolvable }) => (
	<form style={[ style.base, show && style.show ]} onSubmit={togglePanel}>
		<div style={style.upperGroup}>
			<label key="flagModeLabel" style={[ style.label, style.checkbox ]}>
				{flagMode ? (<span className={hasFont() || "emoji s_zap"}>⚡</span>) : <span className={hasFont() || "emoji s_snail"}>🐌</span>}
				<input key="flagMode" type="checkbox" onChange={e => toggleFlagMode()} style={{display: 'none'}} checked={flagMode}></input>
			</label>
			<label key="checkIsSolvableLabel" style={[ style.label, style.checkbox ]}>
				{checkIsSolvable ? (<span className={hasFont() || "emoji s_robot"}>🤖</span>) : <span className={hasFont() || "emoji s_hand"}>✋</span>}
				<input key="checkIsSolvable" type="checkbox" onChange={e => toggleCheckIsSolvable()} style={{display: 'none'}} checked={checkIsSolvable}></input>
			</label>
			<div style={style.line}></div>
			<a className={hasFont() || "emoji s_seedling"} key="beginner" style={[ style.checkbox, style.level, hasFont() || style.levelHack ]} onClick={e => saveAllConfig(9, 9, 10)}>🌱</a>
			<a className={hasFont() || "emoji s_herb"} key="intermediate" style={[ style.checkbox, style.level, hasFont() || style.levelHack ]} onClick={e => saveAllConfig(16, 16, 40)}>☘</a>
			<a className={hasFont() || "emoji s_four_leaf_clover"} key="expert" style={[ style.checkbox, style.level, hasFont() || style.levelHack ]} onClick={e => saveAllConfig(16, 30, 99)}>🍀</a>
		</div>
		<label style={style.label}>
			<span className={hasFont() || "emoji s_left_right_arrow"}>↔️</span>
			<input key="rows" type="tel" onChange={e => saveConfig(e, "rows")} style={style.input} value={rows} />
		</label>
		<label style={style.label}>
			<span className={hasFont() || "emoji s_arrow_up_down"}>↕️</span>
			<input key="cols" type="tel" onChange={e => saveConfig(e, "cols")} style={style.input} value={cols} />
		</label>
		<label style={style.label}>
			<span className={hasFont() || "emoji s_bomb"}>💣</span>
			<input key="mines" type="tel" onChange={e => saveConfig(e, "mines")} style={style.input} value={mines} />
		</label>

		<button style={style.submit} type="submit">
			<span className={hasFont() || "emoji s_ok_hand"}>👌</span>
		</button>
	</form>
);

export default Radium(ConfigPanel);
