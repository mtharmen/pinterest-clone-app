import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, browserHistory, IndexRoute } from 'react-router';

import axios from 'axios';

import Navbar from './components/navbar';
import Footer from './components/footer';
import Home from './components/home';
import UserPage from './components/user-page';
import ErrorPage from './components/error';


class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			user: this.props.route.user,
		};
	}

	render() {
		return (
			<div>
				<Navbar user={this.props.route.user} />
				<div className="container">
					{this.props.children}
				</div>
				<Footer />
			</div>
		);
	}
}

class Routing extends React.Component {
	render() {
		return (
			<Router history={browserHistory} >
				<Route path="/" user={this.props.user} component={App}>
					<IndexRoute user={this.props.user} component={Home}/>
					<Route path="user/:username" user={this.props.user} component={UserPage} onEnter={userCheck} />
					<Route path="error" component={ErrorPage} />
				</Route>
			</Router>
		);
	}
}

function userCheck(nextState, replaceState) {
	var path = '/api/userCheck/' + nextState.params.username;
	axios.get(path)
		.then(res => {
			if (res.data) {
				replaceState({ nextPathname: nextState.location.pathname }, '/');
			}			
		})
		.catch(res => {
			console.error(res);
		});
};

axios.get('/auth/user')
	.then(res => {
		const user = res.data;
		ReactDOM.render(<Routing user={user} />, document.getElementById('root'));
	})
	.catch(res => {
		console.error(res);
		ReactDOM.render(<ErrorPage />, document.getElementById('root'));
	});
	