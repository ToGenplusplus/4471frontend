import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import './mainComponent.css'
import ServiceModal from '../serviceModal/modal';
import Service from '../serviceArea/serivce';

let source;

class Main extends Component {
    constructor(props) {
        super(props);
        this.wrapper = React.createRef();  
        source = axios.CancelToken.source();
    }
    state = { services: [], subscribedServices:[], showSectorServiceModal:false,showSusServiceModal:false,showTrafficServiceModal:false, appMesage:''}
    
    componentDidMount (){
        this.setSubScribedServices();
        this.getAvailableServices();
    }

    componentWillUnmount(){
        if (source) {
            source.cancel("Main Component got unmounted");
        }
    }

    componentDidUpdate(prevProps,prevState){
        if (this.state.subscribedServices !== prevState.subscribedServices){
            this.handleAppMessage();
        }

        if (this.state.services !== prevState.services){
            this.handleAppMessage();
        }
    }

    getAvailableServices = () => {
        const servicespath = "https://425ee274.us-south.apigw.appdomain.cloud/service/"
        const aservicespath = servicespath + "getservices"
          axios.get(aservicespath, {
            cancelToken: source.token
          })
          .then((res) => {
          const data = res.data
          if (data.statusCode === 200){
            let info = JSON.parse(res.data.body); 
            this.setState({services: info.services});
          }
          })
          .catch((e) => console.error(e));
      };

    getSubscribedServices = () => {
        const {userinfo} = this.props;
        const servicespath = "https://425ee274.us-south.apigw.appdomain.cloud/service/"
        const aservicespath = servicespath + "getsubscribedservices"
          axios.get(aservicespath,{params: {user_id: userinfo[0]}})
          .then((res) => {
          const data = res.data
          if (data.statusCode === 200){
            let info = JSON.parse(res.data.body); 
            this.setState({subscribedServices: info});
          }
          })
          .catch((e) => console.error(e));
    };

    onSubscribe = (servicename) => {
        this.subscriptionMessage(servicename);
        const {userinfo} = this.props;
        const servicespath = "https://425ee274.us-south.apigw.appdomain.cloud/service/"
        const aservicespath = servicespath + "subscribe";
        const {subscribedServices} = this.state;
        
        if (!subscribedServices.includes(servicename)){
            axios.post(aservicespath, {
                serviceName: servicename,
                user_id:userinfo[0],
                user_name:userinfo[2],
            })
            .then((resp) => {
                if (resp.data.statusCode === 200){
                    this.getSubscribedServices();
                }
            })
            .catch((e) => console.error(e.response))
        }
        

        if (servicename === "Sector-Watch"){
            this.toggleSectorModal()
        }else if (servicename === "Suspicious-Trades-Tracker"){
            this.toggleSusModal()
        }else{
            this.toggleTrafficModal()
        }
    };

    onUnSubscribe = (servicename) => {
        const {userinfo} = this.props;
        const servicespath = "https://425ee274.us-south.apigw.appdomain.cloud/service/"
        const aservicespath = servicespath + "unsubscribe";
        const {subscribedServices} = this.state;
        if (subscribedServices.includes(servicename)){
            axios.post(aservicespath, {
                serviceName: servicename,
                user_id:userinfo[0],
            })    
            .then((resp) => {
                if (resp.data.statusCode === 200){
                    this.getSubscribedServices();
                }
            })
            .catch((e) => console.error(e))
        }
    };

    subscriptionMessage = (servicename) => {
        const {subscribedServices} = this.state;
        const servicesubbed = subscribedServices.includes(servicename);
        const message = servicesubbed ? '': <h5>Subscribing to service .. {servicename}</h5>;
        this.setState({appMesage: message});
    };

    setSubScribedServices = () => {
        const {userinfo} = this.props;
        this.setState({subscribedServices: userinfo[3]})
    };

    toggleSectorModal = ()=> {
        const {showSectorServiceModal} = this.state;
        
        this.setState({showSectorServiceModal: !showSectorServiceModal});
    
    };

    toggleSusModal = ()=> {
        const {showSusServiceModal} = this.state;
        
        this.setState({showSusServiceModal: !showSusServiceModal});
    };
    
    toggleTrafficModal = ()=> {
        const {showTrafficServiceModal} = this.state;
        
        this.setState({showTrafficServiceModal: !showTrafficServiceModal});
    };

    onLogoutClick = () => {
        window.location.reload();
    };

