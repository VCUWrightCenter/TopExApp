import React, { Component } from "react";
import './Main.css'
import Scatterplot from "./Scatterplot/Scatterplot.js"
import { Tab } from 'semantic-ui-react'

export default class Main extends Component {

    constructor(props) {
        super(props)
        this.state = {
            panes: null
        }
    }

    componentDidUpdate() {
        //console.log("MAIN UPDATED WITH PROPS = ")
        let panes = [
            { menuItem: 'Tab 1', pane: {key: 'pane1', content: <Scatterplot data = {this.props.graphData}/>}},
            { menuItem: 'Tab 2', pane: 'tab 2 content'},
            { menuItem: 'Tab 3', pane: 'tab 3 content'},
        ]

        if (this.state.panes == null) {
            this.setState({
                panes: panes
            })
        }
    }





    render() {
        return (
            <div className='main-wrapper'>
                <div className='main'>
                    <Tab panes={this.state.panes} renderActiveOnly={false} />
                </div>
            </div>
        );
    }

}

