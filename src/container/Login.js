import React, { useState, useContext } from 'react';
import Button from '../component/Button';
import Input from '../component/Input';
import { Redirect } from 'react-router-dom';
import { useMutation } from 'react-apollo';
import { Context } from '../context';
import './Login.css';

import { LOGIN_USER_MUTATION } from '../graphql';

const Login = props => {
	const { dispatch } = useContext(Context);
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
				dispatch({ type: 'friends', payload: { friends: e.data.loginUser.friends } });
				console.log(e.data.loginUser.friends);
				localStorage.setItem('friends', JSON.stringify(e.data.loginUser.friends));
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
			<div type="label" className="white-word">
				User Name
			</div>
			<div>
				<Input
					className="input-base"
					type="text"
					onChange={e => setName(e.target.value)}
					onKeyPress={e => handleKeypress(e)}></Input>
			</div>
			<div type="label" className="white-word">
				Password
			</div>
			<div>
				<Input
					className="input-base"
					type="password"
					onChange={e => setPwd(e.target.value)}
					onKeyPress={e => handleKeypress(e)}></Input>
			</div>
			<Button name="submit" onClick={handleSubmit}></Button>
			<Button
				name="register"
				onClick={e => {
					e.preventDefault();
					props.history.push({ pathname: '/register' });
					return <Redirect to={{ pathname: '/register' }} />;
				}}></Button>
		</div>
	);
};

export default Login;
