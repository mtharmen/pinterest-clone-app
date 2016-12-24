import React from 'react';
import Masonry from 'react-masonry-component';

import Board from './board';

var masonryOptions = {
	transitionDuration: 500
};

class Gallery extends React.Component{
	constructor() {
		super();
		this.state = { 
			showModal: false
		};

		this.close = this.close.bind(this);
		this.open = this.open.bind(this);
	}

	close() {
		this.setState({ showModal: false });
	}

	open() {
		this.setState({ showModal: true });
	}

	render() {
		var boards = this.props.boards.map((boardInfo, i) => {
			return <Board key={i} board={boardInfo} user={this.props.user} profile={this.props.profile} handleLikeClick={this.props.updateLikes} handleDeleteClick={this.props.handleDeleteClick} />; 
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