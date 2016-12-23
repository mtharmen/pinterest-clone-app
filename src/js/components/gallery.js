import React from 'react';
import Masonry from 'react-masonry-component';
import axios from 'axios';

import Board from './board';

import mockBoards from '../mockBoards.js';

var masonryOptions = {
	transitionDuration: 500
};

class Gallery extends React.Component{

	constructor(props) {
		super(props);

		this.state = {
			boards: []
		};

		this.updateLikes = this.updateLikes.bind(this);
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

	componentDidMount() {
		var APIroute = '/api/AllBoards';
		if (this.props.ownerPage) {
			APIroute += '/' + this.props.ownerPage;
		} 
		axios.get(APIroute)
			.then(res => {
				const boards = res.data;
				this.setState({ boards: boards });
			})
			.catch(res => {
				console.error(res);
			});
	}

	render() {
		var profile = (this.props.ownerPage === this.props.user.username) && this.props.user;
		var boards = this.state.boards.map((boardInfo, i) => {
			return <Board key={i} board={boardInfo} user={this.props.user} handleLikeClick={this.updateLikes} profile={profile} />; 
		}, this);

		return(
            <Masonry
                className={'my-gallery-class'}
                elementType={'div'}
                options={masonryOptions}
                disableImagesLoaded={false}
                updateOnEachImageLoad={false}
            >
                {boards}
            </Masonry>
		);
	}
};

export default Gallery;