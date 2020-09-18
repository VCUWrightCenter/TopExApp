//This is the left sidebar component. It is EXTREMELY important to this web app.
//This is where communication with the API happens. It is the gateway for data to enter and leave the web app. 
//This is where files are uploaded to the web app, eitehr for import or processing. 
//This is where the graph data is exported. NOTE: Data cannot be exported unless the user "processes" data. That is, unless you send and receive data from the API, you will not be able to export.

import React, { Component } from "react";
import Axios from "axios";
import './InputPanel.css';
import { Input, Button, Tab } from 'semantic-ui-react';
import AcknowledgementsTab from "./AcknowledgementsTab";
import ClusterTab from "./ClusterTab";
import FileManagerTab from "./FileManagerTab";
import ImportExportTab from "./ImportExportTab";
import { getFileContents } from './Shared'


class InputPanel extends Component {

    filesToSend = [];

    constructor(props) {
        super(props);
        this.state = {
            fileList: [],
            leftTabs: null,
            graphData: null,
            ProcessingRunButtonDisabled: true,
            w2vBinFileFileName: [],
        };
    }

    // Callback for passing graphData from child components back up to App
    graphDataCallback = (graphData) => {
        this.setState({ graphData: graphData })
        this.props.graphDataCallback(graphData)
    }

    // Callback for passing fileList from FileManagerTab components back up to InputPanel
    fileListCallback = (fileList) => {
        this.setState({ fileList: fileList })
    }

    componentDidMount() {
        document.getElementById('tabs').hidden = false;
    }

    render() {
        let panes = [
            { menuItem: 'File Manager', pane: { key: 'pane1', content: <FileManagerTab fileListCallback={this.fileListCallback}/>, className: "pane" } },
            { menuItem: 'Cluster', pane: { key: 'pane3', content: <ClusterTab />, className: "pane" } },
            { menuItem: 'Re-Cluster', pane: { key: 'pane0', content: this.generateReclusterTab(), className: "pane" } },
            { menuItem: 'Import/Export', pane: { key: 'pane2', content: <ImportExportTab graphData={this.state.graphData} graphDataCallback={this.graphDataCallback} />, className: "pane" } },
            { menuItem: 'Acknowledgements', pane: { key: 'pane4', content: <AcknowledgementsTab />, className: "pane" } }
        ]

        return (
            <div className='left-wrapper'>
                <div id='tabs' className='sidebar'>
                    <Tab className='pane' menu={{ borderless: true, attached: true, tabular: true, fluid: true, widths: 2, }} panes={panes} renderActiveOnly={false} />
                </div>
            </div>
        );
    }

    //This function gets all values that are going to be passed to the API. 
    async getScriptArgs() {

        let temp = '';
        let tfidfcorpus = document.getElementById('tfidfcorpus').files
        for (let i = 0; i < tfidfcorpus.length; i++) {
            temp += await getFileContents(tfidfcorpus[i])
            temp += '<newdoc>' //add this so we can split on it in the create_tfidf funtion in script
        }
        tfidfcorpus = temp;
        temp = '';

        let clusteringMethod = (this.state.clusteringMethod == null) ? "hac" : this.state.clusteringMethod;
        let visualizationMethod = (this.state.visualizationMethod == null) ? "umap" : this.state.visualizationMethod;
        let threshold = document.getElementById('threshold').value === '' ? null : document.getElementById('threshold').value;
        let wordVectorType = (this.state.wordVectorType == null) ? null : this.state.wordVectorType;
        let w2vBinFile = document.getElementById('w2vBinFile')?.files[0] != null ? getFileContents(document.getElementById('w2vBinFile').files[0]) : null; //This needs to be changed to a file input
        let windowSize = document.getElementById('windowSize').value === '' ? 6 : document.getElementById('windowSize').value;
        let dimensions = document.getElementById('dimensions').value === '' ? null : document.getElementById('dimensions').value;
        let umap_neighbors = document.getElementById('umap_neighbors').value === '' ? null : document.getElementById('umap_neighbors').value;
        let cluster_dist_metric = (this.state.ClusterDistanceMetric == null) ? null : this.state.ClusterDistanceMetric;
        let viz_dist_metric = (this.state.VisualizationDistanceMetric == null) ? null : this.state.VisualizationDistanceMetric;
        let include_input_in_tfidf = document.getElementById('include_input_in_tfidf').checked;
        let include_sentiment = document.getElementById('include_sentiment').checked;

        let args = {
            'clusteringMethod': clusteringMethod,
            'visualizationMethod': visualizationMethod,
            'tfidfcorpus': tfidfcorpus,
            'wordVectorType': wordVectorType,
            'w2vBinFile': w2vBinFile,
            'windowSize': windowSize,
            'threshold': threshold,
            'dimensions': dimensions,
            'umap_neighbors': umap_neighbors,
            'cluster_dist_metric': cluster_dist_metric,
            'viz_dist_metric': viz_dist_metric,
            'include_input_in_tfidf': include_input_in_tfidf,
            'include_sentiment': include_sentiment,
            scatter_plot: 'all',//Default values. Are these appropriate???
            outputdir: "./"
        }

        return args;

    }

