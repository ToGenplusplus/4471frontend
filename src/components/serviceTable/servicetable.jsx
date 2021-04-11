import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Table from 'react-bootstrap/Table';
import "./servicetable.css";

class ServiceTable extends Component {
    state = { content: [] }

    componentDidMount(){
        const {content} = this.props;
        this.setState({content:content});
    }

    extractSecServiceData = (dataContent) => {
        const dataRows = dataContent.map((sector,index) => {
            const hasChangeValue = sector[4] !== null;
            let valuestyle;
            if (hasChangeValue){
                valuestyle = {
                    color: parseFloat(sector[5]) > 0 ? "green" : "red"
                }
            }else{
                valuestyle = {}
            }
            return (
                <tr key={index}>
                    <td>{sector[0]}</td>
                    <td>{sector[1]}</td>
                    <td>{sector[2]}</td>
                    <td>{sector[3]}</td>
                    <td style={valuestyle}>{hasChangeValue ? sector[4]:'N/A'}</td>
                    <td style={valuestyle}>{hasChangeValue ? sector[4]:'N/A'}</td>
                </tr>
        
            );
        })

        return dataRows;
    };

    extractSusServiceData = (content) => {
        
    };

    extractTrafficServiceData = (content) => {
        
    };

    render() { 

        const {headers, isShowing, whichService} = this.props;

        const {content} = this.state;
        

        const serviceHeaders = headers.map((heading) => {return <th key={heading}>{heading}</th>})

        let tableData;
        if (whichService === 'Sector-Watch'){
            tableData = this.extractSecServiceData(content);
        }

        return (  
            <div className="serviceTable" style={{display: isShowing ? "block":"none"}}>
                <Table striped bordered hover size="sm">
                    <thead>
                        <tr>
                        {serviceHeaders}
                        </tr>
                    </thead>
                    <tbody>
                        {tableData}
                    </tbody>
                </Table>
            </div>

        );
    }
}
 
ServiceTable.propTypes = {
    headers: PropTypes.array,
    content: PropTypes.array, //contains arrays for each row
    isShowing: PropTypes.bool,
    whichService: PropTypes.string,
}
export default ServiceTable;