import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import './buttonComponent.css'


class AppButton extends Component {
    state = {  };

    render() { 
        const {name, onClickFunction,style} = this.props;
        return (
                <Button onClick={onClickFunction} style={style}>{name}</Button>
            );
    }
}
 
AppButton.defaultProps = {
    name: '',
    onClickFunction: '',
    style:{},
}

AppButton.propTypes = {
    name: PropTypes.string,
    onClickFunction: PropTypes.func.isRequired,
    style:PropTypes.object,
}

export default AppButton;