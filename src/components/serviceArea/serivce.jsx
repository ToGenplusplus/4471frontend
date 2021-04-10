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
    state = { dateSelected:false, sectorContent:[], susContent:[], trafficContent:[] }

    formatDate = (date)=> {
        const vals = date.split("-");
        const reqdate = vals.join('');
        return reqdate;
    }

    handleClick = (date) => {
        const {title} = this.props;

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
            console.log(sectorcontent);
            this.setState({sectorContent:sectorcontent});
          }
          })
          .catch((e) => console.error(e));
          
    };

    formatPerformanceData = (data) => {
        let performanceArray = [];
        data.forEach((sector) => {
            const close = sector.close /10000;
            const high = sector.high/10000;
            const low = sector.low/10000;
            const change = sector.change !== 0 ? sector.change/10000 : sector.change;
            const changepct  = sector.change_pct.toFixed(2);
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
        const {title} = this.props;

        const sectorWatch = 'Sector-Watch';
        const suspicious = 'Suspicious-Trades-Tracker';

        let whichClickFunction;

        if (title === sectorWatch){
            whichClickFunction = () => this.getSectorPerformance;
        }else if(title === suspicious){
            whichClickFunction = () => this.getSusCompanies;
        }else{
            whichClickFunction = () => this.getTraffic;
        }


        const dropdownItems = dates.map((date) => {const reqdate = this.formatDate(date);  return <Dropdown.Item as="button" onClick={() => this.handleClick(reqdate)} key={date} ref={this.wrapper}>{date}</Dropdown.Item>} )
        return(
            <DropdownButton id="dropdown-item-button" title="Select Date" style={{marginTop:"20px"}}>
                <div style={{overflowY:"auto", height:"200px"}}>
                    {dropdownItems}
                </div>
            </DropdownButton>
        );
    }
    render() { 
        const {title, onUnsubscribe,isShowing} = this.props;
        const {sectorContent,susContent,trafficContent} = this.state; 
        
        const secheads = ["Sector","Close","High","Low","Change","Change PCT"];
        const susheads = ["Company Ticker"];
        const trafficheads = ["Company"];

        const sectorWatch = 'Sector-Watch';
        const suspicious = 'Suspicious-Trades-Tracker';
        
        let displayTable;
        if (title === sectorWatch){
            displayTable = <ServiceTable headers={secheads} content={sectorContent}/>
        }else if(title === suspicious){
            displayTable = <ServiceTable headers={susheads} content={susContent}/>
        }else{
            displayTable = <ServiceTable headers={trafficheads} content={trafficContent}/>
        }
       // {this.dateDropdown()}
        return (
        <div className="servicesDiv" style={{display: isShowing ? "block" : "none"}}>
            <h3>{title}</h3>
            {this.dateDropdown()}
            {displayTable}
            <Button variant="primary" onClick={onUnsubscribe} className="unsubscribeButton">
                    Unsubscribe
            </Button>
        </div>  
        );
    }
}

Service.propTypes = {
    title: PropTypes.string,
    isShowing: PropTypes.bool,
    onUnsubscribe: PropTypes.func,
}
 
export default Service;