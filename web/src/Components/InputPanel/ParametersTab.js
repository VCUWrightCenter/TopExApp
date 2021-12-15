import React, { Component } from "react";
import './InputPanel.css';
import { Input, Header, Dropdown, Checkbox } from 'semantic-ui-react';
import Button from '@material-ui/core/Button';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import * as shared from '../Shared';

class ParametersTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            stopwordsFile: [],
            status: 'Idle',
        };
    }

    uploadStopwords(file) {
        console.log('uploadStopwords', file)
        file = Array.from(file);
        this.setState({ stopwordsFile: file });
    }

    resetStopwords() {
        this.setState({ stopwordsFile: [] });
        document.getElementById("uploadStopwordsInput").value = ''
    }

    async extractParams() {
        let params = {
            'stopwords': this.state.stopwordsFile.length > 0 ? await shared.getFileContents(this.state.stopwordsFile[0]) : null,

            // Sentence embedding parameters
            'windowSize': document.getElementById('windowSize').value === '' ? 6 : document.getElementById('windowSize').value,
            'wordVectorType': (this.state.vectorizationMethod == null) ? null : this.state.vectorizationMethod,
            'tfidfCorpus': (this.state.tfidfCorpus == null) ? 'both' : this.state.tfidfCorpus,
            'dimensions': document.getElementById('dimensions').value === '' ? null : document.getElementById('dimensions').value,
            'include_sentiment': document.getElementById('include_sentiment').checked,
            'custom_stopwords_only': document.getElementById('custom_stopwords_only').checked,
            'ner': document.getElementById('ner').checked,

            // Sentence clustering parameters
            'clusteringMethod': (this.state.clusteringMethod == null) ? "kmeans" : this.state.clusteringMethod,
            'cluster_dist_metric': (this.state.cluster_dist_metric == null) ? null : this.state.cluster_dist_metric,
            'threshold': document.getElementById('threshold').value === '' ? null : document.getElementById('threshold').value,

            // Visualization parameters
            'visualizationMethod': (this.state.visualizationMethod == null) ? "umap" : this.state.visualizationMethod,
            'viz_dist_metric': (this.state.viz_dist_metric == null) ? null : this.state.viz_dist_metric,
            'umap_neighbors': document.getElementById('umap_neighbors').value === '' ? null : document.getElementById('umap_neighbors').value,
            outputdir: "./"
        };
        return params
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

        // Displays a message if 'kmeans is selected as the Clustering Method
        if (data.value === 'kmeans') {
            document.getElementById('note').style.display = 'block';
        } else {
            document.getElementById('note').style.display = 'none';
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

                <div className='spacing'>
                    <Checkbox id='ner' label="Biomedical Named Entity Recognition?" title="" />
                    &nbsp;
                    <span className="tooltip" data-tooltip="Checking this box will cause sentences to be represented by biomedical entities they contain."><i aria-hidden="true" className="question circle fitted icon"></i></span>
                </div>

                <Header as='h4'>Custom stopwords file (Optional)</Header>
                <p>Stopwords are removed from documents prior to clustering. Stopwords file should be one word per line.</p>

                <div className='file-input spacing'>
                    <Button
                        color="secondary"
                        variant="contained"
                        onClick={() => { document.getElementById('uploadStopwordsInput').click(); }}
                        startIcon={<CloudUploadIcon />}
                    >Upload stopwords file</Button>
                    <br />
                    <Button
                        style={{backgroundColor: '#6b6b6b', color: '#FFF'}}
                        variant="contained"
                        onClick={() => { this.resetStopwords() }}
                        className='vspace'
                    >Reset</Button>

                    <div id="stopwordsFileList" className='fileList'>
                        {this.state.stopwordsFile.map((file) => {
                            return (
                                <div className='fileListEntry' key={file.name}>
                                    <label htmlFor={file.name} className='file-list-label' >{file.name}</label>
                                </div>
                            )
                        })
                        }
                    </div>
                    &nbsp;

                    <form encType="multipart/form-data" id="StopWordsForm" onSubmit={(e) => this.handleChange(e)}>
                        <input hidden id='uploadStopwordsInput' type="file" name="file" onChange={(e) => this.uploadStopwords(e.target.files)} />
                    </form>
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

                <div id="note">
                    <p><i aria-hidden="true" className="exclamation circle fitted icon"></i> Please note that the K-Means clustering algorithm only uses Euclidean distance.</p>
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
            </div >
        )
    }
}

export default ParametersTab