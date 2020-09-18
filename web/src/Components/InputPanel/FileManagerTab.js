import React, { Component } from "react";
import Axios from "axios";
import './InputPanel.css';
import { Button } from 'semantic-ui-react';


class FileManagerTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fileList: [],
            runningScript: false,
        };
    }

    //This method updates the file list in the InputPanel with the uploaded file names
    updateFileList(uploads) {
        let files = Array.from(uploads)
            .map(x => {return x.name})
            .filter(f => f !== undefined && f.includes('.txt'));

        this.setState({ fileList: files })
        this.props.fileListCallback(files);
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
            <div className="InputPanelContainer">
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
}

export default FileManagerTab