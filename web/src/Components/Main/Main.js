//This is the main component. It is a container for the graph components. 

import React, { Component } from "react";
import './Main.css'
import Scatterplot from "./Scatterplot/Scatterplot.js"
import WordCloud from "./WordCloud/WordCloud.js"
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
        this.props.pointData(pointData)
    }

    

    componentDidUpdate() {
        let panes = [
            { menuItem: 'Scatterplot',  pane: { key: 'pane1', content: <Scatterplot data={this.props.graphData} pointData={this.getPointData.bind(this)}/> }, className:'fullWindow'},
            { menuItem: 'Word Cloud', pane: { key: 'pane2', content: <WordCloud data={this.props.graphData} pointData={this.getPointData.bind(this)}/>}, className:'fullWindow' },
        ]

        if (this.props.graphData !== this.state.graphData)
            this.setState({
                panes: panes,
                graphData: this.props.graphData
            })

        document.getElementById('graphTabs').hidden = false;
    }


    render() {
        return (
            <div className='main-wrapper' id='mainWrapper'>
                <div id='graphTabs' className='main' hidden={true}>
                    <Tab className = 'fullWindow' menu = {{ fluid:true, widths:3,  attached: true , pointing: true , className: 'tabs'}} panes={this.state.panes} renderActiveOnly={false} />
                </div>
            </div>
        );
    }

}

