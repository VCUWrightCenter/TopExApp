import React, { Component } from "react";
import './Left_Sidebar.css'
import Axios from "axios";
import { json } from "d3";
import { Tab } from 'semantic-ui-react'



class Left_Sidebar extends Component {

    filesToSend = [];

    constructor(props) {
        super(props);
        this.state = {
            fileList: [],
            leftTabs: null
        };

    }


    //This sends data to the APP component so that it can be sent to Main/Scatterplot
    // and create the graph
    sendGraphData = (graphData) => {
        this.props.graphData(graphData)
    }

    generateFileInput() {
        return (<div className='sidebar'>
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
            </div>
        </div>)
    }

    componentDidMount() {

        this.setState({
            leftTabs: this.generateFileInput()
        })

        document.getElementById('tabs').hidden = false;
    }

    render() {
        let panes = [
            { menuItem: 'File input', pane: { key: 'pane1', content: this.generateFileInput() } },
            { menuItem: 'Tab 2', pane: 'tab 2 content' },
        ]

        return (
            <div className='left-wrapper'>
                <div id='tabs' className='sidebar'>
                    <Tab panes={panes} renderActiveOnly={false}/>
                </div>
            </div>
        );
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

        console.log(checkedFiles)
        for (var i = 0; i < files.length; i++) {
            if (checkedFiles.includes(files[i].name)) {
                formData.append("File" + i, files[i])
            }
            else {
                console.log(files[i].name + " is not checked")
            }

        }


        let scriptArgs = { tfidfcorpus: '2019.03.12_SEED_TOPICS_AMY/FILELIST.txt', scatter_plot: "all", threshold: 8 }

        scriptArgs = JSON.stringify(scriptArgs)

        var response = await this.runScript(formData, scriptArgs)

        this.sendGraphData(response)

        document.getElementById('submitButton').disabled = false;

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
        })

        const data = response.data
        console.log(data)

        return await data
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
        }, () => { console.log("state changed" + modifiedFilelist) }
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