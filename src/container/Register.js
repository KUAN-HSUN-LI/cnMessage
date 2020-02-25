import React, { useRef } from 'react';
import Button from '../component/Button';
import { Redirect } from 'react-router-dom';
import { useMutation } from 'react-apollo';
import './Login.css';
import './Input.css';

import { CREATE_USER_MUTATION } from '../graphql';

const Regist = props => {
	const name = useRef(null);
	const pwd = useRef(null);
	const [createUserMutation] = useMutation(CREATE_USER_MUTATION);
	const handleKeypress = e => {
		if (e.key === 'Enter') {
			handleSubmit(e);
		}
	};
	const handleSubmit = e => {
		e.preventDefault();
		if (!name || !pwd) return;
		createUserMutation({
			variables: {
				name: name.current.value,
				pwd: pwd.current.value,
			},
		})
			.then(e => {
				localStorage.setItem('name', name);
				localStorage.setItem('friends', JSON.stringify(e.data.createUser.friends));
				props.history.push({ pathname: '/chatroom' });
				return <Redirect to={{ pathname: '/chatroom' }} />;
			})
			.catch(e => {
				console.error(e);
			});
	};
	return (
		<div className="login-base">
			<h1 className="title">Message Box Login</h1>
			<label className="white-word">User Name</label>
			<br />
			<input className="input-base" type="text" onKeyPress={e => handleKeypress(e)} ref={name}></input>
			<br />
			<label className="white-word">Password</label>
			<br />
			<input className="input-base" type="password" onKeyPress={e => handleKeypress(e)} ref={pwd}></input>
			<br />
			<Button name="register" onClick={e => handleSubmit(e)}></Button>
			<Button
				name="cancel"
				onClick={e => {
					e.preventDefault();
					props.history.push({ pathname: '/login' });
					return <Redirect to={{ pathname: '/login' }} />;
				}}></Button>
		</div>
	);
};

export default Regist;
