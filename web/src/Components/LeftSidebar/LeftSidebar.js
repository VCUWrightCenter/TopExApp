//This is the left sidebar component. It is EXTREMELY important to this web app.
//This is where communication with the API happens. It is the gateway for data to enter and leave the web app. 
//This is where files are uploaded to the web app, eitehr for import or processing. 
//This is where the graph data is exported. NOTE: Data cannot be exported unless the user "processes" data. That is, unless you send and receive data from the API, you will not be able to export.

import React, { Component } from "react";
import Axios from "axios";
import './LeftSidebar.css';
import COElogo from '../../Pictures/2 Horizontal (hz)/Color (4c)/bm_CollEng_CompSci_RF_hz_4c.png'
import CSLogo from '../../Pictures/CS/CS_main.png'
import NLPLogo from '../../Pictures/dataminingfemale_final-01.png'
import { Input, Button, Header, Tab, Dropdown, Checkbox } from 'semantic-ui-react';


class LeftSidebar extends Component {

    filesToSend = [];

    constructor(props) {
        super(props);
        this.state = {
            fileList: [],
            tfidfcorpusFiles: [],
            leftTabs: null,
            graphData: null,
            ImportButtonDisabled: true,
            ProcessingRunButtonDisabled: true,
            w2vBinFileFileName: [],
        };

    }

    componentDidMount() {
        document.getElementById('tabs').hidden = false;
    }

    render() {
        let panes = [
            { menuItem: 'File Manager', pane: { key: 'pane1', content: this.generateFileInput(), className: "pane" } },
            { menuItem: 'Re-Cluster', pane: { key: 'pane0', content: this.generateReclusterTab(), className: "pane" } },
            { menuItem: 'Import/Export', pane: { key: 'pane2', content: this.generateFileImportExport(), className: "pane" } },
            { menuItem: 'Parameters', pane: { key: 'pane3', content: this.generateScriptArgsTab(), className: "pane" } },
            { menuItem: 'Acknowledgements', pane: { key: 'pane4', content: this.acknowledgementsTab(), className: "pane" } }
        ]

        return (
            <div className='left-wrapper'>
                <div id='tabs' className='sidebar'>
                    <Tab className='pane' menu={{ borderless: true, attached: true, tabular: true, fluid: true, widths: 2, }} panes={panes} renderActiveOnly={false} />
                </div>
            </div>
        );
    }


    //This sends data to the APP component so that it can be sent to Main/Scatterplot
    // and create the graph
    sendGraphData = (graphData) => {
        this.props.graphData(graphData)
    }


