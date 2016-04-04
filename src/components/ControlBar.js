import React, { Component } from 'react';
import Radium from 'radium';

const style = {
	display: "flex",
	justifyContent: "space-between",
	alignItems: "center",
	position: "relative",
	height: "40px",
	marginBottom: "5px",
	border: "1px solid #EEE"
};

const btnStyle = {
	position: "absolute",
	left: 0,
	right: 0,
	top: 0,
	bottom: 0,
	margin: "auto",
	textDecoration: "none",
	// border: "1px solid #EEE",
	padding: "5px 5px 5px 3px",
	fontSize: "20px",
	height: "36px",
	width: "36px",
	lineHeight: "26px",
	boxSizing: "border-box",
	textAlign: "center",
	transition: "background-color 0.2s ease-out",

	":hover": {
		backgroundColor: "#F0F0F0"
	}
};

const textStyle = {
	fontSize: "18px",
	margin: "0 10px",
	lineHeight: "18px",
	letterSpacing: "0.1em"
};

const TimePass = Radium(React.createClass({
	componentDidMount() {
		setInterval(() => {
			this.props.updateTime();
		}, 1000);
	},

	render() {
		return (
			<p style={textStyle} className="time-pass">{this.props.timePass}</p>
		);
	}
}));

const ControlBar = ({ minesRemaining, display, text, restartGame, timePass, on, updateTime }) => (
	<div style={style}>
		<p style={textStyle} className="mines-remaining">{minesRemaining}</p>
		<a style={btnStyle} onClick={restartGame} href="#">{text}</a>
		{/*<p style={textStyle} className="time-pass">{timePass}</p>*/}
		<TimePass on={on} updateTime={updateTime} timePass={timePass} />
	</div>
);

export default Radium(ControlBar);
