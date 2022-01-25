//This is where the data is diplayed when you click on a data point. 

import React, { Component } from "react";
import Button from '@material-ui/core/Button';
import AcknowledgementsDialog from '../Dialog/AcknowledgementsDialog';
import InformationDialog from '../Dialog/InformationDialog';
import './DetailPanel.css';
import * as util from '../Shared';

class DetailPanel extends Component {

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
            console.log('pointInfo',pointInfo)
            let clusterColor = {
                background: util.getClusterColor(pointInfo)
            };

            if (JSON.stringify(this.state.pointData) !== JSON.stringify(pointInfo)) {
                let cluster_topic = pointInfo.cluster_topic.join(", ")
                let phrase = pointInfo.phrase.join(", ");
                
                this.setState({
                    pointData: pointInfo,
                    pointDisplay: (
                    <div className = 'card-wrapper'>
                        <div className="card">
                            <div><span>Label</span> <h3>{pointInfo.label}</h3></div>
                            <div><span>Cluster <div className="circle" style={clusterColor}></div></span> <h3>{pointInfo.cluster}</h3></div>
                        </div>
                        <div className="card"><h4>Document Name</h4> {pointInfo.doc_name}</div>
                        <div className="card"><h4>Phrase</h4> {phrase}</div>
                        <div className="card"><h4>Raw Sentence</h4> {pointInfo.raw_sent}</div>
                        <div className="card"><h4>Cluster Topic</h4> {cluster_topic}</div>
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
                <Button id="faqs-button" variant="contained" style={{backgroundColor: '#3f51b5', color: '#FFF'}} onClick={()=> window.open("https://vcuwrightcenter.github.io/TopExApp/quick_start", "_blank")}>Quick Start</Button>
                <InformationDialog />
                <AcknowledgementsDialog />
            </div>
        );
    }
}

export default DetailPanel