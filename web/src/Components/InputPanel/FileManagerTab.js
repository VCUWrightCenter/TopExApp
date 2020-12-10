import React, { Component } from "react";
import './InputPanel.css';
import { Button, Header } from 'semantic-ui-react';


class FileManagerTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            corpusDocs: [],
            expansionDocs: [],
            stopwordsFile: [],
            runningScript: false,
        };
    }

    // Gets file names from uploads and filters
    mapFiles(uploads) {
        let files = Array.from(uploads)
            .filter(f => f !== undefined && f.name.includes('.txt'));
        files.forEach(f => f.checked = true);
        return files;
    }

    //This method saves uploads into corpusDocs and shares with InputPanel
    uploadCorpusDocs(uploads) {
        let files = this.mapFiles(uploads);
        this.setState({ corpusDocs: files });
        this.updateCorpusDocsProps(files);
    }
    toggleCorpusCheck(filename) {
        let doc = this.state.corpusDocs.find(d => d.name === filename);
        doc.checked = !doc.checked;
        this.updateCorpusDocsProps(this.state.corpusDocs);
    }
    updateCorpusDocsProps(files) {
        let filtered = files.filter(f => f.checked).map(f => { return f });
        this.props.corpusDocsCallback(filtered);
    }

    //This method saves uploads into expansionDocs and shares with InputPanel
    uploadExpansionDocs(uploads) {
        let files = this.mapFiles(uploads);
        this.setState({ expansionDocs: files });
        this.updateExpansionDocsProps(files);
    }
    toggleExpansionCheck(filename) {
        let doc = this.state.expansionDocs.find(d => d.name === filename);
        doc.checked = !doc.checked;
        this.updateExpansionDocsProps(this.state.expansionDocs);
    }
    updateExpansionDocsProps(files) {
        let filtered = files.filter(f => f.checked).map(f => { return f });
        this.props.expansionDocsCallback(filtered);
    }

    uploadStopwords(file) {
        file = Array.from(file);
        this.setState({ stopwordsFile: file });
        this.props.stopwordsFileCallback(file);
    }

    clearForm(id) {
        let files = [];
        var idVal = id.target.getAttribute('id');

        if (idVal === 'resetButton1') {
            document.getElementById('CorpusDocsForm').reset();
            this.uploadCorpusDocs(files);
        } else if (idVal === 'resetButton2') {
            document.getElementById('ExpansionDocsForm').reset();
            this.uploadExpansionDocs(files);
        } else if (idVal === 'stopwordsResetBtn') {
            document.getElementById('StopWordsForm').reset();
            this.uploadStopwords(files);
        }
    }

    render() {
        return (
            <div className="InputPanelContainer acknowledgements">
                <Header as='h3'>Documents to cluster</Header>
                <p>Only .txt are accepted. Must provide a minimum of three documents.</p>

                <div className='file-input spacing file-manager'>
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

                        <Button
                            color='black'
                            onClick={() => { document.getElementById('resetButton1').click(); }}
                            content='Reset'
                            className='action'
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

                    <form encType="multipart/form-data" id="CorpusDocsForm" onSubmit={(e) => this.handleChange(e)}>
                        <input id='uploadCorpusDocsInput' type="file" webkitdirectory="" mozdirectory="" multiple name="file" hidden onChange={(e) => this.uploadCorpusDocs(e.target.files)} />

                        <input type="button" id="resetButton1" hidden onClick={(e) => this.clearForm(e)} />
                    </form>
                </div>

                <Header as='h3'>Expansion corpus (Optional)</Header>
                <p>Select additional documents to be included in the background corpus (Clustering Corpus is automatically included). The Background Corpus determines which words are highly informative for clustering. Note, sentences in these documents will not be clustered. **Recommended if clustering a small set of documents.</p>

                <div className='file-input spacing file-manager'>
                    <Button.Group vertical>
                        <Button
                            color='yellow'
                            loading={this.state.runningScript}
                            onClick={() => { document.getElementById('uploadExpansionDocsInput').click(); }}
                            icon="file"
                            labelPosition="left"
                            content='Upload expansion docs'
                            className='buttonText'
                        />

                        <Button
                            color='black'
                            onClick={() => { document.getElementById('resetButton2').click(); }}
                            content='Reset'
                            className='action'
                        />

                        <div id="expanionFileList" className='fileList'>
                            {this.state.expansionDocs.map((file) => {
                                return (
                                    <div className='fileListEntry' key={file.name}>
                                        <label htmlFor={file.name} className='file-list-label' >{file.name}</label>
                                        <input id={file.name} type='checkBox' className='file-list-checkbox' defaultChecked
                                            onChange={(e) => this.toggleExpansionCheck(file.name)} />
                                    </div>
                                )
                            })
                            }
                        </div>
                    </Button.Group>
                    &nbsp;

                    <form encType="multipart/form-data" id="ExpansionDocsForm" onSubmit={(e) => this.handleChange(e)}>
                        <input hidden id='uploadExpansionDocsInput' type="file" webkitdirectory="" mozdirectory="" multiple name="file" onChange={(e) => this.uploadExpansionDocs(e.target.files)} />

                        <input type="button" id="resetButton2" hidden onClick={(e) => this.clearForm(e)} />
                    </form>
                </div>

                <Header as='h3'>Custom stopwords file (Optional)</Header>
                <p>Stopwords are removed from documents prior to clustering. Stopwords file should be one word per line.</p>

                <div className='file-input spacing'>
                    <Button.Group vertical>
                        <Button
                            color='yellow'
                            loading={this.state.runningScript}
                            onClick={() => { document.getElementById('uploadStopwordsInput').click(); }}
                            icon="file"
                            labelPosition="left"
                            content='Upload stopwords file'
                            className='buttonText'
                        />

                        <Button
                            color='black'
                            onClick={() => { document.getElementById('stopwordsResetBtn').click(); }}
                            content='Reset'
                            className='action'
                        />

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
                    </Button.Group>
                    &nbsp;

                    <form encType="multipart/form-data" id="StopWordsForm" onSubmit={(e) => this.handleChange(e)}>
                        <input hidden id='uploadStopwordsInput' type="file" name="file" onChange={(e) => this.uploadStopwords(e.target.files)} />

                        <input type="button" id="stopwordsResetBtn" hidden onClick={(e) => this.clearForm(e)} />
                    </form>
                </div>
            </div>)
    }
}

export default FileManagerTab