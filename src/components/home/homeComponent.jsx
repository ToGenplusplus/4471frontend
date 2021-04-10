import React, { Component } from 'react';
import applogo from '../../applogo.png'
import axios from 'axios';
import AppID from 'ibmcloud-appid-js';
import AppButton from '../button/buttonComponent'
import Main from '../main/mainComponent';
import './homeComponent.css'


class Home extends Component {

    constructor() {
        super();
        this.state = { userinfo:[], isAdmin: false, errormessage:'', isDisplaying: true, loginClicked:false};
        this.onLoginButtonClick = this.onLoginButtonClick.bind(this);
    }

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
                userarray = [info._id,info.isAdmin,info.username,info.services];
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
            const appID = new AppID();
            await appID.init({clientId: "16c9bb34-cb09-473c-9aae-2e903bd596cc", discoveryEndpoint: "https://us-south.appid.cloud.ibm.com/oauth/v4/6facaa33-0f16-45b0-8554-5cba3aa02b8e/.well-known/openid-configuration"});
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

    render() { 
        const {errormessage,isAdmin,userinfo, isDisplaying,loginClicked} = this.state;
        const buttonstyle = {
            backgroundColor: "purple",
            padding : 10,
            marginTop: 10,
        }
        const disp = isDisplaying ? "block" : "none";
        const homedisplay = {
            display: disp,
        }

        let displayed;
        
            if (errormessage !== ''){
                
                    displayed = <div className="error">{errormessage === ''? '': `Error : ${errormessage}`}</div>
                
            }else{
                if (!isAdmin) {
                    if(userinfo.length !== 0 && loginClicked){
                        displayed = <Main userinfo={userinfo}/>
                    }else if(userinfo.length === 0 && loginClicked){
                        displayed = <div className="error">Entering platform, please wait ... </div>
                    }
                } 
                    
            }
        
        return (  
            <div>
                <div id="homeDisplaydiv" style={homedisplay}>
                    <div id="homeTitleDisplay">
                        <img src={applogo} id="applogo" alt="financial service collection"/>
                    </div>
                    <div id="authbutton">
                    <AppButton name="Register / Login" onClickFunction={this.onLoginButtonClick} style={buttonstyle}/>
                    </div>
                </div>
                {displayed}
            </div>
        );
    }
}


export default Home;