//This is the left sidebar component. It is EXTREMELY important to this web app.
//This is where communication with the API happens. It is the gateway for data to enter and leave the web app. 
//This is where files are uploaded to the web app, eitehr for import or processing. 
//This is where the graph data is exported. NOTE: Data cannot be exported unless the user "processes" data. That is, unless you send and receive data from the API, you will not be able to export.

import React, { Component } from "react";
import './Left_Sidebar.css'
import Axios from "axios";
import { Tab, Dropdown } from 'semantic-ui-react'
import { Input, Button, Header } from 'semantic-ui-react'


class Left_Sidebar extends Component {

    filesToSend = [];

    constructor(props) {
        super(props);
        this.state = {
            fileList: [],
            tfidfcorpusFiles: [],
            leftTabs: null,
            graphData: null,
            ImportButonDisabled: true,
            ProcessingRunButtonDisabled: true,
            GoldStandardFileName: [],
            w2vBinFileFileName: []
        };

    }

    componentDidMount() {
        document.getElementById('tabs').hidden = false;
    }

    render() {
        let panes = [
            { menuItem: 'File input', pane: { key: 'pane1', content: this.generateFileInput(), className: "pane" } },
            { menuItem: 'Options', pane: { key: 'pane2', content: this.generateScriptArgsTab(), className: "pane" } },
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
            dropDownID: "wordVectorType"
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
            dropDownID: 'DistanceMetric'
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
        }
        ]
        return (
            <div className='scriptArgsTab'>

                <Header as='h3'> *Required Parameters </Header>
                <div className = 'spacing'>
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
                    < input hidden type='file' webkitdirectory="" mozdirectory="" multiple id='tfidfcorpus' onChange={(e) => {
                        let files = document.getElementById('tfidfcorpus').files
                        let fileNames = []
                        Object.values(files).forEach((elem) => {
                            fileNames.push(elem.name)
                        })
                        this.setState({ tfidfcorpusFiles: fileNames })
                    }} />
                </div>

                <div className = 'spacing'>
                    <Input
                        type='number'
                        placeholder='*Threshold'
                        id='threshold'
                    />
                    {/* <label htmlFor='thresholdlabel'>threshold</label>
                    <input type='number' id='threshold' /> */}
                </div>

                <hr style={{ color: 'black', border: 'solid', width: '100%', borderWidth: '0.5px' }} />

                <Header as='h3' className='header3'> Optional Parameters </Header>

                <div className = 'spacing'>
                    {/* <label>Word Vector Type </label> */}
                    <Dropdown placeholder='Select wordVectorType'
                        clearable
                        fluid
                        selection
                        options={wordVectorType}
                        onChange={this.getDropdownValue} />
                </div>


                <div className = 'spacing'>

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
                </div>


                <div className = 'spacing'>
                    <Input
                        placeholder='Prefix Label'
                        id='prefix'
                    />
                    {/* <label htmlFor='prefixlabel'>prefix</label>
                    <input type='text' id='prefix' /> */}
                </div>


                <div className = 'spacing'>
                    <Input
                        placeholder='Window Size'
                        id='windowSize'
                    />
                    {/* <label htmlFor='windowSizelabel'>windowSize</label>
                    <input type='text' id='windowSize' /> */}
                </div>


                <div className = 'spacing'>

                    <Button
                        color='yellow'
                        content='goldStandard'
                        icon='file'
                        onClick={() => document.getElementById('goldStandard').click()}
                        className='buttonText'
                        labelPosition="left"
                    />
                    {this.state.GoldStandardFileName.map((fileName) => {
                        return (
                            <div className='fileListEntry' key={fileName}>
                                <label key={fileName} htmlFor={fileName} className='file-list-label' >{fileName}</label>
                            </div>
                        )
                    })
                    }
                    <input hidden type='file' id='goldStandard' onChange={(e) => {
                        let files = document.getElementById('goldStandard').files
                        let fileNames = []
                        Object.values(files).forEach((elem) => {
                            fileNames.push(elem.name)
                        })
                        this.setState({ GoldStandardFileName: fileNames })
                    }} />
                </div>





                <div className = 'spacing'>
                    <Input
                        type='number'
                        placeholder='Dimensions'
                        id='dimensions'
                    />
                    {/* <label htmlFor='dimensionslabel'>dimensions</label>
                    <input type='number' id='dimensions' /> */}
                </div>


                <div className = 'spacing'>
                    <Input
                        type='number'
                        placeholder='Umap Neighbors'
                        id='umap_neighbors'
                    />
                    {/* <label htmlFor='umap_neighborslabel'>umap_neighbors</label>
                    <input type='number' id='umap_neighbors' /> */}
                </div>


                <div className = 'spacing'>
                    {/* <label>Distance metric </label> */}
                    <Dropdown placeholder='Select Distance metric'
                        fluid
                        clearable
                        selection
                        id="distmet"
                        options={DistanceMetric}
                        onChange={this.getDropdownValue} />
                </div>


                <div className = 'spacing'>
                    <Input
                        placeholder='include_input_in_tfidf'
                        id='include_input_in_tfidf'
                    />
                    {/* <label htmlFor='include_input_in_tfidflabel'>include_input_in_tfidf</label>
                    <input type='text' id='include_input_in_tfidf' /> */}
                </div>


                <div className = 'spacing'>
                    <Input
                        placeholder='output_labeled_sentences'
                        id='output_labeled_sentences'
                    />
                    {/* <label htmlFor='output_labeled_sentenceslabel'>output_labeled_sentences</label>
                    <input type='text' id='output_labeled_sentences' /> */}
                </div>


                <div className = 'spacing'>
                    <Input
                        placeholder='use_kmeans'
                        id='use_kmeans'
                    />
                    {/* <label htmlFor='use_kmeanslabel'>use_kmeans</label>
                    <input type='text' id='use_kmeans' /> */}
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
        //console.log(tfidfcorpus);
        let wordVectorType = (this.state.wordVectorType == null) ? null : this.state.wordVectorType;
        let w2vBinFile = document.getElementById('w2vBinFile').files[0] == null ? null : this.getFileContents(document.getElementById('w2vBinFile').files[0]); //This needs to be changed to a file input
        let prefix = document.getElementById('prefix').value == '' ? null : document.getElementById('prefix').value;
        let windowSize = document.getElementById('windowSize').value == '' ? null : document.getElementById('windowSize').value;
        let goldStandard = document.getElementById('goldStandard').files[0] == null ? null : this.getFileContents(document.getElementById('goldStandard').files[0]);

        let threshold = document.getElementById('threshold').value;
        let dimensions = document.getElementById('dimensions').value == '' ? null : document.getElementById('dimensions').value;
        let umap_neighbors = document.getElementById('umap_neighbors').value == '' ? null : document.getElementById('umap_neighbors').value;
        let DistanceMetric = (this.state.DistanceMetric == null) ? null : this.state.DistanceMetric;
        let include_input_in_tfidf = document.getElementById('include_input_in_tfidf').value == '' ? null : document.getElementById('include_input_in_tfidf').value;
        let output_labeled_sentences = document.getElementById('output_labeled_sentences').value == '' ? null : document.getElementById('output_labeled_sentences').value;
        let use_kmeans = document.getElementById('use_kmeans').value == '' ? null : document.getElementById('use_kmeans').value;

        // console.log("DISTANCE METRIC");
        // console.log(typeof (DistanceMetric))
        // console.log(this.state.DistanceMetric)
        let args = {
            'tfidfcorpus': tfidfcorpus,
            'wordVectorType': wordVectorType,
            'w2vBinFile': w2vBinFile,
            'prefix': prefix,
            'goldStandard': goldStandard,
            'windowSize': windowSize,
            'threshold': threshold,
            'dimensions': dimensions,
            'umap_neighbors': umap_neighbors,
            'DistanceMetric': DistanceMetric,
            'include_input_in_tfidf': include_input_in_tfidf,
            'output_labeled_sentences': output_labeled_sentences,
            'use_kmeans': use_kmeans,
            scatter_plot: 'all',//Default values. Are these appropriate???
            outputdir: "./"
        }

        return args;

    }

