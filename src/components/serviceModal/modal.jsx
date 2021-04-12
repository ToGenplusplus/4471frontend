import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import './modal.css';

class ServiceModal extends Component {
    constructor(props) {
        super(props);
        this.wrapper = React.createRef();  }
    state = {buttonactive:true}

    componentDidMount(){
        this.setState({buttonactive: this.props.isDisabled});
    }

    componentDidUpdate(prevProps,prevState){
        if(prevProps.isDisabled !== this.props.isDisabled){
            this.setState({buttonactive: this.props.isDisabled});
        }
    }

    render() { 

        const {title,body,isShowing,CloseModal, onSub} = this.props;
        const {buttonactive} = this.state;

        let subButton;
        if (buttonactive){
            subButton = <Button variant="primary" onClick={() => onSub(title)} style={{backgroundColor:"purple"}} ref={this.wrapper} disabled>Subscribe</Button>
        }else{
            subButton = <Button variant="primary" onClick={() => onSub(title)} style={{backgroundColor:"purple"}} ref={this.wrapper}>Subscribe</Button>
        }
        return ( 
            <Modal show={isShowing} onHide={CloseModal} backdrop="static"
            keyboard={false} ref={this.wrapper}>
                <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{body}</Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={CloseModal} ref={this.wrapper}>
                    Close
                </Button>
                {subButton}
                </Modal.Footer>
            </Modal> 
          );
    }
}

ServiceModal.propTypes = {
    title: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
    onSub: PropTypes.func.isRequired,
    CloseModal: PropTypes.func.isRequired,
    isShowing: PropTypes.bool.isRequired,
    isDisabled: PropTypes.bool,
}
 
export default ServiceModal;