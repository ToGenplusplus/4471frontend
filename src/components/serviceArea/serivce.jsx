import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import ServiceTable from '../serviceTable/servicetable';
import './service.css';

class Service extends Component {
    constructor(props) {
        super(props);
        this.wrapper = React.createRef();  }
    state = { dateSelected:false, dateChosen: '', sectorContent:[], susContent:[], trafficContent:[], buttonpressed:false}

    componentDidUpdate(prevProps,prevState){
        if (prevState.buttonpressed === true){
            this.setState({
                buttonpressed: false
            }); 
        }
    }
 

    formatDate = (date)=> {
        const vals = date.split("-");
        const reqdate = vals.join('');
        return reqdate;
    }

    handleClick = (date) => {
        const {title} = this.props;
        const {dateSelected} = this.state;

        this.setState({dateChosen:date })
        if (!dateSelected){
            this.setState({dateSelected: !dateSelected});
        }

        const sectorWatch = 'Sector-Watch';
        const suspicious = 'Suspicious-Trades-Tracker';

        if (title === sectorWatch){
            this.getSectorPerformance(date);
        }else if(title === suspicious){
            this.getSusCompanies(date);
        }else{
            this.getTraffic(date);
        }
        
    }

    getSectorPerformance = (adate) => {
        const servicespath = "https://425ee274.us-south.apigw.appdomain.cloud/service/"
        const aservicespath = servicespath + "sector/performance"

          axios.get(aservicespath,{params: {date: adate}})
          .then((res) => {
          const data = res.data
          if (data.statusCode === 200){
            let info = JSON.parse(res.data.body); 
            const sectorcontent = this.formatPerformanceData(info.sectors);
            this.setState({sectorContent:sectorcontent});
          }
          })
          .catch((e) => console.error(e));
          
    };

    formatPerformanceData = (data) => {
        let performanceArray = [];
        data.forEach((sector) => {
            const nullval = sector.change === null;
            const close = sector.close /10000;
            const high = sector.high/10000;
            const low = sector.low/10000;
            const change = (sector.change !== 0 && !nullval) ? sector.change/10000 : sector.change;
            const changepct  = nullval ? null: sector.change_pct.toFixed(2);
            let dataArray = [sector.sector_name,close,high,low,change,changepct];
            performanceArray.push(dataArray);
        })
        return performanceArray;
    };

    getSusCompanies = (adate) => {
        const servicespath = "https://425ee274.us-south.apigw.appdomain.cloud/service/"
        const aservicespath = servicespath + "suspicious"
          axios.get(aservicespath,{params: {date: adate}})
          .then((res) => {
          const data = res.data
          if (data.statusCode === 200){
            let info = JSON.parse(res.data.body); 
            const suscontent = info.symbols;
            this.setState({susContent:suscontent});
          }
          })
          .catch((e) => console.error(e));
    };

    getTraffic = (adate) => {
        const servicespath = "https://425ee274.us-south.apigw.appdomain.cloud/service/"
        const aservicespath = servicespath + "traffic"
          axios.get(aservicespath,{params: {date: adate}})
          .then((res) => {
          const data = res.data
          if (data.statusCode === 200){
            let info = JSON.parse(res.data.body); 
            const trafficcontent = info;
            this.setState({trafficContent:trafficcontent});
          }
          })
          .catch((e) => console.error(e));
    };


    dateDropdown = () => {
        const dates = ["2011-01-13","2011-01-24","2011-02-03","2011-02-15","2011-03-10",
        "2011-03-16","2011-04-13","2011-04-26","2011-05-03","2011-05-18",
        "2011-06-02","2011-06-16","2011-07-06","2011-07-21","2011-08-18",
        "2011-08-29","2011-09-19","2011-09-30","2011-10-20","2011-10-31",
        "2011-11-21","2011-11-25","2011-11-29","2011-12-06","2011-12-07",
        ];

        const dropdownItems = dates.map((date) => {const reqdate = this.formatDate(date);  return <Dropdown.Item as="button" onClick={() => this.handleClick(reqdate)} key={date} ref={this.wrapper}>{date}</Dropdown.Item>} )
        return(
            <DropdownButton variant="primary"  title="Select Date" style={{marginTop:"10px"}} className="dropdown">
                <div style={{overflowY:"auto", height:"200px"}}>
                    {dropdownItems}
                </div>
            </DropdownButton>
        );
    }

    displayTable = (service) => {

        const {sectorContent,susContent,trafficContent,dateSelected} = this.state; 

        const secheads = ["Sector","Close","High","Low","Change","Change %"];
        const susheads = ["Company Ticker"];
        const trafficheads = ["Company"];

        const sectorWatch = 'Sector-Watch';
        const suspicious = 'Suspicious-Trades-Tracker';
        const traffic = 'Traffic-Tracker'

        let displayTable;
        if (service === sectorWatch){
            displayTable = <ServiceTable headers={secheads} content={sectorContent} isShowing={dateSelected} whichService={sectorWatch}/>
        }else if(service === suspicious){
            displayTable = <ServiceTable headers={susheads} content={susContent} isShowing={dateSelected} whichService={suspicious}/>
        }else{
            displayTable = <ServiceTable headers={trafficheads} content={trafficContent} isShowing={dateSelected} whichService={traffic}/>
        }

        return displayTable;
    }
    onClick = (title)=>{
        this.props.onUnsubscribe(title);
        this.setState({
            buttonpressed: !this.state.buttonpressed
        });
    }

    render() { 
        const {title,isShowing} = this.props;
        const {dateSelected, dateChosen, buttonpressed} = this.state;
        
        const display = this.displayTable(title);
        let buttonDisplay;
        if (buttonpressed){
            buttonDisplay = <Button variant="primary" className="unsubscribing" disabled>Unsubscribing...</Button>
        }else{
            buttonDisplay = <Button variant="primary" onClick={() => this.onClick(title)} className="unsubscribeButton colorprop">Unsubscribe</Button>
        }

        return (
        <div id={title} className="servicesDiv" style={{display: isShowing ? "block" : "none"}}>
            <h3>{title}</h3>
            {this.dateDropdown()}
            <label id="dateselected" style={{display: dateSelected ? "block" : "none", fontWeight:"bold", marginTop:"10px"}}>Date: {dateChosen}</label>
            {display}
            {buttonDisplay}
        </div>  
        );
    }
}

Service.propTypes = {
    title: PropTypes.string.isRequired,
    isShowing: PropTypes.bool.isRequired,
    onUnsubscribe: PropTypes.func.isRequired,
}
 
export default Service;