    //This function gets the data from the Semantic UI dropdowns in the options tab
    getDropdownValue = (event, data) => {
        let dataName = data.options[0].dropDownID


        if (data.value == '') { //Weird cancelling bug
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
            console.log(this.state.graphData)
            alert('No data to export')
        }
        else {
            let name = null
            while (true) {
                name = prompt("Enter name for export file", "export")
                console.log("NAME", name)
                if (name == null) { //cancel
                    return;
                }
                else if (name == "") { //blank name
                    alert("Name cannot be empty!")
                }
                else { // Valid name
                    break;
                }
            }
            console.log(this.state.graphData)
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


        if (fileContent != null && file.type == "text/plain") {
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
        //console.log(fileContent)
    }

    //This is used to ensure the import file is not null
    checkImportFile(e) {
        e.preventDefault()

        let input = document.getElementById("importFileInput")

        let file = input.files[0]

        if (file != null) {
            console.log("FILE NOT NULL")
            this.setState({
                ImportButonDisabled: false
            })
        }
        else {
            console.log("FILE NILL")
            this.setState({
                ImportButonDisabled: true
            })
        }
    }


    //Responsible for generating the jsx in the file input tab
    generateFileInput() {
        return (
            <div>
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
                        />
                        <div id="fileList" className='fileList'>
                            {this.state.fileList.map((fileName) => {
                                return (
                                    <div className='fileListEntry' key={fileName}>
                                        <label htmlFor={fileName} className='file-list-label' >{fileName}</label>
                                        <input id={fileName} type='checkBox' className='file-list-checkbox' value={fileName} defaultChecked />
                                    </div>
                                )
                            })
                            }
                        </div>
                        <Button.Or />
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
                            disabled={this.state.ImportButonDisabled}
                            content="Import"
                            onClick={(e) => this.importData(e)}
                        />
                        <Button.Or />
                        <Button
                            color='yellow'
                            content="Export"
                            onClick={(e) => this.exportData()}
                            className='buttonText'
                        />
                    </Button.Group>
                    <form encType="multipart/form-data" onSubmit={(e) => this.handleChange(e)}>
                        <input hidden id='fileProcessingInput' type="file" webkitdirectory="" mozdirectory="" multiple name="file" onChange={(e) => this.updateFileList(e.target.files)} />
                        <button hidden id="submitButton" className="submitButton"> Run </button>
                    </form>
                    <form>
                        <input id='importFileInput' type="file" hidden onChange={(e) => this.checkImportFile(e)} />
                        <button id='importFileButton' type='submit' hidden onClick={(e) => this.importData(e)}>Import</button>
                    </form>
                </div>
            </div>)
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
            if (formChildren[i].nodeName == "INPUT") {
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
            else {
                console.log(files[i].name + " is not checked")
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


    //Used to validate data being passed to the API
    validateArgs(scriptArgs, files) {

        if (files.length < 1) {
            alert('Must provide at least one input file')
            document.getElementById('submitButton').disabled = false;
            return false;
        }


        if (scriptArgs.threshold == '') {
            alert('Threshhold must be specified.');
            document.getElementById('submitButton').disabled = false;
            document.getElementById('threshold').focus()
            return false;
        }


        if (document.getElementById('tfidfcorpus').files.length < 1) {
            alert('Must provide at least one tfidfcorpus')
            document.getElementById('submitButton').disabled = false;
            return false;
        }


        return true;
    }

    //Responsible for sending the POST request which runs the script
    async runScript(formData, scriptArgs) {
        var cors = "http://127.0.0.1:8080/"
        var url = "http://127.0.0.1:5000/runScript"

        const blob = new Blob([scriptArgs], {
            type: 'application/json'
        });

        formData.append('scriptArgs', blob)

        const response = await Axios.post(cors + url, formData, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data'
            }
        }).then((response) => {
            const data = response.data
            return data
        }).catch((err) => {
            console.error(err.message)
            alert(err);
            document.getElementById('submitButton').disabled = false;
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
            // console.log(value)
            return value !== undefined && value.includes(".txt");
        })

        this.setState({
            fileList: modifiedFilelist
        }
            // }, () => { console.log("state changed" + modifiedFilelist) }
        )
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
                            if (children[elem].nodeName == "INPUT") {
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
            //console.log(checkedElements)
            return checkedElements

        } catch (error) {
            console.log(error)
        }

    }


}


export default Left_Sidebar