import React, { Component } from "react";
import './InputPanel.css';
import { Button, Header } from 'semantic-ui-react';


class FileManagerTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            corpusDocs: [],
            seedDocs: [],
            runningScript: false,
        };
    }

    // Gets file names from uploads adn filters
    mapFiles(uploads) {
        return Array.from(uploads)
            .map(f => {
                return {
                    name: f.name,
                    checked: true,
                    file: f
                }
            })
            .filter(f => f !== undefined && f.name.includes('.txt'));
    }

    //This method saves uploads into corpusDocs and shares with InputPanel
    uploadCorpusDocs(uploads) {
        let files = this.mapFiles(uploads);
        this.setState({ corpusDocs: files });
        this.updateCorpusDocsProps(files);
    }
    toggleCorpusCheck(filename) {
        let doc = this.state.corpusDocs.find(d => d.name == filename);
        doc.checked = !doc.checked;
        this.updateCorpusDocsProps(this.state.corpusDocs);
    }
    updateCorpusDocsProps(files) {
        let filtered = files.filter(f => f.checked).map(f => { return f.file });
        this.props.corpusDocsCallback(filtered);
    }

    //This method saves uploads into seedDocs and shares with InputPanel
    uploadSeedDocs(uploads) {
        let files = this.mapFiles(uploads);
        this.setState({ seedDocs: files });
        this.updateSeedDocsProps(files);
    }
    toggleSeedCheck(filename) {
        let doc = this.state.seedDocs.find(d => d.name == filename);
        doc.checked = !doc.checked;
        this.updateSeedDocsProps(this.state.seedDocs);
    }
    updateSeedDocsProps(files) {
        let filtered = files.filter(f => f.checked).map(f => { return f.file });
        this.props.seedDocsCallback(filtered);
    }

    

    render() {
        return (
            <div className="InputPanelContainer acknowledgements">
                <Header as='h3'>Documents to cluster</Header>
                <p>Only .txt are accepted. Must provide a minimum of three documents.</p>

                <div className='file-input spacing'>
                    <Button.Group vertical>
                        <Button
                            color='yellow'
                            loading={this.state.runningScript}
                            onClick={() => { document.getElementById('uploadCorpusDocsInput').click(); }}
                            icon="file"
                            labelPosition="left"
                            content='Upload docs to cluster'
                            className='buttonText'
                        />

                        <div id="fileList" className='fileList'>
                            {this.state.corpusDocs.map((file) => {
                                return (
                                    <div className='fileListEntry' key={file.name}>
                                        <label htmlFor={file.name} className='file-list-label' >{file.name}</label>
                                        <input id={file.name} type='checkBox' className='file-list-checkbox' defaultChecked
                                            onChange={(e) => this.toggleCorpusCheck(file.name)} />
                                    </div>
                                )
                            })
                            }
                        </div>
                    </Button.Group>
                    &nbsp;

                    <form encType="multipart/form-data" onSubmit={(e) => this.handleChange(e)}>
                        <input hidden id='uploadCorpusDocsInput' type="file" webkitdirectory="" mozdirectory="" multiple name="file" onChange={(e) => this.uploadCorpusDocs(e.target.files)} />
                    </form>
                </div>

                <Header as='h3'>Documents to seed TF-IDF (optional)</Header>
                <p>Seed documents may be uploaded to weight the relative importance of words in the clustering, but documents uploaded Header
                    will not be included in the clustering. Only .txt are accepted.</p>

                <div className='file-input spacing'>
                    <Button.Group vertical>
                        <Button
                            color='yellow'
                            loading={this.state.runningScript}
                            onClick={() => { document.getElementById('uploadSeedDocsInput').click(); }}
                            icon="file"
                            labelPosition="left"
                            content='*TFIDF Corpus File Input'
                            className='buttonText'
                        />
                        <div id="seedDocsList" className='fileList'>
                            {this.state.seedDocs.map((file) => {
                                return (
                                    <div className='fileListEntry' key={file.name}>
                                        <label htmlFor={file.name} className='file-list-label' >{file.name}</label>
                                        <input id={file.name} type='checkBox' className='file-list-checkbox' defaultChecked
                                            onChange={(e) => this.toggleSeedCheck(file.name)} />
                                    </div>
                                )
                            })
                            }
                        </div>
                    </Button.Group>
                    &nbsp;

                    <form encType="multipart/form-data" onSubmit={(e) => this.handleChange(e)}>
                        <input hidden id='uploadSeedDocsInput' type="file" webkitdirectory="" mozdirectory="" multiple name="file" onChange={(e) => this.uploadSeedDocs(e.target.files)} />
                    </form>
                </div>
            </div>)
    }
}

export default FileManagerTab