import React, { Component } from "react";
import './InputPanel.css';
import { Input, Button, Header } from 'semantic-ui-react';

class LoadDataTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            corpusDocs: [],
            expansionDocs: [],
            inputType: null,
            query: '',
            maxResults: 50,
            runningScript: false,
        };
    }

    // Propogate corpusDocs list up to parent component
    updateCorpusDocsProps(files) {
        let filtered = files.filter(f => f.checked).map(f => { return f });
        this.props.corpusDocsCallback(filtered);
    }

    // Gets file names from uploads and filters
    mapFiles(uploads) {
        let files = Array.from(uploads)
            .filter(f => f !== undefined && f.name.includes('.txt'));
        files.forEach(f => f.checked = true);
        return files;
    }

    // Upload input document(s) from user input
    uploadInput(uploads, inputType) {
        console.log('uploads', uploads)
        let params = this.props.extractParams()
        console.log('params', params)

        let files = this.mapFiles(uploads);
        this.setState({
            corpusDocs: files,
            inputType: inputType
        });
        this.updateCorpusDocsProps(files);
    }

    // Toggle whether an uploaded file is included in the input corpus
    toggleCorpusCheck(filename) {
        let doc = this.state.corpusDocs.find(d => d.name === filename);
        doc.checked = !doc.checked;
        this.updateCorpusDocsProps(this.state.corpusDocs);
    }

    // Propogate PubMed query text to parent state
    updateQuery() {
        let m = document.getElementById("maxResults").value
        let q = document.getElementById("query").value
        this.setState({
            maxResults: m,
            query: q,
            inputType: 'pubmed'
        });
        this.props.queryCallback(m, q);
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

    // Resets all inputs for clustering corpus
    resetClusteringCorpus(wipeQuery = true) {
        console.log('resetClusteringCorpus')
        document.getElementById('multiDocInput').value = ''
        document.getElementById('singleDocInput').value = ''
        this.setState({
            corpusDocs: [],
            inputType: null
        });
        this.updateCorpusDocsProps([]);

        if (wipeQuery) {
            document.getElementById("query").value = ''
            this.props.queryCallback(0, '');
        }
    }

    // Resets all inputs for expansion corpus
    resetExpansionCorpus() {
        document.getElementById('uploadExpansionDocsInput').value = ''
        this.uploadExpansionDocs([]);
    }

    render() {
        return (
            <div className="InputPanelContainer">

                <Header as='h3'>Clustering Corpus (Required)</Header>
                <p>Choose the set of texts you want to analyze with TopEx. You must <strong><em>choose only one</em></strong> of the 4 options below. If you choose to run a PubMed search from within TopEx then your query will be run after pressing the Run button.</p>
                <Button
                    color='black'
                    onClick={() => this.resetClusteringCorpus()}
                    content='Reset Input Corpus'
                    className='vspace'
                />
                <br />

                <div className='file-input spacing file-manager'>
                    <Header as='h4'>1. From Text Files</Header>
                    <Button
                        color='yellow'
                        loading={this.state.runningScript}
                        onClick={() => {
                            this.resetClusteringCorpus()
                            document.getElementById('multiDocInput').click();
                        }}
                        icon="file"
                        labelPosition="left"
                        content='Upload docs to cluster'
                        className='vspace buttonText'
                    />
                    <br />
                    {
                        this.state.inputType == 'multi' &&
                        <div id="fileList" className='fileList'>
                            <div>
                                {this.state.corpusDocs.map((file) => {
                                    return (
                                        <div className='fileListEntry' key={file.name}>
                                            <label htmlFor={file.name} className='file-list-label' >{file.name}</label> &nbsp;
                                            <input id={file.name} type='checkBox' className='file-list-checkbox' defaultChecked
                                                onChange={(e) => this.toggleCorpusCheck(file.name)} />
                                        </div>
                                    )
                                })
                                }
                            </div>
                        </div>
                    }

                    <form encType="multipart/form-data" id="CorpusDocsForm" onSubmit={(e) => this.handleChange(e)}>
                        <input id='multiDocInput' type="file" webkitdirectory="" mozdirectory="" multiple name="file" hidden onChange={(e) => this.uploadInput(e.target.files, 'multi')} />
                    </form>

                    <Header as='h4'>2. From CSV File</Header>
                    <Button
                        color='yellow'
                        loading={this.state.runningScript}
                        onClick={() => {
                            this.resetClusteringCorpus()
                            this.setState({ inputType: 'csv' });
                            document.getElementById('singleDocInput').click();
                        }}
                        icon="file"
                        labelPosition="left"
                        content='Upload .csv to cluster'
                        className='vspace buttonText'
                    />

                    {
                        this.state.inputType == 'csv' &&
                        <div id="csvFileList" className='fileList'>
                            <div>
                                {this.state.corpusDocs.map((file) => {
                                    return (
                                        <div className='fileListEntry' key={file.name}>
                                            <label htmlFor={file.name} className='file-list-label' >{file.name}</label> &nbsp;
                                            <input id={file.name} type='checkBox' disabled className='file-list-checkbox' defaultChecked
                                                onChange={(e) => this.toggleCorpusCheck(file.name)} />
                                        </div>
                                    )
                                })
                                }
                            </div>
                        </div>
                    }

                    <Header as="h4">3. From MEDLINE Formatted File</Header>
                    <Button
                        color='yellow'
                        loading={this.state.runningScript}
                        onClick={() => {
                            this.resetClusteringCorpus()
                            this.setState({ inputType: 'medline' });
                            document.getElementById('singleDocInput').click();
                        }}
                        icon="file"
                        labelPosition="left"
                        content='Upload MEDLINE file to cluster'
                        className='vspace buttonText'
                    />

                    {
                        this.state.inputType == 'medline' &&
                        <div id="medlineFileList" className='fileList'>
                            <div>
                                {this.state.corpusDocs.map((file) => {
                                    return (
                                        <div className='fileListEntry' key={file.name}>
                                            <label htmlFor={file.name} className='file-list-label' >{file.name}</label> &nbsp;
                                            <input id={file.name} type='checkBox' disabled className='file-list-checkbox' defaultChecked
                                                onChange={(e) => this.toggleCorpusCheck(file.name)} />
                                        </div>
                                    )
                                })
                                }
                            </div>
                        </div>
                    }

                    <form encType="multipart/form-data" id="CorpusDocForm" onSubmit={(e) => this.handleChange(e)}>
                        <input id='singleDocInput' type="file" hidden onChange={(e) => this.uploadInput(e.target.files, this.state.inputType)} />
                    </form>

                    <Header as='h4'>4. From PubMed Search</Header>
                    <p>Search PubMed for abstracts related to keywords.</p>
                    <div className='InputPanelContainer scriptArgsTab'>
                        <div className='spacing'>
                            <label htmlFor="MaxResults">Max Results</label>
                            <Input
                                type='number'
                                placeholder='Max Results'
                                defaultValue='100'
                                id='maxResults'
                                min='0'
                                onChange={() => { this.updateQuery() }}
                            />
                            &nbsp;
                            <span className="tooltip" data-tooltip="Max number of abstracts returned from PubMed search."><i aria-hidden="true" className="question circle fitted icon"></i></span>
                        </div>
                        <div className='spacing'>
                            <label htmlFor="Query">Query</label>
                            <Input
                                type='text'
                                placeholder='Query'
                                defaultValue=''
                                id='query'
                                onChange={() => {
                                    this.resetClusteringCorpus(false)
                                    this.updateQuery()
                                }}
                            />
                            &nbsp;
                            <span className="tooltip" data-tooltip="Keywords for PubMed search."><i aria-hidden="true" className="question circle fitted icon"></i></span>
                        </div>
                    </div>
                </div>

                <Header as='h3'>Expansion Corpus (Optional)</Header>
                <p>Select additional documents to be included in the background corpus (Clustering Corpus is automatically included). The Background Corpus determines which words are highly informative for clustering. Note, sentences in these documents will not be clustered. **Recommended if clustering a small set of documents.</p>

                <div className='file-input spacing file-manager'>
                    <Button
                        color='yellow'
                        loading={this.state.runningScript}
                        onClick={() => { document.getElementById('uploadExpansionDocsInput').click(); }}
                        icon="file"
                        labelPosition="left"
                        content='Upload expansion docs'
                        className='buttonText'
                    />
                    <br />
                    <Button
                        color='black'
                        onClick={() => { this.resetExpansionCorpus() }}
                        content='Reset'
                        className='vspace'
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
                    &nbsp;

                    <form encType="multipart/form-data" id="ExpansionDocsForm" onSubmit={(e) => this.handleChange(e)}>
                        <input hidden id='uploadExpansionDocsInput' type="file" webkitdirectory="" mozdirectory="" multiple name="file" onChange={(e) => this.uploadExpansionDocs(e.target.files)} />
                    </form>
                </div>
            </div>
        )
    }
}

export default LoadDataTab