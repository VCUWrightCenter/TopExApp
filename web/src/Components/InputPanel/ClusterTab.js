//This is the left sidebar component. It is EXTREMELY important to this web app.
//This is where communication with the API happens. It is the gateway for data to enter and leave the web app. 
//This is where files are uploaded to the web app, eitehr for import or processing. 
//This is where the graph data is exported. NOTE: Data cannot be exported unless the user "processes" data. That is, unless you send and receive data from the API, you will not be able to export.

import React, { Component } from "react";
import Axios from "axios";
import './InputPanel.css';
import { Input, Button, Header, Dropdown, Checkbox } from 'semantic-ui-react';
import { getVisualizationMethods, getClusteringMethods, getDistanceMetric, getVectorizationMethod, getFileContents } from '../Shared';

class ClusterTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tfidfcorpusFiles: [],
            leftTabs: null,
            graphData: null,
            ProcessingRunButtonDisabled: true,
            w2vBinFileFileName: [],
        };
    }

    // Submits parameters and documents for clustering
    async submitCluster(event) {
        event.preventDefault()

        let formData = new FormData()

        // Append corpusDocs to form data
        for (var i = 0; i < this.props.corpusDocs.length; i++) {
            // let doc = await getFileContents(this.props.corpusDocs[i])
            let file = this.props.corpusDocs[i];
            formData.append("File" + i, file);
        }

        // Concatenate seedDocs into a single string
        let tfidfcorpus = '';
        for (let i = 0; i < this.props.seedDocs.length; i++) {
            tfidfcorpus += await getFileContents(this.props.seedDocs[i])
            tfidfcorpus += '<newdoc>' //add this so we can split on it in the create_tfidf funtion in script
        }

        let params = {
            'tfidfcorpus': tfidfcorpus,
            // Sentence embedding parameters
            'windowSize': document.getElementById('windowSize').value === '' ? 6 : document.getElementById('windowSize').value,
            'wordVectorType': (this.state.vectorizationMethod == null) ? null : this.state.vectorizationMethod,
            // TODO: w2vBinFile file upload not currently available
            'w2vBinFile': document.getElementById('w2vBinFile')?.files[0] != null ? getFileContents(document.getElementById('w2vBinFile').files[0]) : null,
            'dimensions': document.getElementById('dimensions').value === '' ? null : document.getElementById('dimensions').value,
            // Sentence clustering parameters
            'clusteringMethod': (this.state.clusteringMethod == null) ? "hac" : this.state.clusteringMethod,
            'cluster_dist_metric': (this.state.cluster_dist_metric == null) ? null : this.state.cluster_dist_metric,
            'threshold': document.getElementById('threshold').value === '' ? null : document.getElementById('threshold').value,
            // Visualization parameters
            'visualizationMethod': (this.state.visualizationMethod == null) ? "umap" : this.state.visualizationMethod,
            'viz_dist_metric': (this.state.viz_dist_metric == null) ? null : this.state.viz_dist_metric,
            'umap_neighbors': document.getElementById('umap_neighbors').value === '' ? null : document.getElementById('umap_neighbors').value,
            // Checkboxes            
            'include_input_in_tfidf': document.getElementById('include_input_in_tfidf').checked,
            'include_sentiment': document.getElementById('include_sentiment').checked,
            outputdir: "./"
        };

        this.setState({ runningScript: true })

        var response = await this.cluster(formData, params)//JSON.stringify(params)

        if (response == null) {
            return;
        }

        this.setState({ graphData: response })

        // Propogate graphData back up to parent
        this.props.graphDataCallback(response)

        this.setState({ runningScript: false })

    }

    //Responsible for sending the POST request which runs the script
    async cluster(formData, params) {
        let dict = params;
        Object.keys(dict).forEach(function (key) {
            console.log(key, dict[key]);
            formData.append(key, dict[key]);
        });

        const response = await Axios.post("http://localhost:5000/cluster", formData, {
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
        })

        return response == null ? null : response
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

    render() {
        return (
            <div className='InputPanelContainer scriptArgsTab'>
                <Header as='h3'>Sentence Embedding Parameters</Header>

                <div className='spacing'>
                    <label htmlFor="windowSize">Window Size</label>
                    <Input
                        type='number'
                        placeholder='Window Size'
                        defaultValue='6'
                        id='windowSize'
                        min='0'
                    />
                    &nbsp;
                    <i aria-hidden="true" className="question circle fitted icon" title="Length of phrase extracted from each sentence."></i>
                </div>

                <div className='spacing'>
                    <label htmlFor="vectorizationMethod">Vectorization Method</label>
                    <Dropdown placeholder='Select a method'
                        clearable
                        fluid
                        selection
                        id="vectorizationMethod"
                        options={getVectorizationMethod("vectorizationMethod")}
                        onChange={this.getDropdownValue} />
                    &nbsp;
                    <i aria-hidden="true" className="question circle fitted icon" title="Method used for generating phrase vectors"></i>
                </div>

                {this.state.wordVectorType === "pretrained" ?
                    <div className='spacing'>
                        <Button
                            color='yellow'
                            content='w2vBinFile'
                            icon='file'
                            onClick={() => document.getElementById('w2vBinFile').click()}
                            labelPosition="left"
                            className='buttonText'
                        />
                        {this.state.w2vBinFileFileName.map((fileName) => {
                            return (
                                <div className='fileListEntry' key={fileName}>
                                    <label key={fileName} htmlFor={fileName} className='file-list-label' >{fileName}</label>
                                </div>
                            )
                        })
                        }
                        <input hidden type='file' id='w2vBinFile' onChange={(e) => {
                            let files = document.getElementById('w2vBinFile').files
                            let fileNames = []
                            Object.values(files).forEach((elem) => {
                                fileNames.push(elem.name)
                            })
                            this.setState({ w2vBinFileFileName: fileNames })
                        }} />
                    </div> : null}

                <div className='spacing'>
                    <label htmlFor="dimensions">Dimensions</label>
                    <Input
                        type='number'
                        placeholder='Dimensions'
                        defaultValue='200'
                        id='dimensions'
                        min='0'
                    />
                    &nbsp;
                    <i aria-hidden="true" className="question circle fitted icon" title="Only relevant for UMAP and SVD clustering. Dimensions to which the tfidf matrix is reduced."></i>
                </div>

                <div className='spacing'>
                    <Checkbox id='include_sentiment' label="Include sentiment?" title="" defaultChecked />
                    &nbsp;
                    <i aria-hidden="true" className="question circle fitted icon" title="Checking this box means that part of speech and sentiment will be used to weight the importance of tokens."></i>
                </div>

                <Header as='h3'>Sentence Clustering Parameters</Header>

                <div className='spacing'>
                    <label htmlFor="clusteringMethod">Clustering Method</label>
                    <Dropdown placeholder='Select a method'
                        fluid
                        clearable
                        selection
                        id="clusteringMethod"
                        options={getClusteringMethods("clusteringMethod")}
                        onChange={this.getDropdownValue}>
                    </Dropdown>
                    &nbsp;
                    <i aria-hidden="true" className="question circle fitted icon" title="Method used to cluster word vectors."></i>
                </div>

                <div className='spacing'>
                    <label htmlFor="cluster_dist_metric">Distance Metric for Clustering</label>
                    <Dropdown placeholder='Select distance metric'
                        fluid
                        clearable
                        selection
                        id="cluster_dist_metric"
                        options={getDistanceMetric("cluster_dist_metric")}
                        onChange={this.getDropdownValue} />
                        &nbsp;
                    <i aria-hidden="true" className="question circle fitted icon" title="This distance metric is used to compare points for clustering"></i>
                </div>

                <div className='spacing'>
                    <label htmlFor="threshold">Threshold</label>
                    <Input
                        type='number'
                        placeholder='Threshold'
                        defaultValue='20'
                        id='threshold'
                        min='0'
                    />
                    &nbsp;
                    <i aria-hidden="true" className="question circle fitted icon" title="Corresponds to the cut height of the dendrogram for HAC clustering and K for k-means clustering."></i>
                </div>

                <Header as='h3'>Visualization Parameters</Header>

                <div className='spacing'>
                    <label htmlFor="visualizationMethod">Visualization Method</label>
                    <Dropdown placeholder='Select Visualization Method'
                        fluid
                        clearable
                        selection
                        id="visualizationMethod"
                        options={getVisualizationMethods("visualizationMethod")}
                        onChange={this.getDropdownValue} />
                        &nbsp;
                    <i aria-hidden="true" className="question circle fitted icon" title="Method used for projecting points into two dimensions for visualization."></i>
                </div>

                <div className='spacing'>
                    <label htmlFor="viz_dist_metric">Distance Metric for Visualization</label>
                    <Dropdown placeholder='Select distance metric'
                        fluid
                        clearable
                        selection
                        id="viz_dist_metric"
                        options={getDistanceMetric("viz_dist_metric")}
                        onChange={this.getDropdownValue} />
                        &nbsp;
                    <i aria-hidden="true" className="question circle fitted icon" title="This distance metric is used to compare points for visualization"></i>
                </div>

                <div className='spacing'>
                    <label htmlFor="umap_neighbors">Umap Neighbors</label>
                    <Input
                        type='number'
                        placeholder='Umap Neighbors'
                        defaultValue='15'
                        id='umap_neighbors'
                        min='0'
                    />
                    &nbsp;
                    <i aria-hidden="true" className="question circle fitted icon" title="Only relevant for UMAP clustering"></i>
                </div>

                <div className='spacing'>
                    <Checkbox id='include_input_in_tfidf' label="Include input in tfidf?" defaultChecked />
                    &nbsp;
                    <i aria-hidden="true" className="question circle fitted icon" title="Checking this box means that token scores are calculated using the tfidf, otherwise average token scores are used."></i>
                </div>

                <Button
                    color='black'
                    disabled={this.state.runningScript}
                    loading={this.state.runningScript}
                    onClick={(e) => { document.getElementById('submitButton').click() }}
                    content='Run'
                    className='action'
                />

                <form encType="multipart/form-data" onSubmit={(e) => this.submitCluster(e)}>
                    <button hidden id="submitButton" className="submitButton"> Run </button>
                </form>
            </div >
        )
    }
}

export default ClusterTab