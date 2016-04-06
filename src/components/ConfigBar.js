import React from 'react';
import Radium from 'radium';
import hasFont from '../hasAppleColorEmoji';

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
	},

	sizeHack: {
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

const ConfigBar = ({ mw, mode, togglePanel, toggleMode }) => (
	<div style={style.base}>
		<a className={hasFont() || "emoji s_wrench"} key="panel" style={[ style.btn, hasFont() || style.sizeHack ]} href="#" onClick={togglePanel}>⚙</a>
		<a key="mode"  style={style.btn} href="#" onClick={toggleMode}>
			{mode === "regular" ? (<span className={hasFont() || "emoji s_point_up_2"}>🖱</span>) : (<span className={hasFont() || "emoji s_triangular_flag_on_post"}>🚩</span>)}
		</a>
	</div>
);

export default Radium(ConfigBar);
