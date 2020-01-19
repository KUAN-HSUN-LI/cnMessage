import React, { createContext, useReducer } from 'react';

const Context = createContext();

const initValue = {
	friends: [],
};

function reducer(state, action) {
	switch (action.type) {
		case 'friends':
			return { ...state, ...{ friends: action.payload.friends } };
		case 'ADD_FRIEND':
			return { ...state, ...{ friends: state.friends.concat(action.payload) } };
		default:
			return state;
	}
}

const ContextProvider = props => {
	const [state, dispatch] = useReducer(reducer, initValue);
	return <Context.Provider value={{ state, dispatch }}>{props.children}</Context.Provider>;
};

export { Context, ContextProvider };
