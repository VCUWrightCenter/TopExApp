import React, { Component } from "react";
import './Right-Sidebar.css'

class Right_Sidebar extends Component {

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
            //console.log(pointInfo)

            let keys = Object.keys(pointInfo)
            let cluster = ""
            let clusterData = ""
            for (let x in keys){
                if (keys[x].includes("cluster")){
                    console.log(keys[x])
                    cluster = keys[x]
                    clusterData = pointInfo[cluster]
                    break;
                }
            }


            if (JSON.stringify(this.state.pointData) != JSON.stringify(pointInfo)) {
                console.log(this.state.pointData)
                console.log(pointInfo)
                this.setState({
                    pointData: pointInfo,
                    pointDisplay: (
                    <div>
                        <div>Label: {pointInfo.label}</div>
                        <div>{cluster}: {clusterData}</div>
                        <div>Phrase: {pointInfo.phrase}</div>
                        <div>Raw Sentence: {pointInfo.raw_sent}</div>
                        <div>Cluster Info: {pointInfo.cluster_info}</div>
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

export default Right_Sidebar