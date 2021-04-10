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

    render() { 

        const {headers, isShowing} = this.props;

        return (  
            <div className="serviceTable">
                <Table striped bordered hover size="sm">
                    <thead>
                        <tr>
                        <th>#</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Username</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                        <td>1</td>
                        <td>Mark</td>
                        <td>Otto</td>
                        <td>@mdo</td>
                        </tr>
                        <tr>
                        <td>2</td>
                        <td>Jacob</td>
                        <td>Thornton</td>
                        <td>@fat</td>
                        </tr>
                        <tr>
                        <td>3</td>
                        <td colSpan="2">Larry the Bird</td>
                        <td>@twitter</td>
                        </tr>
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
}
export default ServiceTable;