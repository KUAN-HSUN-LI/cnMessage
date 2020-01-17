import React, { useState } from 'react';
import Button from '../component/Button';
import Input from '../component/Input';
import { Redirect } from 'react-router-dom';
import { useMutation } from 'react-apollo';
import './Login.css';

import { LOGIN_USER_MUTATION } from '../graphql';

const Regist = props => {
	const [name, setName] = useState('');
	const [pwd, setPwd] = useState('');
	const [loginUserMutation] = useMutation(LOGIN_USER_MUTATION);
	const handleKeypress = e => {
		if (e.key === 'Enter') {
			handleSubmit(e);
		}
	};
	const handleSubmit = e => {
		e.preventDefault();
		if (!name || !pwd) return;
		loginUserMutation({
			variables: {
				name: name,
				pwd: pwd,
			},
		})
			.then(e => {
				props.history.push({ pathname: '/chatroom', state: { friends: e.data.loginUser.friends, name: name } });
				return <Redirect to={{ pathname: '/chatroom', state: { friends: e.data.loginUser.friends, name: name } }} />;
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
			<Input
				className="input-base"
				type="text"
				onChange={e => setName(e.target.value)}
				onKeyPress={e => handleKeypress(e)}></Input>
			<br />
			<label className="white-word">Password</label>
			<br />
			<Input
				className="input-base"
				type="password"
				onChange={e => setPwd(e.target.value)}
				onKeyPress={e => handleKeypress(e)}></Input>
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
