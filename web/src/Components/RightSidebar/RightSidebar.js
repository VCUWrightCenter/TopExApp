//This is where the data is diplayed when you click on a data point. 

import React, { Component } from "react";
import './RightSidebar.css'

class RightSidebar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            pointData: null,
            pointDisplay: ""
        }
    }

    componentDidUpdate() {
        if (this.props.pointData) {
            let pointInfo = JSON.parse(this.props.pointData)

            if (JSON.stringify(this.state.pointData) !== JSON.stringify(pointInfo)) {
                let cluster_info = pointInfo.cluster_info.join(", ")
                let phrase = pointInfo.phrase.join(", ");
                
                this.setState({
                    pointData: pointInfo,
                    pointDisplay: (
                    <div className = 'dataPointText'>
                        <div>Label: {pointInfo.label}</div>
                        <br/>
                        <div>Cluster: {pointInfo.cluster}</div>
                        <br/>
                        <div>Phrase: {phrase}</div>
                        <br/>
                        <div>Raw Sentence: {pointInfo.raw_sent}</div>
                        <br/>
                        <div>Cluster Info: {cluster_info}</div>
                    </div>
                    )
                })
            }
        }
    }


    render() {
        return (
            <div className='right-sidebar'>
                {this.state.pointDisplay}
            </div>

        );
    }
}

export default RightSidebar