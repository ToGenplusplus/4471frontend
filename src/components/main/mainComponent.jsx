import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import './mainComponent.css'

class Main extends Component {
    state = { services: [], subscribedServices:[]}


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

    navbar = () => {
        const navbarstyle = {
            backgroundColor: "purple",
        }

        //services user subscribed 2 = userinfo[3]
        const {userinfo} = this.props;
        const {services} = this.state;
        this.getAvailableServices();
    
        const avaServices = services.map((service) => <NavDropdown.Item onClick="">{service}</NavDropdown.Item>)
        

    
        return (
            <Navbar expand="lg" style={navbarstyle}>
                <Navbar.Brand> $Financial Service Collection </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                    <NavDropdown title="Services" id="basic-nav-dropdown">
                        {avaServices}
                    </NavDropdown>
                    </Nav>
                    <Nav>
                        <Nav.Link href="#link" disabled>{userinfo[2]}</Nav.Link>
                        <Nav.Link href="#link" >Logout</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    };

    render() { 
        return (  
            this.navbar()
        );
    }
}
 
Main.propTypes = {
    userinfo: PropTypes.array.isRequired,
}

export default Main;