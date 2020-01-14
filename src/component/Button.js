import React from 'react';
import './Button.css';

const Button = props => {
	const { name, onClick } = props;
	return (
		<button className="button-base" onClick={onClick}>
			{name}
		</button>
	);
};

export default Button;
