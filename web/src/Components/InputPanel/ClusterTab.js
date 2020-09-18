//This is the left sidebar component. It is EXTREMELY important to this web app.
//This is where communication with the API happens. It is the gateway for data to enter and leave the web app. 
//This is where files are uploaded to the web app, eitehr for import or processing. 
//This is where the graph data is exported. NOTE: Data cannot be exported unless the user "processes" data. That is, unless you send and receive data from the API, you will not be able to export.

import React, { Component } from "react";
import Axios from "axios";
import './InputPanel.css';
import { Input, Button, Header, Dropdown, Checkbox } from 'semantic-ui-react';
import { getVisualizationMethods, getClusteringMethods, getDistanceMetric, getVectorizationMethod } from './Shared';


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
        document.getElementById('submitButton').disabled = true;
        event.preventDefault()

        let formChildren = event.target.children
        let input;

        for (let i in formChildren) {
            if (formChildren[i].nodeName === "INPUT") {
                input = formChildren[i]
            }
        }

        let files = input.files

        let checkedFiles = this.getCheckedFiles()

        let formData = new FormData()
        for (var i = 0; i < files.length; i++) {
            if (checkedFiles.includes(files[i].name)) {
                formData.append("File" + i, files[i])
            }
        }

        let scriptArgs = await this.getScriptArgs()

        this.setState({ runningScript: true })

        scriptArgs = JSON.stringify(scriptArgs)

        var response = await this.runScript(formData, scriptArgs)

        if (response == null) {
            return;
        }

        this.setState({ graphData: response })

        // Propogate graphData back up to parent
        this.props.graphDataCallback(response)

        document.getElementById('submitButton').disabled = false;
        this.setState({ runningScript: false })

    }

    render() {
        return (
            <div className='InputPanelContainer scriptArgsTab'>
                Corpus[0]: {this.props.corpusDocs[0]}
                <br/>
                Seed[0]: {this.props.seedDocs[0]}
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

                <div className='spacing'>
                    <Checkbox id='include_sentiment' label="Include sentiment?" title="" defaultChecked />
                    &nbsp;
                    <i aria-hidden="true" className="question circle fitted icon" title="Checking this box means that part of speech and sentiment will be used to weight the importance of tokens."></i>
                </div>

                <Button
                    color='black'
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