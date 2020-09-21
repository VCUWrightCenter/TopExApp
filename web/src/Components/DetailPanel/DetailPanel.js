//This is where the data is diplayed when you click on a data point. 

import React, { Component } from "react";
import './DetailPanel.css'

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

            if (JSON.stringify(this.state.pointData) !== JSON.stringify(pointInfo)) {
                let cluster_info = pointInfo.cluster_info.join(", ")
                let phrase = pointInfo.phrase.join(", ");
                
                this.setState({
                    pointData: pointInfo,
                    pointDisplay: (
                    <div className = 'card-wrapper'>
                        <div className="card">
                            <div><span>Label</span> <h3>{pointInfo.label}</h3></div>
                            <div><span>Cluster</span> <h3>{pointInfo.cluster}</h3></div>
                        </div>
                        <div className="card"><h4>Phrase</h4> {phrase}</div>
                        <div className="card"><h4>Raw Sentence</h4> {pointInfo.raw_sent}</div>
                        <div className="card"><h4>Cluster Info</h4> {cluster_info}</div>
                        {/* <div id='exportButtons' className='exportButtons'>
                            <Button
                                onClick={(e) => util.exportSVGAsPNG("scatterplotSVG")}
                                content="Export Scatterplot"
                                className="ui black button"
                            />

                            <Button
                                onClick={(e) => util.exportSVGAsPNG("WordCloudSVG")}
                                content="Export Word Cloud"
                                className="ui black button"
                            />
                        </div> */}
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

export default DetailPanel