import React from 'react';
import axios from 'axios';

import Gallery from './gallery';
import NewBoardModal from './new-board';

class UserPage extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			boards: [],
			showModal: false
		};

		this.close = this.close.bind(this);
		this.open = this.open.bind(this);
		this.updateLikes = this.updateLikes.bind(this);
		this.createBoard = this.createBoard.bind(this);
		this.deleteBoard = this.deleteBoard.bind(this);
	}

	componentDidMount() {
		var APIroute = '/api/AllBoards/' + this.props.params.username;
		
		axios.get(APIroute)
			.then(res => {
				const boards = res.data;
				this.setState({ boards: boards });
			})
			.catch(res => {
				console.error(res);
			});
	}

	close() {
		this.setState({ showModal: false });
	}

	open() {
		this.setState({ showModal: true });
	}

	updateLikes(e) {
		var id = e.target.id;
		var url = '/api/updateLikes/' + id;
		axios(url)
			.then(res => {
				var update = res.data ? 1 : -1;
				var copy = JSON.parse(JSON.stringify(this.state.boards));
				copy.map(board => {
					if (board._id === id) {
						board.likes += update;
					};
					return board;
				});

				this.setState({ boards: copy });
			})
			.catch(res => {
				console.error(res);
			});
	}

	createBoard(stuff) {
		var newBoard = {
			image       : stuff.image,
			description : stuff.description,
			owner       : this.props.route.user.username,
			likes       : 0
		};

		axios.post('/api/addBoard/', stuff)
			.then(res => {
				var copy = JSON.parse(JSON.stringify(this.state.boards));
				copy.unshift(res.data[0]);
				this.setState({ boards: copy });
			})
			.catch(res => {
				console.error(res);
			});
	}

	deleteBoard(id) {
		var path = '/api/removeBoard/' + id;
		axios.get(path)
			.then(res => {
				var copy = JSON.parse(JSON.stringify(this.state.boards));
				copy = copy.filter(board => {
					return board._id !== id;
				});
				this.setState({ boards: copy });
			})
			.catch(res => {
				console.error(res);
			});
		
	}

   	render() {
   		if (this.props.route.user) {
   			var profile = (this.props.params.username === this.props.route.user.username);
   		}
      	return (
         	<div>
				{ profile ? (
					<span>
						<h1 className="text-center">My Boards</h1>
						<button className="btn btn-primary btn-lg" id="new-board-button" onClick={this.open}>New</button>
					</span>
				) : (
					<span>
						<h1 className="text-center">@{this.props.params.username}'s Boards</h1>
						{!this.state.boards.length && <h2 className="text-center">No Boards Found</h2>}
					</span>
				)}
            	<Gallery user={this.props.route.user} boards={this.state.boards} updateLikes={this.updateLikes} profile={profile} createBoard={this.createBoard} handleDeleteClick={this.deleteBoard} />
            	<NewBoardModal show={this.state.showModal} 
						   close={this.close}
						   createBoard={this.createBoard}
				/>
         	</div>
      	);
   	}
}

export default UserPage;