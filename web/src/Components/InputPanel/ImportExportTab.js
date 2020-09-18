import React, { Component } from "react";
import './InputPanel.css';
import { Button, Header } from 'semantic-ui-react';
import { getFileContents, promptForFileName } from './Shared'

class ImportExportTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ImportButtonDisabled: true
        };
    }

    // Import text data file previously exported by TopEx
    async importData(e) {
        e.preventDefault()
        let input = document.getElementById("importFileInput")
        let file = input.files[0]
        let fileContent = await getFileContents(file);

        if (fileContent != null && file.type === "text/plain") {
            try {
                let data = JSON.parse(fileContent)
                this.props.graphDataCallback(data);
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

    // This is the function that exports ALL of the graph data that is generated from the last call to the API
    exportData() {
        if (this.props.graphData == null) {
            alert('No data to export')
        }
        else {
            let name = promptForFileName();            
            const element = document.createElement("a");
            const file = new Blob([JSON.stringify(this.props.graphData)], { type: 'text/plain' });
            element.href = URL.createObjectURL(file);
            element.download = name + ".txt";
            document.body.appendChild(element); // Required for this to work in FireFox
            element.click();
            name = null;
        }
    }

    render() {
        return (
            <div className="InputPanelContainer acknowledgements">
                <Header as='h3'>Import/Export</Header>
                <p>Import the output from a previous clustering or export clustering data.</p>
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
}

export default ImportExportTab