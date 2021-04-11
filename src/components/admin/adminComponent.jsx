import React, {Component}from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import ServiceSwitch from '../switch/switch';
import './adminComponent.css';

class Admin extends Component {
    constructor(props) {
        super(props);
        this.wrapper = React.createRef();  }
    state = { availableServices:[], credentials:[],secActivated: false, susActivated: false, trafficActivated:false}

    componentDidMount(){
        this.getAvailableServices();
        this.setCredentials();
        this.setActivations();
    }

    setCredentials = ()=> {
        const {userinfo} = this.props;
        this.setState({credentials:userinfo});
    };

    setActivations = () => {
        const servicespath = "https://425ee274.us-south.apigw.appdomain.cloud/service/"
        const aservicespath = servicespath + "getservices"
          axios.get(aservicespath)
          .then((res) => {
          const data = res.data
          if (data.statusCode === 200){
            let info = JSON.parse(res.data.body); 
            const avaServices = info.services;
            avaServices.forEach((service) => this.toggleAvailability(service));
          }
          })
          .catch((e) => console.error(e));
    };

    getAvailableServices = () => {
        const servicespath = "https://425ee274.us-south.apigw.appdomain.cloud/service/"
        const aservicespath = servicespath + "getservices"
          axios.get(aservicespath)
          .then((res) => {
          const data = res.data
          if (data.statusCode === 200){
            let info = JSON.parse(res.data.body); 
            const avaServices = info.services;
            this.setState({availableServices: avaServices});
          }
          })
          .catch((e) => console.error(e));
    };

    activateService =(servicename) => {
        const {credentials} = this.state;
        const access = credentials[4];

        const adminpath = "https://425ee274.us-south.apigw.appdomain.cloud/admin/";
        const operationPath = adminpath + "activateservice";

        axios.post(operationPath, {
            serviceName: servicename,
        }, { headers: {
            'Authorization': `Bearer ${access}`
        }})
        .then((resp) => {
            if (resp.data.statusCode === 200){
                this.getAvailableServices();
                this.toggleAvailability(servicename);
            }
        })
        .catch((e) => console.error(e.response))
    };

    deactivateService =(servicename) => {
        const {credentials} = this.state;
        const access = credentials[4];

        const adminpath = "https://425ee274.us-south.apigw.appdomain.cloud/admin/";
        const operationPath = adminpath + "deactivateservice";

        axios.post(operationPath, {
            serviceName: servicename,
        }, { headers: {
            'Authorization': `Bearer ${access}`
        }})
        .then((resp) => {
            if (resp.data.statusCode === 200){
                this.getAvailableServices();
                this.toggleAvailability(servicename);
            }
        })
        .catch((e) => console.error(e.response))
    };

    sector = () => {
        const {secActivated} = this.state;
        const labelVal = secActivated ? "deactivate":"activate";
        return (
            <div>
                <h4 className="sName">Name: Sector-Watch</h4> <label className="switchLabel">{labelVal}</label>
                <ServiceSwitch servicename="Sector-Watch" toggle={secActivated ? this.deactivateService: this.activateService} isChecked={secActivated} classname="switch"/>
                <h4>Description: </h4>
                <p className="sDescr">Service allows you to view sector performance for select dates in 2011.</p>
            </div>
        );
    };

    sus = () => {
        const {susActivated} = this.state;
        const labelVal = susActivated ? "deactivate":"activate";
        return (
            <div>
                <h4 className="sName">Name: Suspicious-Trades-Tracker</h4> <label className="switchLabel">{labelVal}</label>
                <ServiceSwitch servicename='Suspicious-Trades-Tracker' toggle={susActivated ? this.deactivateService: this.activateService} isChecked={susActivated} classname="switch"/>
                <h4>Description: </h4>
                <p className="sDescr">Service allows you to view the symbols of companies who made suspicious trades on select dates in 2011.</p>
            </div>
        );
    };

    traffic = ()=> {
        const {trafficActivated} = this.state;
        const labelVal = trafficActivated ? "deactivate":"activate";
        return (
            <div>
                <h4 className="sName">Name: Traffic-Tracker</h4> <label className="switchLabel">{labelVal}</label>
                <ServiceSwitch servicename='Traffic-Tracker' toggle={trafficActivated ? this.deactivateService: this.activateService} isChecked={trafficActivated} classname="switch"/>
                <h4>Description: </h4>
                <p className="sDescr"> Service allows you to view active companies on select dates in 2011.</p>
            </div>
        );
    };

    toggleAvailability = (servicename)=> {
        if (servicename === "Sector-Watch"){
            this.toggleSector()
        }else if (servicename === "Suspicious-Trades-Tracker"){
            this.toggleSus()
        }else{
            this.toggleTraffic()
        }
    };  

    toggleSector = ()=> {
        const {secActivated} = this.state;
        
        this.setState({secActivated: !secActivated});
    
    };

    toggleSus = ()=> {
        const {susActivated} = this.state;
        
        this.setState({susActivated: !susActivated});
    };
    
    toggleTraffic = ()=> {
        const {trafficActivated} = this.state;
        
        this.setState({trafficActivated: !trafficActivated});
    };

    onLogoutClick = () => {
        window.location.reload();
    };

    navbar = () => {
        const navbarstyle = {
            backgroundColor: "purple",
        }
        const {userinfo} = this.props;
        return (
            <Navbar expand="lg" style={navbarstyle}>
                <Navbar.Brand id="title"> $Financial Service Collection- Admin</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                    </Nav>
                    <Nav>
                        <Nav.Link  id="username" className="navbaritems" disabled>{userinfo[2]}</Nav.Link>
                        <Nav.Link onClick={() => this.onLogoutClick()} ref={this.wrapper} style={{fontSize:"large"}}>Logout</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    };
    render() { 
        const sector = this.sector();
        const sus = this.sus();
        const traffic = this.traffic();

        const {availableServices} = this.state;

        const avaServices = availableServices.map((service,index) => {return <p key={index} style={{fontSize:"20px"}}>{service}</p>})

        return (  
            <div id="adminPage">
                <div>
                    {this.navbar()}
                </div>
                <div id="adminBody">
                    <div id="platformServices">
                        <h1>Services</h1>
                        {sector}
                        {sus}
                        {traffic}
                    </div>
                    <div id="aServices">
                        <h5 style={{fontWeight:"bold"}}>Available Services:</h5>
                        {avaServices}
                    </div>
                </div>
            </div>
        );
    }
}
 
Admin.propTypes = {
    userinfo: PropTypes.array.isRequired,
}
export default Admin;