import React, { Component } from "react";
import './InputPanel.css';
import { Button, Header } from 'semantic-ui-react';


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

    render() {
        return (
            <div className="InputPanelContainer acknowledgements">
                <Header as='h3'>File Manager</Header>
                <p>Upload documents to cluster here. Only .txt are accepted. Must provide a minimum of three documents.</p>

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
                    <form encType="multipart/form-data" onSubmit={(e) => this.handleChange(e)}>
                        <input hidden id='fileProcessingInput' type="file" webkitdirectory="" mozdirectory="" multiple name="file" onChange={(e) => this.updateFileList(e.target.files)} />
                        <button hidden id="submitButton" className="submitButton"> Run </button>
                    </form>
                </div>
            </div>)
    }
}

export default FileManagerTab