    //Responsible for generating the jsx in the script args tab
    generateScriptArgsTab() {

        const wordVectorType = [{
            key: 'tfidf',
            text: 'tfidf',
            value: 'tfidf',
            dropdownid: "wordVectorType"
        },
        {
            key: 'svd',
            text: 'svd',
            value: 'svd'
        },
        {
            key: 'umap',
            text: 'umap',
            value: 'umap'
        },
        {
            key: 'pretrained',
            text: 'pretrained',
            value: 'pretrained'
        },
        {
            key: 'local',
            text: 'local',
            value: 'local'
        }
        ]

        const DistanceMetric = [{
            key: 'braycurtis',
            text: 'braycurtis',
            value: 'braycurtis',
            dropdownid: 'DistanceMetric'
        },
        {
            key: 'canberra',
            text: 'canberra',
            value: 'canberra'
        },
        {
            key: 'chebyshev',
            text: 'chebyshev',
            value: 'chebyshev'
        },
        {
            key: 'cityblock',
            text: 'cityblock',
            value: 'cityblock'
        },
        {
            key: 'correlation',
            text: 'correlation',
            value: 'correlation'
        },
        {
            key: 'cosine',
            text: 'cosine',
            value: 'cosine'
        },
        {
            key: 'dice',
            text: 'dice',
            value: 'dice'
        },
        {
            key: 'euclidean',
            text: 'euclidean',
            value: 'euclidean'
        },
        {
            key: 'hamming',
            text: 'hamming',
            value: 'hamming'
        },
        {
            key: 'jaccard',
            text: 'jaccard',
            value: 'jaccard'
        },
        {
            key: 'kulsinski',
            text: 'kulsinski',
            value: 'kulsinski'
        },
        {
            key: 'mahalanobis',
            text: 'mahalanobis',
            value: 'mahalanobis'
        },
        {
            key: 'matching',
            text: 'matching',
            value: 'matching'
        },
        {
            key: 'minkowski',
            text: 'minkowski',
            value: 'minkowski'
        },
        {
            key: 'rogerstanimoto',
            text: 'rogerstanimoto',
            value: 'rogerstanimoto'
        },
        {
            key: 'russellrao',
            text: 'russellrao',
            value: 'russellrao'
        },
        {
            key: 'seuclidean',
            text: 'seuclidean',
            value: 'seuclidean'
        },
        {
            key: 'sokalmichener',
            text: 'sokalmichener',
            value: 'sokalmichener'
        },
        {
            key: 'sokalsneath',
            text: 'sokalsneath',
            value: 'sokalsneath'
        },
        {
            key: 'sqeuclidean',
            text: 'sqeuclidean',
            value: 'sqeuclidean'
        },
        {
            key: 'yule',
            text: 'yule',
            value: 'yule'
        }]

        const clusteringMethods = [
            {
                key: 'hac',
                text: 'hac',
                value: 'hac',
                dropdownid: "clusteringMethod"
            },
            {
                key: 'kmeans',
                text: 'kmeans',
                value: 'kmeans'
            }
        ];

        const visualizationMethods = [
            {
                key: 'umap',
                text: 'umap',
                value: 'umap',
                dropdownid: "visualizationMethod"
            },
            {
                key: 'svd',
                text: 'svd',
                value: 'svd'
            },
            {
                key: 'tsne',
                text: 'tsne',
                value: 'tsne'
            },
            {
                key: 'mds',
                text: 'mds',
                value: 'mds'
            }
        ];

        return (
            <div className='leftSidebarContainer scriptArgsTab'>

                <Header as='h3'> Parameters </Header>

                <div className='spacing'>
                    <Button
                        color='yellow'
                        content='*TFIDF Corpus File Input'
                        icon='file'
                        onClick={() => document.getElementById('tfidfcorpus').click()}
                        className='buttonText'
                        labelPosition="left" />
                    {/* <label htmlFor='tfidfcorpuslabel'>tfidfcorpus</label> */}
                    {this.state.tfidfcorpusFiles.map((fileName) => {
                        return (
                            <div className='fileListEntry' key={fileName}>
                                <label key={fileName} htmlFor={fileName} className='file-list-label' >{fileName}</label>
                            </div>
                        )
                    })
                    }
                    <input hidden type='file' webkitdirectory="" mozdirectory="" multiple id='tfidfcorpus' onChange={(e) => {
                        let files = document.getElementById('tfidfcorpus').files
                        let fileNames = []
                        Object.values(files).forEach((elem) => {
                            fileNames.push(elem.name)
                        })
                        this.setState({ tfidfcorpusFiles: fileNames })
                    }} />
                    &nbsp;
                    <i aria-hidden="true" className="question circle fitted icon" title="Upload files for seeding tfidf, but not included in clustering."></i>
                </div>

                <div className='spacing'>
                    <label for="windowSize">Window Size</label>
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
                    <label for="vectorizationMethod">Vectorization Method</label>
                    <Dropdown placeholder='Select a method'
                        clearable
                        fluid
                        selection
                        id="vectorizationMethod"
                        options={wordVectorType}
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
                    <label for="dimensions">Dimensions</label>
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
                    <label for="clusteringMethod">Clustering Method</label>
                    <Dropdown placeholder='Select a method'
                        fluid
                        clearable
                        selection
                        id="clusteringMethod"
                        options={clusteringMethods}
                        onChange={this.getDropdownValue}>
                    </Dropdown>
                </div>

                <div className='spacing'>
                    <label for="distmet">Distance Metric</label>
                    <Dropdown placeholder='Select distance metric'
                        fluid
                        clearable
                        selection
                        id="distmet"
                        options={DistanceMetric}
                        onChange={this.getDropdownValue} />
                        &nbsp;
                    <i aria-hidden="true" className="question circle fitted icon" title="Distance metric is used to compare points for clustering"></i>
                </div>

                <div className='spacing'>
                    <label for="threshold">Threshold</label>
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

                <div className='spacing'>
                    <label for="umap_neighbors">Umap Neighbors</label>
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
            </div >
        )
    }

