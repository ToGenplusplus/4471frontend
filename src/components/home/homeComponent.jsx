import React, { Component } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import axios from 'axios';
import AppID from 'ibmcloud-appid-js';
import AppButton from '../button/buttonComponent'
import Main from '../main/mainComponent';
import Admin from '../admin/adminComponent';
import './homeComponent.css'

let source;


const appID = new AppID();

class Home extends Component {

    constructor() {
        super();
        this.state = { userinfo:[], isAdmin: false, errormessage:'', isDisplaying: true, loginClicked:false, services:[]};
        this.onLoginButtonClick = this.onLoginButtonClick.bind(this);
        source = axios.CancelToken.source();
    }
    componentDidMount(){
        this.getAvailableServices();
        this.init();
    }

    componentWillUnmount(){
        if (source) {
            source.cancel("Home Component got unmounted");
        }
    }

    init = () => {
        (async () => {
            try {
                await appID.init({clientId: "16c9bb34-cb09-473c-9aae-2e903bd596cc", discoveryEndpoint: "https://us-south.appid.cloud.ibm.com/oauth/v4/6facaa33-0f16-45b0-8554-5cba3aa02b8e/.well-known/openid-configuration"});
            
            } catch (e) {
                this.handleError(e)
            }
        })();
    };

    handleError = (e) => {
        const reload = `${e} reload page!`;
        this.setState({errormessage: reload})
    }

    setCurrentUser = (info) => {
        this.setState({userinfo: info})
    }

    toggleDisplay = () => {
        this.setState({isDisplaying: !this.state.isDisplaying});
    }
    
    toggleButtonClick = () => {
        this.setState({loginClicked: !this.state.loginClicked})
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

    authenticate = (userinfo) => {
        const servicespath = "https://425ee274.us-south.apigw.appdomain.cloud/service/"
        const aservicespath = servicespath + "auth"
          axios.post(aservicespath, { user_id: userinfo.userid, user_name:userinfo.username })
          .then((res) => {
          const data = res.data
          if (data.statusCode === 200 || data.statusCode === 400){
            let info = JSON.parse(res.data.body); 
            let userarray;
            if (info.isAdmin){
              let allinfo = Object.assign(info, {access: userinfo.token})
              userarray = [allinfo._id,allinfo.isAdmin,allinfo.username,allinfo.services,allinfo.access];
              this.setCurrentUser(userarray);
              this.setState({isAdmin: true});
              this.toggleDisplay();
            }else{
                const subservices = info.services.map((obj) => {return obj.name})
                userarray = [info._id,info.isAdmin,info.username,subservices];
                this.setCurrentUser(userarray);
                this.toggleDisplay();
            }
          }
          })
          .catch((e) => this.handleError(e.message))
      };

    async onLoginButtonClick (){
        try {
            this.toggleButtonClick();
            const tokens = await appID.signin();

            let userInfo = await appID.getUserInfo(tokens.accessToken);

            const user_name = userInfo.preferred_username;
            const user_id = userInfo.identities[0].id

            const user = {userid:user_id, username:user_name, token:tokens.accessToken}
            this.authenticate(user)
          } catch (e) {
            this.handleError(e.message);
          }
    };
    navbar = () => {
        const navbarstyle = {
            backgroundColor: "transparent",
            fontWeight: "bolder",
            marginBottom:"20px",
        }
        
    
        return (
            <Navbar expand="lg" style={navbarstyle}>
                <Navbar.Brand id="homeNavTitle" className="homeNavItem"> $Financial Service Collection </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                    </Nav>
                    <Nav>
                        <Nav.Link onClick={this.onLoginButtonClick} ref={this.wrapper} style={{fontSize:"large"}} id="navSignin" className="homeNavItem">Sign In</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    };

    render() { 
        const {errormessage,isAdmin,userinfo, isDisplaying,loginClicked,services} = this.state;
        const buttonstyle = {
            padding : 10,
            marginTop: "6%",
            width:"25%",
            
        }
        const disp = isDisplaying ? "block" : "none";
        const homedisplay = {
            display: disp,
        }

        let displayed;
        let mainDisplayed ='';
        
            if (errormessage !== ''){
                
                    displayed = <div className="error">{errormessage === ''? '': `Error : ${errormessage}`}</div>
                
            }else{
                if (!isAdmin) {
                    if(userinfo.length !== 0 && loginClicked){
                        mainDisplayed = <Main userinfo={userinfo} appServices={services}/>
                    }else if(userinfo.length === 0 && loginClicked){
                        displayed = <div className="noError">Entering platform ... </div>
                    }
                }else{
                    if(userinfo.length !== 0 && loginClicked){
                        mainDisplayed = <Admin userinfo={userinfo}/>
                    }else if(userinfo.length === 0 && loginClicked){
                        displayed = <div className="noError">Entering platform ... </div>
                    }
                } 
                    
            }
        
        return (  
            <div>
                <div id="homeDisplaydiv" style={homedisplay}>
                {this.navbar()}
                    <div id="homeTitleDisplay">
                        <h3 id="hometitle">$<br></br>Financial Service <br></br>Collection</h3>
                    </div>
                    <div id="subtitleHome">
                        <h5>Platform providing 2011 stock data services for individuals.</h5>
                    </div>
                    <div id="authbutton">
                    <AppButton name="Register / Sign In" onClickFunction={this.onLoginButtonClick} style={buttonstyle} id="homeRegister"/>
                    </div>
                    {displayed}
                </div>
                {mainDisplayed}
            </div>
        );
    }
}


export default Home;