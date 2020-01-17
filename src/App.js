import React from 'react';
import './App.css';
import Login from './container/Login';
import Register from './container/Register';
import ChatRoom from './container/ChatRoom';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
function App() {
	return (
		<div className="App">
			<BrowserRouter>
				<Switch>
					{/* <Route exact path="/" render={() => <Redirect to="/login" />} /> */}
					<Route exact path="/login" component={Login} />
					<Route exact path="/register" component={Register} />
					<Route exact path="/chatroom" component={ChatRoom} />
					<Redirect from="/" to="/login" />
				</Switch>
			</BrowserRouter>
		</div>
	);
}

export default App;
