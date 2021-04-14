import React, { Component } from 'react';
import PropTypes from 'prop-types';
import 'bootstrap/dist/css/bootstrap.min.css';
import './buttonComponent.css'


class AppButton extends Component {
    state = {  };

    render() { 
        const {name, onClickFunction,style} = this.props;
        return (
                <button type="button" onClick={onClickFunction} style={style} className="appButton">{name}</button>
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