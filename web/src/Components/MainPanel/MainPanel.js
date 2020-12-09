//This is the main component. It is a container for the graph components. 

import React, { Component } from "react";
import './MainPanel.css'
import Scatterplot from "./Scatterplot/Scatterplot.js"
import WordCloud from "./WordCloud/WordCloud.js"
import { Tab } from 'semantic-ui-react'
import {createPointObject} from '../Shared'

export default class MainPanel extends Component {

    constructor(props) {
        super(props)
        this.state = {
            panes: null,
            apiResult: null,
            pointData: null
        }
    }

    pointDataCallback = (pointData) => {
        this.props.pointDataCallback(pointData)
    }    

    componentDidUpdate() {
        // TODO: Add some unique RUN_ID to the result object
        if (this.props.apiResult !== this.state.apiResult) {
            // let apiResult = JSON.parse(this.props.jsonApiResult);
            let apiResult = this.props.apiResult;
            let viz_df = JSON.parse(apiResult.viz_df);
            let cluster_topics = apiResult.main_cluster_topics;
            let dataPoints = [];

            for (var i = 0; i < apiResult.count; i++) {
                dataPoints.push(createPointObject(viz_df, cluster_topics, i));
            }

            let panes = [
                { menuItem: 'Scatterplot',  pane: { key: 'pane1', content: <Scatterplot data={dataPoints} runtime={this.props.apiResult.runtime} pointData={this.pointDataCallback} visualizationMethod={apiResult["visualizationMethod"]}/> }, className:'fullWindow'},
                { menuItem: 'Word Cloud', pane: { key: 'pane2', content: <WordCloud data={dataPoints} runtime={this.props.apiResult.runtime}/>}, className:'fullWindow' },
            ]
            
            this.setState({
                panes: panes,
                apiResult: this.props.apiResult
            })
        }

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

