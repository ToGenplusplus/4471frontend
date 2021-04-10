import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import './mainComponent.css'
import ServiceModal from "../serviceModal/modal"

class Main extends Component {
    constructor(props) {
        super(props);
        this.wrapper = React.createRef();  }
    state = { services: [], subscribedServices:[], showSectorServiceModal:false,showSusServiceModal:false,showTrafficServiceModal:false}

    componentDidMount (){
        this.setSubScribedServices();
    }

    getAvailableServices = () => {
        const servicespath = "https://425ee274.us-south.apigw.appdomain.cloud/service/"
        const aservicespath = servicespath + "getservices"
          axios.get(aservicespath)
          .then((res) => {
          const data = res.data
          if (data.statusCode === 200){
            let info = JSON.parse(res.data.body); 
            this.setState({services: info.services});
          }
          })
          .catch(e => console.log(e));
      };

    setSubScribedServices = () => {
        const {userinfo} = this.props;
        this.setState({subscribedServices: userinfo[3]})
    }

    toggleServiceModal = (servicename)=> {
        const {showSectorServiceModal, showSusServiceModal, showTrafficServiceModal} = this.state;
        if (servicename.service === "Sector-Watch"){
            this.setState({showSectorServiceModal: !showSectorServiceModal});
        }else if (servicename.service === "Traffic-Tracker"){
            this.setState({showTrafficServiceModal: !showTrafficServiceModal});
        }else{
            this.setState({showSusServiceModal: !showSusServiceModal});
        }
    }

    navbar = () => {
        const navbarstyle = {
            backgroundColor: "purple",
        }
        const {userinfo} = this.props;
        const {services} = this.state;
        this.getAvailableServices();
    
        const avaServices = services.map((service) => <NavDropdown.Item onClick={() => this.toggleServiceModal({service})} ref={this.wrapper}>{service}</NavDropdown.Item>)
        

    
        return (
            <Navbar expand="lg" style={navbarstyle}>
                <Navbar.Brand id="title"> $Financial Service Collection </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                    <NavDropdown title="Services" id="basic-nav-dropdown" className="navbaritems">
                        {avaServices}
                    </NavDropdown>
                    </Nav>
                    <Nav>
                        <Nav.Link href="#link" id="username" className="navbaritems" disabled>{userinfo[2]}</Nav.Link>
                        <Nav.Link href="#link" >Logout</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    };
/*
<ServiceModal title="Sector-Watch" body={sectorDescription} onClose={this.toggleServiceModal} isShowing={showSectorServiceModal} />
                <ServiceModal title="Suspicious-Trades Tracker" body={suspiciousDescription} onClose={this.toggleServiceModal} isShowing={showSusServiceModal} />
                <ServiceModal title="Traffic Tracker" body={trafficDescription} onClose={this.toggleServiceModal} isShowing={showTrafficServiceModal} />
*/
    render() { 
        const {subscribedServices, showSectorServiceModal, showSusServiceModal, showTrafficServiceModal} = this.state;
        const sectorDescription = "Service allows you to view sector performance for select dates in 2011"
        const suspiciousDescription = "Service allows you to view the symbols of companies who made suspicious trades on a certain date"
        const trafficDescription = "Service allows you to view active companies on a certain date"
        const message = subscribedServices.length === 0 ? <div id="notsubmessage"><h3>You are not subscribed to any services.<br></br> View the services menu for available services to subscribe too</h3></div>:'';

        const showingModal = showSectorServiceModal ? <ServiceModal title="Sector-Watch" body={sectorDescription} onClose={this.toggleServiceModal} isShowing={showSectorServiceModal} /> : ''
        return (  
            <div id="mainPage">
                <div>
                {this.navbar()}
                </div>
                {message}
                {showingModal}
            </div>
        );
    }
}
 
Main.propTypes = {
    userinfo: PropTypes.array.isRequired,
}

export default Main;