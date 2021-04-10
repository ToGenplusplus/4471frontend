import React, { Component } from 'react';
import applogo from '../../applogo.png'
import axios from 'axios';
import AppID from 'ibmcloud-appid-js';
import AppButton from '../button/buttonComponent'
import './homeComponent.css'

class Home extends Component {

    constructor() {
        super();
        this.state = { isAdmin: false, errormessage:''};
        this.onLoginButtonClick = this.onLoginButtonClick.bind(this);
    }

    handleError = (e) => {
        this.setState({errormessage: e})
    }

    authenticate = (userinfo) => {
        const servicespath = "https://425ee274.us-south.apigw.appdomain.cloud/service/"
        const aservicespath = servicespath + "auth"
          axios.post(aservicespath, { user_id: userinfo.userid, user_name:userinfo.username })
          .then((res) => {
          const data = res.data
          if (data.statusCode === 200 || data.statusCode === 400){
            let info = JSON.parse(res.data.body); 
            if (info.isAdmin){
              let allinfo = Object.assign(info, {access: userinfo.token})
              //this.currentUserInfo = allinfo;
              console.log(allinfo)
            }else{
                console.log(info)
            }
          }
          })
          .catch((e) => this.handleError(e.message))
      };

    async onLoginButtonClick (){
        try {
            const appID = new AppID();
            await appID.init({clientId: "16c9bb34-cb09-473c-9aae-2e903bd596cc", discoveryEndpoint: "https://us-south.appid.cloud.ibm.com/oauth/v4/6facaa33-0f16-45b0-8554-5cba3aa02b8e/.well-known/openid-configuration"});
            const tokens = await appID.signin();

            let userInfo = await appID.getUserInfo(tokens.accessToken);

            const user_name = userInfo.preferred_username;
            const user_id = userInfo.identities[0].id

            const user = {userid:user_id, username:user_name, token:tokens.accessToken}
            //this.authenticate(user)
          } catch (e) {
            this.handleError(e.message);
          }
    };

    render() { 
        const {errormessage} = this.state;
        const style = {
            backgroundColor: "purple",
            padding : 10,
            marginTop: 10,
        }
        return (  
            <div id="homeDisplaydiv">
                <div id="homeTitleDisplay">
                    <img src={applogo} id="applogo" alt="financial service collection"/>
                </div>
                <div id="authbutton">
                <AppButton name="Register / Login" onClickFunction={this.onLoginButtonClick} style={style}/>
                </div>
                <div className="error">{errormessage === ''? '': `Error : ${errormessage}`}</div>
            </div>
        );
    }
}


export default Home;