    handleAppMessage = () => {
        const {services, subscribedServices} = this.state;

        const message = subscribedServices.length === 0 ? <h3>You are not subscribed to any services.<br></br> View the services menu for available services to subscribe to!</h3>:'';

        let servicesUnavailable;
        if (subscribedServices.length > 0){
            servicesUnavailable = subscribedServices.map((service) => {
                if (!services.includes(service)){
                    return <h3 key={service}>Subcribed service: {service} is currrently unavailable.</h3>
                }
                return '';
        })
        }else{
            servicesUnavailable = ''
        } 

        const displayMessage = (message === '') ? servicesUnavailable: message
        this.setState({appMesage: displayMessage});
    }

    navbar = () => {
        const navbarstyle = {
            backgroundColor: "purple",
        }
        const {userinfo} = this.props;
        const {services} = this.state;
    
        const sectorWatch = 'Sector-Watch';
        const suspicious = 'Suspicious-Trades-Tracker';
        const traffic = 'Traffic-Tracker';

        const isSecAvailable = services.includes(sectorWatch);
        const isSusAvailable = services.includes(suspicious);
        const isTrafficAvailable = services.includes(traffic);
        
        const dropItemOne = isSecAvailable ? <NavDropdown.Item onClick={() => this.toggleSectorModal()} ref={this.wrapper}>{sectorWatch}</NavDropdown.Item> : '';
        const dropItemTwo = isSusAvailable ? <NavDropdown.Item onClick={() => this.toggleSusModal()} ref={this.wrapper}>{suspicious}</NavDropdown.Item> : '';
        const dropItemThree = isTrafficAvailable ? <NavDropdown.Item onClick={() => this.toggleTrafficModal()} ref={this.wrapper}>{traffic}</NavDropdown.Item> : '';
        const noAvailableService = (!isSecAvailable && !isSusAvailable && !isTrafficAvailable)
        const dropItemFour = noAvailableService ? <NavDropdown.Item ref={this.wrapper} disabled> No available service</NavDropdown.Item> : '';
    
        return (
            <Navbar expand="lg" style={navbarstyle}>
                <Navbar.Brand id="title"> $Financial Service Collection </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                    <NavDropdown title="Services" id="basic-nav-dropdown" className="navbaritems">
                        {dropItemOne}
                        {dropItemTwo}
                        {dropItemThree}
                        {dropItemFour}
                    </NavDropdown>
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
        const {services, subscribedServices, showSectorServiceModal, showSusServiceModal, showTrafficServiceModal,appMesage} = this.state;
        const sectorDescription = "Service allows you to view sector performance for select dates in 2011."
        const suspiciousDescription = "Service allows you to view the symbols of companies who made suspicious trades on select dates in 2011."
        const trafficDescription = "Service allows you to view active companies on select dates in 2011."


        const sectorWatch = 'Sector-Watch';
        const suspicious = 'Suspicious-Trades-Tracker';
        const traffic ='Traffic-Tracker';

        const isSecSubscribed = subscribedServices.includes(sectorWatch);
        const isSusSubscribed = subscribedServices.includes(suspicious);
        const isTrafficSubscribed = subscribedServices.includes(traffic);

        const showSectorService = (isSecSubscribed && services.includes(sectorWatch));
        const showSusService = (isSusSubscribed && services.includes(suspicious));
        const showTrafficService = (isTrafficSubscribed && services.includes(traffic));

        const modal1 = showSectorServiceModal ? <ServiceModal title="Sector-Watch" body={sectorDescription} CloseModal={this.toggleSectorModal} onSub={this.onSubscribe} isShowing={showSectorServiceModal} ref={this.wrapper} isDisabled={isSecSubscribed}/> : '';
        const modal2 = showSusServiceModal ? <ServiceModal title="Suspicious-Trades-Tracker" body={suspiciousDescription} CloseModal={this.toggleSusModal} onSub={this.onSubscribe} isShowing={showSusServiceModal} ref={this.wrapper} isDisabled={isSusSubscribed}/>: '';
        const modal3 = showTrafficServiceModal ? <ServiceModal title="Traffic-Tracker" body={trafficDescription} CloseModal={this.toggleTrafficModal} onSub={this.onSubscribe} isShowing={showTrafficServiceModal} ref={this.wrapper} isDisabled={isTrafficSubscribed}/> : '';
        
        return (  
            <div id="mainPage">
                <div>
                {this.navbar()}
                </div>
                <div className="platformMessage">
                    {appMesage}
                </div>
                {modal1}
                {modal2}
                {modal3}
                <Service title={sectorWatch} isShowing={showSectorService} onUnsubscribe={this.onUnSubscribe}/>
                <Service title={suspicious} isShowing={showSusService} onUnsubscribe={this.onUnSubscribe}/>
                <Service title={traffic} isShowing={showTrafficService} onUnsubscribe={this.onUnSubscribe}/>
            </div>
        );
    }
}
 
Main.propTypes = {
    userinfo: PropTypes.array.isRequired,
}

export default Main;