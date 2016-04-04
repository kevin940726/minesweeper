import React from 'react';

const style = {
	position: "absolute",
	height: "100px",
	width: "300px",
	left: 0,
	top: 0,
	right: 0,
	bottom: 0,
	margin: "auto"
};

const Popup = ({ display, text }) => (
	<div style={{
		...style,
		display: display ? "flex" : "none"
	}}>
		{text}
	</div>
);

export default Popup;
