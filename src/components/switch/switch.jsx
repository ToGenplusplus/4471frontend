import React,{Component}from 'react';
import PropTypes from 'prop-types';
import Switch from 'react-switch';
import './switch.css';

class ServiceSwitch extends Component {
    constructor(props) {
        super(props);
        this.wrapper = React.createRef();  }
    state = {checked: false};

    componentDidMount(){
        this.setState({checked: this.props.isChecked});
    }

    componentDidUpdate(prevProps){
        if (prevProps.isChecked !== this.props.isChecked){
            this.setState({checked: this.props.isChecked});
        }
    }
    
    render() { 

        const {classname, toggle, servicename} = this.props
        return (  
            <label className={classname}>
                <Switch onChange={() => toggle(servicename) } checked={this.state.checked} onColor='#9900cc'/>
            </label>
        );
    }
}

ServiceSwitch.propTypes = {
    toggle: PropTypes.func,
    classname: PropTypes.string,
    servicename: PropTypes.string,
    isChecked: PropTypes.bool,
}

export default ServiceSwitch;