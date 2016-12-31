import React from 'react';
import { Modal } from 'react-bootstrap';
import { Link } from 'react-router';

class BoardModal extends React.Component{
	constructor(props) {
		super(props);

		this.handleDeleteClick = this.handleDeleteClick.bind(this);
		this.brokenImage = this.brokenImage.bind(this);
	}

	handleDeleteClick() {
		this.props.handleDeleteClick(this.props.board._id);
		this.props.close();
	}

	brokenImage(e) {
		console.log('broken image detected: ' + e.target.src);
		e.target.src = e.target.src ? "/imgs/broken.png" : e.target.src;
	}

	render() {
		var link = '/user/' + this.props.board.owner;
	    return (
			<div>
				<Modal show={this.props.show} onHide={this.props.close}>
				  <Modal.Header closeButton>
				  	<h2 className="text-center">{this.props.board.description}</h2>
				  </Modal.Header>
				  <Modal.Body>
				    <img className="center-block img-responsive" src={this.props.board.image} onError={this.brokenImage} />
				  </Modal.Body>
				  <Modal.Footer>
				  	{this.props.profile ?
				  		<button className="btn btn-danger pull-left" onClick={this.handleDeleteClick}><i className="fa fa-trash" aria-hidden="true"></i></button>
				  	:
				  		<Link to={link}><h5 className="pull-left">@{this.props.board.owner}</h5></Link>
				  	}
					<button className="btn btn-primary pull-right" id={this.props.board._id} disabled={!this.props.user} onClick={this.props.handleLikeClick}> 
						<i className="fa fa-heart" aria-hidden="true"></i> ×{this.props.board.likes}
					</button>
				  </Modal.Footer>
				</Modal>
			</div>
	    );
	}
};

export default BoardModal;