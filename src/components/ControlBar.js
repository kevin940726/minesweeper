import React, { Component } from 'react';
import Radium, { keyframes } from 'radium';
import Sticky from 'react-sticky-state';
import hasFont from '../hasAppleColorEmoji';

const giggle = keyframes({
	"0%": {
		transform: "translateY(0px)"
	},
	"3%": {
		transform: "translateY(-2px)"
	},
	"9%": {
		transform: "translateY(2px)"
	},
	"15%": {
		transform: "translateY(-2px)"
	},
	"21%": {
		transform: "translateY(2px)"
	},
	"24%": {
		transform: "translateY(0px)"
	},
	"100%": {
		transform: "translateY(0px)"
	}
});

const style = {
	base: {
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		position: "relative",
		height: "40px",
		marginBottom: "5px",
		border: "1px solid #EEE"
	},
	btn: {
		position: "absolute",
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		margin: "auto",
		textDecoration: "none",
		padding: "5px 5px 5px 3px",
		fontSize: "20px",
		height: "36px",
		width: "36px",
		lineHeight: "26px",
		boxSizing: "border-box",
		textAlign: "center",
		transition: "background-color 0.2s ease-out",
		fontFamily: "'AppleColorEmoji', 'Roboto', sans-serif",

		":hover": {
			backgroundColor: "#F0F0F0"
		}
	},
	text: {
		fontSize: "18px",
		margin: "0 10px",
		lineHeight: "18px",
		letterSpacing: "0.1em"
	},
	emoji: {
		fontFamily: "'AppleColorEmoji', 'Roboto', sans-serif"
	},
	ani: {
		animation: "x 1.5s ease-in-out infinite",
		animationName: giggle
	}
};

const TimePass = Radium(React.createClass({
	componentDidMount() {
		this.props.mw.on("timeupdated", timePass => {
			this.props.updateTime(timePass);
		});
	},

	render() {
		return (
			<p style={style.text} className="time-pass">
				<span className={hasFont() || "emoji s_clock4"} style={style.emoji}>⏱</span> {this.props.timePass}
			</p>
		);
	}
}));

const ControlBar = ({ minesRemaining, display, text, restartGame, timePass, mw, updateTime }) => (
	<div style={style.base}>
		<p style={style.text} className="mines-remaining">
			<span className={hasFont() || "emoji s_bomb"} style={style.emoji}>💣</span> {minesRemaining}
		</p>
		<a style={[
			style.btn,
			text === "grin" && style.ani
		]} onClick={restartGame} href="#">
			<span className={hasFont() || `emoji s_${text}`} style={style.emoji}>
				{text === "grin" ? "😁" : (text === "cry" ? "😢" : "😊")}
			</span>
		</a>
		<TimePass mw={mw} updateTime={updateTime} timePass={timePass} />
	</div>
);

export default Radium(ControlBar);
