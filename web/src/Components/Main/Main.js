import React, { Component } from "react";
import './Main.css'
import Scatterplot from "./Scatterplot/Scatterplot.js"
import { Tab } from 'semantic-ui-react'

export default class Main extends Component {

    constructor(props) {
        super(props)
        this.state = {
            panes: null,
            graphData: null,
            pointData: null
        }
    }

    getPointData = (pointData) => {
        console.log("main point data", pointData);

        this.props.pointData(pointData)

    }

    componentDidUpdate() {
        //console.log("MAIN UPDATED WITH PROPS")
        let panes = [
            { menuItem: 'Scatterplot', pane: { key: 'pane1', content: <Scatterplot data={this.props.graphData} pointData={this.getPointData.bind(this)} className='pane'/> } },
            { menuItem: 'Tab 2', pane: 'tab 2 content' },
            { menuItem: 'Tab 3', pane: 'tab 3 content' }
        ]

        if (this.props.graphData != this.state.graphData)
            this.setState({
                panes: panes,
                graphData: this.props.graphData
            })

        document.getElementById('graphTabs').hidden = false;
    }


    render() {
        return (
            <div className='main-wrapper' id='mainWrapper'>
                <div id='graphTabs' className='main' hidden='true'>
                    <Tab panes={this.state.panes} renderActiveOnly={false} />
                </div>
            </div>
        );
    }

}

