import React, { Component } from "react";
import './Left_Sidebar.css'
import Axios from "axios";



class Left_Sidebar extends Component {

    filesToSend = [];

    constructor(props) {
        super(props);
        this.state = { fileList: [] };
    }

    sendGraphData = (graphData) => {
        this.props.graphData(graphData)
    }


    render() {
        return (
            <div className='sidebar'>
                hello this is the left sidebar
                <div id="fileList" className='fileList'>
                    file list:
                        {this.state.fileList.map((fileName) => {
                        return (<div key={fileName}>
                            <label htmlFor={fileName}>{fileName}</label>
                            <input id={fileName} type='checkBox' onChange={(e) => this.handleFilelist(e)} value={fileName} defaultChecked />
                        </div>
                        )
                    })
                    }

                </div>
                <div className='file-input'>

                    <form encType="multipart/form-data" onSubmit = {(e) => this.handleChange(e)}>
                        <input type="file" webkitdirectory="" mozdirectory="" multiple name="file" onChange={(e) => this.updateFileList(e.target.files)}/>
                        <button className="submitButton"> Run </button>
                    </form>
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
        event.preventDefault()

        let formChildren = event.target.children
        let input;

        for(let i in formChildren){
            if(formChildren[i].nodeName == "INPUT"){
                input = formChildren[i]
            }
        }

        let files = input.files

        let checkedFiles = this.getCheckedFiles()

        let formData = new FormData()

        console.log(checkedFiles)
        for (var i = 0; i < files.length; i++) {
            if(checkedFiles.includes(files[i].name)){
                formData.append("File" + i, files[i])
            }
            else{
                console.log(files[i].name + " is not checked")
            }

        }

        var response = await this.runScript(formData)

        this.sendGraphData(response)

        //call this before sending the data to the api
        //In order for this to work, we need to change the data to being sent on button click rather than by 
        // when you add files. Otherwise, it is going to either grab all of the files bc default value is checked, or none bc none have loaded in yet
        let checkedElements = this.getCheckedFiles(files)

    }

    //Responsible for sending the POST request which runs the script
    async runScript(formData) {
        var cors = "http://127.0.0.1:8080/"
        var url = "http://127.0.0.1:5000/runScript"

        const response = await Axios.post(cors + url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })

        const data = response.data

        return await data
    }

    updateFileList(files) {

        let fileData = []

        for (var file in files) {
            fileData.push(files[file].name)
        }

        // console.log(fileData)

        let modifiedFilelist = fileData.filter((value, index, arr) => {
            // console.log(value)
            return value !== undefined && value.includes(".txt");
        })

        this.setState({
            fileList: modifiedFilelist
        }, () => { console.log("state changed" + modifiedFilelist) }
        )
    }


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


    handleFilelist(event) {
        console.log(event.target.checked)
    }

    submitData() {
        let checkedFileDivs = this.getCheckedFiles();

        console.log(checkedFileDivs)

    }

}


export default Left_Sidebar