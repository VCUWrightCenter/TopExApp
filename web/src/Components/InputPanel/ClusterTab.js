//This is the left sidebar component. It is EXTREMELY important to this web app.
//This is where communication with the API happens. It is the gateway for data to enter and leave the web app. 
//This is where files are uploaded to the web app, eitehr for import or processing. 
//This is where the graph data is exported. NOTE: Data cannot be exported unless the user "processes" data. That is, unless you send and receive data from the API, you will not be able to export.

import React, { Component } from "react";
import Axios from "axios";
import './InputPanel.css';
import { Input, Button, Header, Dropdown, Checkbox } from 'semantic-ui-react';
import * as shared from '../Shared';

class ClusterTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            expansioncorpusFiles: [],
            leftTabs: null,
            graphData: null,
            ProcessingRunButtonDisabled: true,
            w2vBinFileFileName: [],
            status: 'Idle'
        };
    }

    // Submits parameters and documents for clustering
    async submitCluster(event) {
        event.preventDefault()

        let formData = new FormData()

        document.getElementById("drawer-toggle").checked = false;

        // Append corpusDocs to form data
        for (var i = 0; i < this.props.corpusDocs.length; i++) {
            // let doc = await getFileContents(this.props.corpusDocs[i])
            let file = this.props.corpusDocs[i];
            formData.append("File" + i, file);
        }

        // Concatenate expansionDocs into a single string
        let expansionCorpus = '';
        for (let i = 0; i < this.props.expansionDocs.length; i++) {
            expansionCorpus += await shared.getFileContents(this.props.expansionDocs[i])
            expansionCorpus += '<newdoc>' //add this so we can split on it in the create_tfidf funtion in script
        }

        let params = {
            'expansionCorpus': expansionCorpus,
            'stopwords': this.props.stopwordsFile.length > 0 ? await shared.getFileContents(this.props.stopwordsFile[0]) : null,
            // Sentence embedding parameters
            'windowSize': document.getElementById('windowSize').value === '' ? 6 : document.getElementById('windowSize').value,
            'wordVectorType': (this.state.vectorizationMethod == null) ? null : this.state.vectorizationMethod,
            'tfidfCorpus': (this.state.tfidfCorpus == null) ? 'both' : this.state.tfidfCorpus,
            // TODO: w2vBinFile file upload not currently available
            'w2vBinFile': document.getElementById('w2vBinFile')?.files[0] != null ? shared.getFileContents(document.getElementById('w2vBinFile').files[0]) : null,
            'dimensions': document.getElementById('dimensions').value === '' ? null : document.getElementById('dimensions').value,
            'include_sentiment': document.getElementById('include_sentiment').checked,
            'custom_stopwords_only': document.getElementById('custom_stopwords_only').checked,
            // Sentence clustering parameters
            'clusteringMethod': (this.state.clusteringMethod == null) ? "hac" : this.state.clusteringMethod,
            'cluster_dist_metric': (this.state.cluster_dist_metric == null) ? null : this.state.cluster_dist_metric,
            'threshold': document.getElementById('threshold').value === '' ? null : document.getElementById('threshold').value,
            // Visualization parameters
            'visualizationMethod': (this.state.visualizationMethod == null) ? "umap" : this.state.visualizationMethod,
            'viz_dist_metric': (this.state.viz_dist_metric == null) ? null : this.state.viz_dist_metric,
            'umap_neighbors': document.getElementById('umap_neighbors').value === '' ? null : document.getElementById('umap_neighbors').value,
            outputdir: "./"
        };

        this.setState({ runningScript: true })

        var response = await this.cluster(formData, params)
        
        this.setState({ graphData: response })

        // Propogate graphData back up to parent
        response['runtime'] = new Date().getTime();
        this.props.graphDataCallback(response)

        this.setState({ runningScript: false })

    }

    //Responsible for sending the POST request which runs the script
    async cluster(formData, params) {
        let dict = params;
        Object.keys(dict).forEach(function (key) {
            formData.append(key, dict[key]);
        });
        console.log('params', params);

        let pending = true
        const promise = Axios.post("http://localhost:8080/cluster", formData, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data'
            }
        }).then((promise) => {
            let data = promise.data
            data["visualizationMethod"] = params["visualizationMethod"]

            if(data.msg) alert(data.msg);
            pending = false;
            return data
        }).catch((err) => {
            pending = false;
            this.setState({runningScript: false})
            console.error(err.message)
            alert(err);
        })

        // Ping clustering function status from another thread
        while(pending) {
            await new Promise(r => setTimeout(r, 2000));
            await Axios.get("http://localhost:8080/status/1", {
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

        let response = await promise
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
                    <span className="tooltip" data-tooltip="Length of phrase extracted from each sentence."><i aria-hidden="true" className="question circle fitted icon"></i></span>
                </div>

                <div className='spacing'>
                    <label htmlFor="vectorizationMethod">Vectorization Method</label>
                    <Dropdown placeholder='Select a method'
                        clearable
                        fluid
                        selection
                        id="vectorizationMethod"
                        options={shared.getVectorizationMethod("vectorizationMethod")}
                        onChange={this.getDropdownValue} />
                    &nbsp;
                    <span className="tooltip" data-tooltip="Method used for generating phrase vectors."><i aria-hidden="true" className="question circle fitted icon"></i></span>
                </div>

                <div className='spacing'>
                    <label htmlFor="tfidfCorpus">Background Corpus</label>
                    <Dropdown placeholder='Select set of background corpus docs'
                        clearable
                        fluid
                        selection
                        id="tfidfCorpus"
                        options={shared.getTfidfCorpus("tfidfCorpus")}
                        onChange={this.getDropdownValue} />
                    &nbsp;
                    <span className="tooltip" data-tooltip="Set(s) of documents used to generate the TF-IDF."><i aria-hidden="true" className="question circle fitted icon"></i></span>
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
                    <span className="tooltip" data-tooltip="Only relevant for UMAP and SVD clustering. Dimensions to which the tfidf matrix is reduced."><i aria-hidden="true" className="question circle fitted icon"></i></span>
                </div>

                <div className='spacing'>
                    <Checkbox id='include_sentiment' label="Include sentiment?" title="" defaultChecked />
                    &nbsp;
                    <span className="tooltip" data-tooltip="Checking this box means that part of speech and sentiment will be used to weight the importance of tokens."><i aria-hidden="true" className="question circle fitted icon"></i></span>
                </div>

                <div className='spacing'>
                    <Checkbox id='custom_stopwords_only' label="Custom stopwords only?" title="" />
                    &nbsp;
                    <span className="tooltip" data-tooltip="Checking this box means that only stopwords explicitly listed in the custom stopwords file will be removed during preprocessing."><i aria-hidden="true" className="question circle fitted icon"></i></span>
                </div>

                <Header as='h3'>Sentence Clustering Parameters</Header>

                <div className='spacing'>
                    <label htmlFor="clusteringMethod">Clustering Method</label>
                    <Dropdown placeholder='Select a method'
                        fluid
                        clearable
                        selection
                        id="clusteringMethod"
                        options={shared.getClusteringMethods("clusteringMethod")}
                        onChange={this.getDropdownValue}>
                    </Dropdown>
                    &nbsp;
                    <span className="tooltip" data-tooltip="Method used to cluster word vectors."><i aria-hidden="true" className="question circle fitted icon"></i></span>
                </div>

                <div className='spacing'>
                    <label htmlFor="cluster_dist_metric">Distance Metric for Clustering</label>
                    <Dropdown placeholder='Select distance metric'
                        fluid
                        clearable
                        selection
                        id="cluster_dist_metric"
                        options={shared.getDistanceMetric("cluster_dist_metric")}
                        onChange={this.getDropdownValue} />
                        &nbsp;
                        <span className="tooltip" data-tooltip="This distance metric is used to compare points for clustering."><i aria-hidden="true" className="question circle fitted icon"></i></span>
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
                    <span className="tooltip" data-tooltip="Corresponds to the cut height of the dendrogram for HAC clustering and K for k-means clustering."><i aria-hidden="true" className="question circle fitted icon"></i></span>
                </div>

                <Header as='h3'>Visualization Parameters</Header>

                <div className='spacing'>
                    <label htmlFor="visualizationMethod">Visualization Method</label>
                    <Dropdown placeholder='Select Visualization Method'
                        fluid
                        clearable
                        selection
                        id="visualizationMethod"
                        options={shared.getVisualizationMethods("visualizationMethod")}
                        onChange={this.getDropdownValue} />
                        &nbsp;
                        <span className="tooltip" data-tooltip="Method used for projecting points into two dimensions for visualization."><i aria-hidden="true" className="question circle fitted icon"></i></span>
                </div>

                <div className='spacing'>
                    <label htmlFor="viz_dist_metric">Distance Metric for Visualization</label>
                    <Dropdown placeholder='Select distance metric'
                        fluid
                        clearable
                        selection
                        id="viz_dist_metric"
                        options={shared.getDistanceMetric("viz_dist_metric")}
                        onChange={this.getDropdownValue} />
                        &nbsp;
                        <span className="tooltip" data-tooltip="This distance metric is used to compare points for visualization"><i aria-hidden="true" className="question circle fitted icon"></i></span>
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
                    <span className="tooltip" data-tooltip="Only relevant for UMAP clustering."><i aria-hidden="true" className="question circle fitted icon"></i></span>
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
                    color='black'
                    disabled={this.state.runningScript || this.props.corpusDocs.length===0}
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