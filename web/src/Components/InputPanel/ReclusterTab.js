//This is the left sidebar component. It is EXTREMELY important to this web app.
//This is where communication with the API happens. It is the gateway for data to enter and leave the web app. 
//This is where files are uploaded to the web app, eitehr for import or processing. 
//This is where the graph data is exported. NOTE: Data cannot be exported unless the user "processes" data. That is, unless you send and receive data from the API, you will not be able to export.

import React, { Component } from "react";
import Axios from "axios";
import './InputPanel.css';
import { Input, Button } from 'semantic-ui-react';


class ReclusterTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            runningScript: false
        };
    }

    async submitRecluster(event) {
        if (this.props.graphData.data.length > 0 && document.getElementById('reclusterThreshold').value < this.props.graphData.max_thresh) {
            event.preventDefault();
            // Recluster parameters
            let params = {
                'minClusterSize': document.getElementById('reclusterMinClusterSize').value === '' ? 1 : document.getElementById('reclusterMinClusterSize').value,
                'threshold': document.getElementById('reclusterThreshold').value === '' ? 5 : document.getElementById('reclusterThreshold').value,
                'topicsPerCluster': document.getElementById('reclusterTopicsPerCluster').value === '' ? 8 : document.getElementById('reclusterTopicsPerCluster').value,
                'clusteringMethod': this.props.graphData.linkage_matrix ? 'hac' : 'kmeans'
            };

            this.setState({ runningScript: true })

            let formData = new FormData();

            Object.keys(params).forEach(function (key) {
                // console.log(key, dict[key]);
                formData.append(key, params[key]);
            });

            formData.append('max_thresh', this.props.graphData.max_thresh);
            formData.append('n', this.props.graphData.count);
            formData.append('data', this.props.graphData.data);
            formData.append('viz_df', this.props.graphData.viz_df);
            formData.append('linkage_matrix', this.props.graphData.linkage_matrix);

            const response = await Axios.post("http://localhost:5000/recluster", formData, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data'
                }
            }).then((response) => {
                return response.data;
            }).catch((err) => {
                this.setState({ runningScript: false })
                console.error(err.message)
                alert(err);
            })

            if (response == null) {
                return;
            }

            // Propogate graphData back up to parent
            this.props.graphDataCallback(response)

            this.setState({ runningScript: false })
        } else {
            alert("Please make sure there is data and that the reclustering height is less than the max threshold.");
        }
    }

    render() {
        return (
            <div className="InputPanelContainer scriptArgsTab">
                <div className='file-input'>
                    <div className='spacing'>
                        <label htmlFor="reclusterThreshold">Height or K</label>
                        <Input
                            type='number'
                            placeholder='height or k'
                            id='reclusterThreshold'
                            min='1'
                        />
                            &nbsp;
                            <i aria-hidden="true" className="question circle fitted icon" title="The number of clusters, k, for k-means clustering or the height at which the dendrogram should be cut for HAC to obtain disjointed clusters."></i>
                    </div>
                    <div className='spacing'>
                        <label htmlFor="reclusterTopicsPerCluster"># of Topic Words Per Cluster</label>
                        <Input
                            type='number'
                            placeholder='# of topic words per cluster'
                            id='reclusterTopicsPerCluster'
                            min='1'
                        />
                            &nbsp;
                            <i aria-hidden="true" className="question circle fitted icon" title="This returns the top n-ranked words for the cluster topic."></i>
                    </div>
                    <div className='spacing'>
                        <label htmlFor="reclusterMinClusterSize">Minimum Cluster Size</label>
                        <Input
                            type='number'
                            placeholder='min cluster size'
                            id='reclusterMinClusterSize'
                            min='1'
                        />
                            &nbsp;
                            <i aria-hidden="true" className="question circle fitted icon" title="Minimum cluster size."></i>
                    </div>
                    <Button
                        color='black'
                        loading={this.state.runningScript}
                        onClick={(e) => { document.getElementById('submitReclusterButton').click() }}
                        content='Recluster'
                        className='action'
                    />
                    <form encType="multipart/form-data" onSubmit={(e) => this.submitRecluster(e)}>
                        <input hidden id='reclusterThreshold' type="number" />
                        <button hidden id="submitReclusterButton" className="submitButton"> Re-Cluster </button>
                    </form>
                </div>
            </div>)
    }
}

export default ReclusterTab