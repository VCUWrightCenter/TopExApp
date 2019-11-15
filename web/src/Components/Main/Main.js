import React, { Component } from "react";
import './Main.css'
import Scatterplot from  "./Scatterplot/Scatterplot.js"


export default class Main extends Component {

    // componentDidUpdate(){
    //     console.log("MAIN UPDATED WITH PROPS = " + this.props.graphData)
    // }

    render() {
        return (
            <div className='main-wrapper'>
                <div className='main'>
                    <Scatterplot data = {this.props.graphData}/>
                </div>
            </div>
        );
    }

}

