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
                    <div className = 'card-wrapper'>
                        <div class="card">
                            <div><span>Label</span> <h3>{pointInfo.label}</h3></div>
                            <div><span>Cluster</span> <h3>{pointInfo.cluster}</h3></div>
                        </div>
                        <div class="card"><h4>Phrase</h4> {phrase}</div>
                        <div class="card"><h4>Raw Sentence</h4> {pointInfo.raw_sent}</div>
                        <div class="card"><h4>Cluster Info</h4> {cluster_info}</div>
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