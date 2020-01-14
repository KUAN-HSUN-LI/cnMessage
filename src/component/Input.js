import React from 'react';
import './Input.css';

const Input = props => {
	const { className, name, type, onChange, onKeyPress } = props;
	return (
		<input className={className} type={type} onChange={onChange} onKeyPress={onKeyPress}>
			{name}
		</input>
	);
};

export default Input;
