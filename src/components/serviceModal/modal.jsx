import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import './modal.css';

class ServiceModal extends Component {
    state = { }


    render() { 

        const {title,body,onSubscribe,onClose,isShowing} = this.props;
        return ( 
            <Modal show={isShowing} onHide={onClose(title)} backdrop="static"
            keyboard={false}>
                <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{body}</Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={onClose(title)}>
                    Close
                </Button>
                <Button variant="primary" onClick={onSubscribe} style={{backgroundColor:"purple"}}>
                    Subscribe
                </Button>
                </Modal.Footer>
            </Modal> 
          );
    }
}

ServiceModal.propTypes = {
    title: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
    onSubscribe: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    isShowing: PropTypes.bool.isRequired,
}
 
export default ServiceModal;