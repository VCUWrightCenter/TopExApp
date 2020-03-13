import React, { Component } from "react";
import './Left_Sidebar.css'
import Axios from "axios";
import { json } from "d3";
import { Tab, Dropdown } from 'semantic-ui-react'
import Scatterplot from "../Main/Scatterplot/Scatterplot";



class Left_Sidebar extends Component {

    filesToSend = [];

    constructor(props) {
        super(props);
        this.state = {
            fileList: [],
            leftTabs: null,
            graphData: null
        };

    }

    componentDidMount() {
        document.getElementById('tabs').hidden = false;
    }

    render() {
        let panes = [
            { menuItem: 'File input', pane: { key: 'pane1', content: this.generateFileInput() } },
            { menuItem: 'Options', pane: { key: 'pane2', content: this.generateScriptArgsTab() } },
        ]

        return (
            <div className='left-wrapper'>
                <div id='tabs' className='sidebar'>
                    <Tab panes={panes} renderActiveOnly={false} />
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
            <div>

                <div>
                    <label htmlFor='tfidfcorpuslabel'>tfidfcorpus</label>
                    <input type='file' webkitdirectory="" mozdirectory="" multiple id='tfidfcorpus' />
                </div>


                <div>
                    <label>Word Vector Type </label>
                    <Dropdown placeholder='Select wordVectorType'
                        clearable
                        fluid
                        selection
                        options={wordVectorType}
                        onChange={this.getDropdownValue} />
                </div>


                <div>
                    <label htmlFor='w2vBinFilelabel'>w2vBinFile</label>
                    <input type='file' id='w2vBinFile' />
                </div>


                <div>
                    <label htmlFor='prefixlabel'>prefix</label>
                    <input type='text' id='prefix' />
                </div>


                <div>
                    <label htmlFor='windowSizelabel'>windowSize</label>
                    <input type='text' id='windowSize' />
                </div>


                <div>
                    <label htmlFor='goldStandardlabel'>goldStandard</label>
                    <input type='file' id='goldStandard' />
                </div>


                <div>
                    <label htmlFor='thresholdlabel'>threshold</label>
                    <input type='number' id='threshold' />
                </div>


                <div>
                    <label htmlFor='dimensionslabel'>dimensions</label>
                    <input type='number' id='dimensions' />
                </div>


                <div>
                    {/* <label htmlFor='scatter_plot'>scatter_plot</label>
                <input type='text' id='scatter_plot' /> */}
                </div>


                <div>
                    <label htmlFor='umap_neighborslabel'>umap_neighbors</label>
                    <input type='number' id='umap_neighbors' />
                </div>


                <div>
                    <label>Distance metric </label>
                    <Dropdown placeholder='Select Distance metric'
                        fluid
                        clearable
                        selection
                        id="distmet"
                        options={DistanceMetric}
                        onChange={this.getDropdownValue} />
                </div>


                <div>
                    <label htmlFor='include_input_in_tfidflabel'>include_input_in_tfidf</label>
                    <input type='text' id='include_input_in_tfidf' />
                </div>


                <div>
                    <label htmlFor='output_labeled_sentenceslabel'>output_labeled_sentences</label>
                    <input type='text' id='output_labeled_sentences' />
                </div>


                <div>
                    <label htmlFor='use_kmeanslabel'>use_kmeans</label>
                    <input type='text' id='use_kmeans' />
                </div>

            </div >
        )
    }

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
            scatter_plot: 'all',//Default values. Are these appropriate
            outputdir: "./"
        }

        return args;

    }

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

    async importData(e) {
        e.preventDefault()

        let input = document.getElementById("importFileInput")

        let file = input.files[0]

        let fileContent = await this.getFileContents(file)

        this.sendGraphData(JSON.parse(fileContent))

        console.log(fileContent)
    }

    checkImportFile(e) {
        e.preventDefault()

        let input = document.getElementById("importFileInput")

        let file = input.files[0]

        if (file != null) {
            document.getElementById("importFileButton").hidden = false
        }
        else {
            document.getElementById("importFileButton").hidden = true
        }
    }


    //Responsible for generating the jsx in the file input tab
    generateFileInput() {
        return (<div>
            <div id="fileList" className='fileList'>
                file list:
            {this.state.fileList.map((fileName) => {
                return (<div className='fileListEntry' key={fileName}>
                    <label htmlFor={fileName} className='file-list-label' >{fileName}</label>
                    <input id={fileName} type='checkBox' className='file-list-checkbox' value={fileName} defaultChecked />
                </div>
                )
            })
                }
            </div>
            <div className='file-input'>
                <form encType="multipart/form-data" onSubmit={(e) => this.handleChange(e)}>
                    <input type="file" webkitdirectory="" mozdirectory="" multiple name="file" onChange={(e) => this.updateFileList(e.target.files)} />
                    <button id="submitButton" className="submitButton"> Run </button>
                </form>
                <br />
                <form>
                    <input id='importFileInput' type="file" onSubmit onChange={(e) => this.checkImportFile(e)} />
                    <button id='importFileButton' type='submit' hidden="true" onClick={(e) => this.importData(e)}>Import</button>
                </form>

                <br />
                <button onClick={(e) => this.exportData()}>Export</button>
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

        //Need to change this so that it takes in the data from the script args tab
        //let scriptArgs = { tfidfcorpus: '2019.03.12_SEED_TOPICS_AMY/FILELIST.txt', scatter_plot: "all", threshold: 8 }

        let scriptArgs = await this.getScriptArgs()

        //Perform form validation here

        if (this.validateArgs(scriptArgs, files)) {

            scriptArgs = JSON.stringify(scriptArgs)

            var response = await this.runScript(formData, scriptArgs)

            if (response == null) {
                return;
            }

            this.setState({ graphData: response })

            this.sendGraphData(response)

            document.getElementById('submitButton').disabled = false;
        }
        else {
            return
        }

    }

    validateArgs(scriptArgs, files) {
        if (scriptArgs.threshold == '') {
            alert('Threshhold must be specified.');
            document.getElementById('submitButton').disabled = false;
            document.getElementById('threshold').focus()
            return false;
        }

        if (files.length < 1) {
            alert('Must provide at least one input file')
            document.getElementById('submitButton').disabled = false;
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