    //This is a utility function that is used to read in file contents
    getFileContents(file) {
        return new Promise((resolve, reject) => {
            let contents = ""
            const reader = new FileReader()
            reader.onloadend = function (e) {
                contents = e.target.result
                resolve(contents)
            }
            reader.onerror = function (e) {
                reject(e)
            }
            reader.readAsText(file)
        })
    }

    //This function gets all values that are going to be passed to the API. 
    async getScriptArgs() {

        let temp = '';
        let tfidfcorpus = document.getElementById('tfidfcorpus').files
        for (let i = 0; i < tfidfcorpus.length; i++) {
            temp += await this.getFileContents(tfidfcorpus[i])
            temp += '<newdoc>' //add this so we can split on it in the create_tfidf funtion in script
        }
        tfidfcorpus = temp;
        temp = '';

        let clusteringMethod = (this.state.clusteringMethod == null) ? "hac" : this.state.clusteringMethod;
        let visualizationMethod = (this.state.visualizationMethod == null) ? "umap" : this.state.visualizationMethod;
        let threshold = document.getElementById('threshold').value === '' ? null : document.getElementById('threshold').value;
        let wordVectorType = (this.state.wordVectorType == null) ? null : this.state.wordVectorType;
        let w2vBinFile = document.getElementById('w2vBinFile')?.files[0] != null ? this.getFileContents(document.getElementById('w2vBinFile').files[0]) : null; //This needs to be changed to a file input
        let windowSize = document.getElementById('windowSize').value === '' ? 6 : document.getElementById('windowSize').value;
        let dimensions = document.getElementById('dimensions').value === '' ? null : document.getElementById('dimensions').value;
        let umap_neighbors = document.getElementById('umap_neighbors').value === '' ? null : document.getElementById('umap_neighbors').value;
        let DistanceMetric = (this.state.DistanceMetric == null) ? null : this.state.DistanceMetric;
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
            'DistanceMetric': DistanceMetric,
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


    //This is the function that exports ALL of the graph data that is generated from the last call to the API
    exportData() {
        if (this.state.graphData == null) {
            alert('No data to export')
        }
        else {
            let name = null
            while (true) {
                name = prompt("Enter name for export file", "export")
                if (name == null) { //cancel
                    return;
                }
                else if (name === "") { //blank name
                    alert("Name cannot be empty!")
                }
                else { // Valid name
                    break;
                }
            }
            const element = document.createElement("a");
            const file = new Blob([JSON.stringify(this.state.graphData)], { type: 'text/plain' });
            element.href = URL.createObjectURL(file);
            element.download = name + ".txt";
            document.body.appendChild(element); // Required for this to work in FireFox
            element.click();
            name = null;
        }
    }

    // This is the function that is called when someone imports data. 
    async importData(e) {
        e.preventDefault()

        let input = document.getElementById("importFileInput")

        let file = input.files[0]
        let fileContent = await this.getFileContents(file);


        if (fileContent != null && file.type === "text/plain") {
            try {
                this.sendGraphData(JSON.parse(fileContent))
            }
            catch (err) {
                console.error(err)
                alert(err);
            }

        }
        else {
            alert("Error parsing file. Must be a .txt file exported from previous run.")
        }
    }

    //This is used to ensure the import file is not null
    checkImportFile(e) {
        e.preventDefault()

        let input = document.getElementById("importFileInput")

        let file = input.files[0]

        if (file != null) {
            this.setState({
                ImportButtonDisabled: false
            })
        }
        else {
            this.setState({
                ImportButtonDisabled: true
            })
        }
    }


    //Responsible for generating the jsx in the file input tab (at least 3 files need to be uploaded)
    generateFileInput() {
        return (
            <div className="leftSidebarContainer">
                <div className='file-input'>
                    <Button.Group vertical>
                        <Button
                            color='yellow'
                            loading={this.state.runningScript}
                            onClick={() => { document.getElementById('fileProcessingInput').click(); }}
                            icon="file"
                            labelPosition="left"
                            content='Upload files for processing'
                            className='buttonText'
                        />

                        <Button
                            color='black'
                            loading={this.state.runningScript}
                            onClick={(e) => { document.getElementById('submitButton').click() }}
                            content='Run'
                            className='action'
                        />
                        
                        <div id="fileList" className='fileList'>
                            {this.state.fileList.map((fileName) => {
                                return (
                                    <div className='fileListEntry' key={fileName}>
                                        <label htmlFor={fileName} className='file-list-label' >{fileName}</label>
                                        <input id={fileName} type='checkBox' className='file-list-checkbox' defaultChecked />
                                    </div>
                                )
                            })
                            }
                        </div>                 
                    </Button.Group>
                    &nbsp;
                    <i aria-hidden="true" className="question circle fitted icon" title="At least 3 files are required in order for application to run."></i>
                    <form encType="multipart/form-data" onSubmit={(e) => this.handleChange(e)}>
                        <input hidden id='fileProcessingInput' type="file" webkitdirectory="" mozdirectory="" multiple name="file" onChange={(e) => this.updateFileList(e.target.files)} />
                        <button hidden id="submitButton" className="submitButton"> Run </button>
                    </form>
                </div>
            </div>)
    }

    //Responsible for generating the jsx in the re-cluster tab
    generateReclusterTab() {
        return (
            <div className="leftSidebarContainer scriptArgsTab">
                <div className='file-input'>
                    <div className='spacing'>
                        <label for="reclusterThreshold">Height or K (needs to be less than ...)</label>
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
                        <label for="reclusterTopicsPerCluster">Topics Per Cluster</label>
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
                        <label for="reclusterMinClusterSize">Minimum Cluster Size</label>
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
                        <input hidden id='threshold' type="number" />
                        <button hidden id="submitReclusterButton" className="submitButton"> Re-Cluster </button>
                    </form>
                </div>
            </div>)
    }

    //Responsible for generating the jsx in the file input tab
    generateFileImportExport() {
        return (
            <div className="leftSidebarContainer">
                <div className='file-input'>
                    <Button.Group vertical>
                        <Button
                            color='yellow'
                            onClick={() => document.getElementById('importFileInput').click()}
                            icon="file"
                            labelPosition="left"
                            content='Upload file for import'
                            className='buttonText'
                        />
                        <Button
                            color='black'
                            disabled={this.state.ImportButtonDisabled}
                            content="Import"
                            onClick={(e) => this.importData(e)}
                            className='action'
                        />
                        <Button.Or />
                        <Button
                            color='yellow'
                            content="Export"
                            onClick={(e) => this.exportData()}
                            className='buttonText'
                        />
                    </Button.Group>
                    <form>
                        <input id='importFileInput' type="file" hidden onChange={(e) => this.checkImportFile(e)} />
                        <button id='importFileButton' type='submit' hidden onClick={(e) => this.importData(e)}>Import</button>
                    </form>
                </div>
            </div>)
    }

    acknowledgementsTab() {
        return (
            <div className='leftSidebarContainer acknowledgements'>
                <Header as='h3'> Acknowledgements </Header>
                <p>TopExApp (previously MedTop) was initially developed as a web app through the 2019-2020 CapStone program by Seniors in VCU's Computer Science Department under the supervision of Dr. Bridget McInnes and Amy Olex. We wish to thank Sean Kotrola, Aidan Myers, and Suzanne Prince for their excellent work in getting this application up and running! Here are links to the team's CapStone <a href="https://drive.google.com/file/d/1TGCaM7oXPxFwEJ5B5_nrGZqNnUetWPFB/view" target="_blank" rel="noopener noreferrer">Poster</a> and <a href="https://drive.google.com/file/d/1xRYlLpiYnCnI9Pdi6vbE4eTDUu0e09qB/view" target="_blank" rel="noopener noreferrer">Application Demonstration.</a></p>

                <Header as='h3'> References </Header>
                <p>Olex A, DiazGranados D, McInnes BT, and Goldberg S. Local Topic Mining for Reflective Medical Writing. Full Length Paper. AMIA Jt Summits Transl Sci Proc 2020;2020:459–68. PMCID: <a href="https://www-ncbi-nlm-nih-gov.proxy.library.vcu.edu/pmc/articles/PMC7233034/" target="_blank" rel="noopener noreferrer">PMC7233034</a></p>
                
                <Header as='h3'> Affiliates </Header>
                <img src={COElogo} className='COElogo' alt="VCU College of Engineering logo"/>
                <img src={CSLogo} className='CSlogo' alt="VCU Computer Science logo"/>
                <img src={NLPLogo} className='NLPlogo' alt="VCU NLP lab logo"/>
            </div>   
        )
    }

    //This method takes in the form data, sends it to the api,
    //and then sends it to the parent element (App) so that
    //it can be passed to the Main component.
    //It must be async so that it does not pass data to App before
    //the data is returned
    async handleChange(event) {

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

        //Perform form validation here
        if (this.validateArgs(scriptArgs, files)) {
            this.setState({
                runningScript: true
            })

            scriptArgs = JSON.stringify(scriptArgs)

            var response = await this.runScript(formData, scriptArgs)

            if (response == null) {
                return;
            }

            this.setState({ graphData: response })

            this.sendGraphData(response)

            document.getElementById('submitButton').disabled = false;
            this.setState({
                runningScript: false
            })
        }
        else {
            return
        }

    }

    async submitRecluster(event) {
        
        console.log("Event:" + event);
        console.log("Data:" + this.state.graphData.data);
        console.log("Length:" + this.state.graphData.data.length);
        console.log("Max Thresh:" + this.state.graphData.max_thresh);
        console.log(document.getElementById('reclusterThreshold').value);

        if (this.state.graphData.data.length > 0  && document.getElementById('reclusterThreshold').value < this.state.graphData.max_thresh) {
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

            this.sendGraphData(response)

            document.getElementById('submitReclusterButton').disabled = false;
            this.setState({
                runningScript: false
            })
        } else {
            alert ("Please make sure there is data and that the reclustering height is greater than the max threshold.");
            event.preventDefault();
        }
    }


    //Used to validate data being passed to the API
    validateArgs(scriptArgs, files) {
        //TODO: Uncomment this
        // if (files.length < 1) {
        //     alert('Must provide at least one input file')
        //     document.getElementById('submitButton').disabled = false;
        //     return false;
        // }


        // if (scriptArgs.threshold == '') {
        //     alert('Threshhold must be specified.');
        //     document.getElementById('submitButton').disabled = false;
        //     document.getElementById('threshold').focus()
        //     return false;
        // }


        // if (document.getElementById('tfidfcorpus').files.length < 1) {
        //     alert('Must provide at least one tfidfcorpus')
        //     document.getElementById('submitButton').disabled = false;
        //     return false;
        // }


        return true;
    }

    //Responsible for sending the POST request which runs the script
    async runScript(formData, scriptArgs) {
        let dict = JSON.parse(scriptArgs);
        Object.keys(dict).forEach(function (key) {
            // console.log(key, dict[key]);
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



    //This method updates the file list in the left sidebar with the uploaded file names
    updateFileList(files) {

        let fileData = []

        for (var file in files) {
            fileData.push(files[file].name)
        }

        let modifiedFilelist = fileData.filter((value, index, arr) => {
            return value !== undefined && value.includes(".txt");
        })

        this.setState({
            fileList: modifiedFilelist
        })
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


export default LeftSidebar