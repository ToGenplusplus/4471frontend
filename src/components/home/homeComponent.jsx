import React, { Component } from 'react';
import './homeComponent.css';
import applogo from '../../applogo.png'
//import axios from 'axios';
import AppID from 'ibmcloud-appid-js';
import Button from '../button/buttonComponent'

class Home extends Component {
    state = { isAdmin: false, errormessage:''}

    authenticate = () => {
        
    }

    stateChange = (newstate) => {
        this.setState(newstate);
    }
    onLoginButtonClick = () => {
        let tokens;
        let userinfo;

        const appID = new AppID();
        appID.init({clientId: "16c9bb34-cb09-473c-9aae-2e903bd596cc", discoveryEndpoint: "https://us-south.appid.cloud.ibm.com/oauth/v4/6facaa33-0f16-45b0-8554-5cba3aa02b8e/.well-known/openid-configuration"})
        .then((res) => console.log(res))
        .catch(e => this.stateChange({errormessage: e}))

        appID.signin()
        .then((res) => {
            tokens = res.data;
        })
        .catch(e => this.stateChange({errormessage: e}))

        appID.getUserInfo(tokens.accessToken)
        .then((res) => {
            userinfo = res.data;
            console.log(userinfo);
        })
        .catch(e => this.stateChange({errormessage: e}))

    }

    render() { 
        const {errormessage} = this.state;
        return (  
            <div id="homeDisplaydiv">
                <div id="homeTitleDisplay">
                    <img src={applogo} alt="financial service collection"/>
                </div>
                <Button name="Register/login" onClickFunction={this.onLoginButtonClick}/>
                <div id="error">{errormessage}</div>
            </div>
        );
    }
}
 

export default Home;