    //This function gets the data from the Semantic UI dropdowns in the options tab
    getDropdownValue = (event, data) => {
        let dataName = data.options[0].dropdownid

        if (data.value === '') { //Weird cancelling bug
            this.setState({
                [dataName]: null
            })
        }
        else {
            this.setState({
                [dataName]: data.value
            });
        }
    }

    //Responsible for generating the jsx in the re-cluster tab
    generateReclusterTab() {
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
                            <i aria-hidden="true" className="question circle fitted icon" title="New height or k."></i>
                    </div>
                    <div className='spacing'>
                        <label htmlFor="reclusterTopicsPerCluster">Topics Per Cluster</label>
                        <Input
                            type='number'
                            placeholder='topics per cluster'
                            id='reclusterTopicsPerCluster'
                            min='1'
                        />
                            &nbsp;
                            <i aria-hidden="true" className="question circle fitted icon" title="Topics per cluster."></i>
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

    async submitRecluster(event) {

        if (this.state.graphData.data.length > 0 && document.getElementById('reclusterThreshold').value < this.state.graphData.max_thresh) {
            document.getElementById('submitReclusterButton').disabled = true;
            event.preventDefault();

            // Recluster parameters
            let params = {
                'minClusterSize': document.getElementById('reclusterMinClusterSize').value === '' ? 1 : document.getElementById('reclusterMinClusterSize').value,
                'threshold': document.getElementById('reclusterThreshold').value === '' ? 5 : document.getElementById('reclusterThreshold').value,
                'topicsPerCluster': document.getElementById('reclusterTopicsPerCluster').value === '' ? 8 : document.getElementById('reclusterTopicsPerCluster').value,
                'clusteringMethod': this.state.clusteringMethod
            };


            this.setState({
                runningScript: true
            })

            params = JSON.stringify(params)

            var response = await this.postRecluster(params)

            if (response == null) {
                return;
            }

            this.setState({ graphData: response })

            // Propogate graphData back up to parent
            this.props.graphDataCallback(response)

            document.getElementById('submitReclusterButton').disabled = false;
            this.setState({
                runningScript: false
            })
        } else {
            alert("Please make sure there is data and that the reclustering height is greater than the max threshold.");
            event.preventDefault();
        }
    }

    //Responsible for sending the POST request which runs the script
    async runScript(formData, scriptArgs) {
        let dict = JSON.parse(scriptArgs);
        Object.keys(dict).forEach(function (key) {
            console.log(key, dict[key]);
            formData.append(key, dict[key]);
        });

        const response = await Axios.post("http://localhost:5000/process", formData, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data'
            }
        }).then((response) => {
            const data = response.data
            return data
        }).catch((err) => {
            this.setState({
                runningScript: false
            })
            console.error(err.message)
            alert(err);
            document.getElementById('submitButton').disabled = false;
        })


        return response == null ? null : response

    }

    // POST to recluster endpoint
    async postRecluster(params) {
        let dict = JSON.parse(params);
        let formData = new FormData();

        Object.keys(dict).forEach(function (key) {
            // console.log(key, dict[key]);
            formData.append(key, dict[key]);
        });

        formData.append('max_thresh', this.state.graphData.max_thresh);
        formData.append('n', this.state.graphData.count);
        formData.append('data', this.state.graphData.data);
        formData.append('viz_df', this.state.graphData.viz_df);
        formData.append('linkage_matrix', this.state.graphData.linkage_matrix);

        const response = await Axios.post("http://localhost:5000/recluster", formData, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data'
            }
        }).then((response) => {
            const data = response.data
            return data
        }).catch((err) => {
            this.setState({
                runningScript: false
            })
            console.error(err.message)
            alert(err);
            document.getElementById('submitReclusterButton').disabled = false;
        })


        return response == null ? null : response

    }

    //Returns the names of the files that have been checked, and returns them. 
    //This is used to determine which files to send to the api
    getCheckedFiles() {
        try {
            let fileListElements = document.getElementById("fileList").children

            let checkedElements = []

            for (var fileElem in fileListElements) {
                if (fileListElements[fileElem] !== undefined) {
                    let currentDiv = fileListElements[fileElem]

                    if (currentDiv.children !== undefined) {
                        let children = currentDiv.children

                        let checkbox = null

                        for (var elem in children) {
                            if (children[elem].nodeName === "INPUT") {
                                checkbox = children[elem]
                                break;
                            }
                        }

                        if (checkbox === null) {
                            return []
                        }
                        else {
                            let isChecked = checkbox.checked;

                            if (isChecked) {
                                checkedElements.push(checkbox.id)
                            }

                        }
                    }

                }

            }
            return checkedElements

        } catch (error) {
            console.log(error)
        }
    }
}

export default InputPanel