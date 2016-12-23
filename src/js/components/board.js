import React from 'react';
import { Link } from 'react-router';

import BoardModal from './board-modal';

class Board extends React.Component {
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
		var link = '/user/' + this.props.board.owner;

		return (
			<div className="col-md-3 col-xs-6">
				<div className="panel panel-default">
					<div className="panel-body">
						<img className="center-block img-responsive" src={this.props.board.image} onClick={this.open}/>
						<h3 className="text-center">{this.props.board.description}</h3>
					</div>
					<div className="panel-footer clearfix">
						{this.props.profile ?
							<button className="btn btn-danger btn-sm pull-left"><i className="fa fa-trash" aria-hidden="true"></i></button>
						:
							<Link to={link}><h5 className="pull-left">{this.props.board.owner}</h5></Link>
						}
						<button className="btn btn-primary btn-sm pull-right" id={this.props.board._id} disabled={!this.props.user} onClick={this.props.handleLikeClick}> 
							<i className="fa fa-heart" aria-hidden="true"></i> ×{this.props.board.likes}
						</button>
					</div>
				</div>
				<BoardModal show={this.state.showModal} 
							close={this.close} 
							board={this.props.board}
							user={this.props.user}
							handleLikeClick={this.props.handleLikeClick} 
				/>
			</div>
		);
	}
}

export default Board;

// <Link className="col-xs-5" to={link}>Profile</Link>
// <Link className="col-xs-5" to={link}>Profile</Link>

