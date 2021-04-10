import React, { Component } from 'react';
import PropTypes from 'prop-types';
import 'react-bootstrap/Button';


class Button extends Component {
    state = {  };

    render() { 
        const {name, onClickFunction,style,specifyVariant} = this.props;
        return (
            <React.Fragment> 
                <Button variant={specifyVariant} onClick={onClickFunction} style={style}>{name}</Button>
            </React.Fragment>
            );
    }
}
 
Button.defaultProps = {
    name: '',
    onClickFunction: function name(params) {
        
    },
    style:{},
    specifyVariant: "dark"
}

Button.propTypes = {
    name: PropTypes.string,
    onClickFunction: PropTypes.func.isRequired,
    style:PropTypes.object,
    specifyVariant: PropTypes.string
}

export default Button;