import React from 'react';
import { Modal } from 'react-bootstrap';
import { Link } from 'react-router';

class BoardModal extends React.Component{
	constructor(props) {
		super(props);
		this.state = { 
			text: '',
		};

		this.save = this.save.bind(this);
		this.handleInput = this.handleInput.bind(this);
	}

	save() {
		var text = this.state.text;
		this.setState({ text: '' });
		this.props.save(text);
	}

	handleInput(e) {
		e.preventDefault();
		this.setState({ text: e.target.value });
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
				    <img className="center-block img-responsive" src={this.props.board.image} />
				  </Modal.Body>
				  <Modal.Footer>
				  	{this.props.user.username === this.props.board.owner ?
				  		<button className="btn btn-danger pull-left"><i className="fa fa-trash" aria-hidden="true"></i></button>
				  	:
				  		<Link to={link}><h5 className="pull-left">{this.props.board.owner}</h5></Link>
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