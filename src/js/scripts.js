import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, browserHistory, IndexRoute } from 'react-router';
// import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import axios from 'axios';

import { Navbar, Navbar2 } from './components/navbar';
import Footer from './components/footer';
import Gallery from './components/gallery';
import Home from './components/home';
import NewBoard from './components/new-board';


class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			user: this.props.route.user,
		};
	}

	filterBoard(user) {
		return this.state.boards.filter(board => {
			return board.owner === user;
		});
	}

	render() {
		return (
			<div>
				<Navbar2 user={this.props.route.user} />
				<div className="container">
					{this.props.children}
				</div>
				<Footer />
			</div>
		);
	}
}

class Testing extends React.Component {
	constructor() {
		super();
		this.state = { 
			showModal: false
		};

		this.close = this.close.bind(this);
		this.open = this.open.bind(this);
		this.newBoard = this.newBoard.bind(this);
	}

	close() {
		this.setState({ showModal: false });
	}

	open() {
		this.setState({ showModal: true });
	}

	newBoard(board) {
		console.log(board);
		this.close();
	}

	render() {
		return (
			<div>
				<button className="btn btn-primary btn-lg" onClick={this.open}>Open</button>
				<NewBoardModal show={this.state.showModal} 
							   close={this.close}
							   createBoard={this.newBoard}
				/>
			</div>
		);
	}
}

class Profile extends React.Component {
   	render() {
      	return (
      		<div>
         		<Gallery user={this.props.route.user} profile />
         	</div>
      	);
   	}
}

class UserPage extends React.Component {
   	render() {
      	return (
         	<div>
            	<Gallery user={this.props.route.user} ownerPage={this.props.params.username} />
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
					<Route path="profile" user={this.props.user} component={Profile} />
					<Route path="user/:username" user={this.props.user} component={UserPage} />
				</Route>
			</Router>
		);
	}
}

axios.get('/auth/user')
	.then(res => {
		const user = res.data;
		ReactDOM.render((<Routing user={user} />), document.getElementById('root'));
	})
	.catch(res => {
		console.err(res)
	});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

