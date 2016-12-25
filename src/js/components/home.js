import React from 'react';
import axios from 'axios';

import Gallery from './gallery';


class Home extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			boards: []
		};

		this.updateLikes = this.updateLikes.bind(this);
	}

	componentDidMount() {
		var APIroute = '/api/AllBoards';
		
		axios.get(APIroute)
			.then(res => {
				const boards = res.data;
				this.setState({ boards: boards });
			})
			.catch(res => {
				console.error(res);
				this.props.router.push('error');
			});
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
				this.props.router.push('error');
			});
	}


	render() {
		return (
			<div>
				<h1 className="text-center">Favourite Knock-offs</h1>
				<Gallery user={this.props.route.user} boards={this.state.boards} updateLikes={this.updateLikes} />
			</div>
		);
	}
}

export default Home;