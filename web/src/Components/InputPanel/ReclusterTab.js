//This is the left sidebar component. It is EXTREMELY important to this web app.
//This is where communication with the API happens. It is the gateway for data to enter and leave the web app. 
//This is where files are uploaded to the web app, eitehr for import or processing. 
//This is where the graph data is exported. NOTE: Data cannot be exported unless the user "processes" data. That is, unless you send and receive data from the API, you will not be able to export.

import React, { Component } from "react";
import Axios from "axios";
import './InputPanel.css';
import { Input, Header } from 'semantic-ui-react';
import Button from '@material-ui/core/Button';

class ReclusterTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            runningScript: false,
            visualizationMethod: null,
            status: 'Idle'
        };
    }

    async submitRecluster(event) {
        event.preventDefault();

        document.getElementById("drawer-toggle").checked = false;
        
        if (this.props.graphData.data.length > 0 && document.getElementById('reclusterThreshold').value < this.props.graphData.max_thresh) {
            // Recluster parameters
            let params = {
                'minClusterSize': document.getElementById('reclusterMinClusterSize').value === '' ? 1 : document.getElementById('reclusterMinClusterSize').value,
                'threshold': document.getElementById('reclusterThreshold').value === '' ? 5 : document.getElementById('reclusterThreshold').value,
                'topicsPerCluster': document.getElementById('reclusterTopicsPerCluster').value === '' ? 8 : document.getElementById('reclusterTopicsPerCluster').value,
                'clusteringMethod': this.props.graphData.linkage_matrix?.length > 0 ? 'hac' : 'kmeans',
                'visualizationMethod': this.state.visualizationMethod
            };

            this.setState({ runningScript: true })

            let formData = new FormData();

            Object.keys(params).forEach(function (key) {
                formData.append(key, params[key]);
            });

            formData.append('max_thresh', this.props.graphData.max_thresh);
            formData.append('n', this.props.graphData.count);
            formData.append('data', this.props.graphData.data);
            formData.append('viz_df', this.props.graphData.viz_df);
            formData.append('linkage_matrix', this.props.graphData.linkage_matrix);

            let pending = true
            const promise = Axios.post(`${process.env.REACT_APP_API}/recluster`, formData, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data'
                }
            }).then(res => {
                res.data.visualizationMethod = this.props.graphData.visualizationMethod;
                pending = false;
                return res.data;
            }).catch((err) => {
                pending = false;
                this.setState({ runningScript: false })
                console.error(err.message)
                alert(err);
            })

            // Ping clustering function status from another thread
            while(pending) {
                await new Promise(r => setTimeout(r, 2000));
                await Axios.get(`${process.env.REACT_APP_API}/status/2`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data'
                }
                }).then(res => {
                    this.setState({status: res.data})
                }).catch((err) => {
                    console.error(err.message)
                })
            }
            this.setState({status: 'Complete'})

            // Propogate graphData back up to parent
            let response = await promise
            response['runtime'] = new Date().getTime();
            this.props.graphDataCallback(response)

            this.setState({ runningScript: false })
        } else {
            alert("Please make sure there is data and that the reclustering height is less than the max threshold.");
        }
    }

    render() {
        return (
            <div className="InputPanelContainer scriptArgsTab">
                <Header as='h3'>Re-Cluster Parameters</Header>
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
                            <span className="tooltip" data-tooltip="The number of clusters, k, for k-means clustering or the height at which the dendrogram should be cut for HAC to obtain disjointed clusters."><i aria-hidden="true" className="question circle fitted icon"></i></span>
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
                            <span className="tooltip" data-tooltip="This returns the top n-ranked words for the cluster topic."><i aria-hidden="true" className="question circle fitted icon"></i></span>
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
                            <span className="tooltip" data-tooltip="Minimum cluster size."><i aria-hidden="true" className="question circle fitted icon"></i></span>
                    </div>

                    {this.state.status !== "Idle" && this.state.status !== "Complete" &&
                        <div id="status-popup-wrapper">
                            <div className="status-popup">
                                <div className="loader">
                                    <div className="spinner one"></div>
                                    <div className="spinner two"></div>
                                    <div className="spinner three"></div>
                                </div>
                                <p>{this.state.status}</p>
                            </div>
                        </div>
                    }
                    <Button
                        variant="contained"
                        color="primary"
                        disabled={this.state.runningScript || !this.props.graphData?.data}
                        loading={this.state.runningScript}
                        onClick={(e) => { document.getElementById('submitReclusterButton').click() }}
                        className='vspace'
                    >Recluster</Button>
                    <form encType="multipart/form-data" onSubmit={(e) => this.submitRecluster(e)}>
                        <input hidden id='reclusterThreshold' type="number" />
                        <button hidden id="submitReclusterButton" className="submitButton"> Re-Cluster </button>
                    </form>
                </div>
            </div>)
    }
}

export default ReclusterTab