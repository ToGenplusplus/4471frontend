import React, { Component } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
//import Home from './components/home/homeComponent';
import Service from './components/serviceArea/serivce';

class App extends Component {
    render() {
        return (
            <Service title="Sector-Watch" isShowing={true}/>
        );
    }
}

export default App;