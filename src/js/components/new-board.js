import React from 'react';
import { Modal } from 'react-bootstrap';

class NewBoardModal extends React.Component{
	constructor(props) {
		super(props);
		this.state = { 
			description: '',
			image: undefined,
			temp: '',
			valid: false
		};

		this.submit = this.submit.bind(this);
		this.imageSubmit = this.imageSubmit.bind(this);
		this.handleInput = this.handleInput.bind(this);
		this.handleImageSubmit = this.handleImageSubmit.bind(this);
		this.brokenImage = this.brokenImage.bind(this);
	}

	submit() {
		var newBoard = {image: this.state.image, description: this.state.description};
		this.setState({ description: '', image: undefined, temp: '', valid: false });
		this.props.createBoard(newBoard);
		this.props.close();
	}

	imageSubmit() {
		this.setState({ image: this.state.temp, valid: true });
	}

	handleInput(e) {
		e.preventDefault;
		// var newDescription = this.state.description.length < 15 ? e.target.value : this.state.description;
		var newDescription = e.target.value;
		this.setState({ description: newDescription });
	}

	handleImageSubmit(e) {
		e.preventDefault;
		this.setState({ temp: e.target.value });
	}

	brokenImage(e) {
		console.log('broken image detected: ' + e.target.src);
		e.target.src = e.target.src ? "/imgs/error.png" : e.target.src;
		this.setState({valid: false});
	}

	render() {
	    return (
			<Modal show={this.props.show} onHide={this.props.close}>
				<Modal.Header closeButton />
				<Modal.Body>
					<img className="center-block img-responsive max-dimensions" src={this.state.image} onError={this.brokenImage}/>
					<hr />				
					<div className="form-group">
						<input type="text" className="form-control" id="description-input" placeholder="Give A Short Description" value={this.state.description} onChange={this.handleInput} />
					</div>
					<div className="input-group">
						<input type="text" className="form-control" placeholder="Image Link" value={this.state.temp} onChange={this.handleImageSubmit} />
						<span className="input-group-btn">
							<button className="btn btn-success" onClick={this.imageSubmit} >Add Image</button>
						</span>
					</div>
				</Modal.Body>
				<Modal.Footer>
					<button className="btn btn-success col-xs-12" disabled={!this.state.valid || !this.state.description} onClick={this.submit}>Submit</button>
				</Modal.Footer>
			</Modal>
	    );
	}
};

export default NewBoardModal;

// http://placehold.it/200x60