import React, { Component } from "react";
import Axios from "axios";
import './InputPanel.css';
import { Input, Header } from 'semantic-ui-react';
import Button from '@material-ui/core/Button';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import * as shared from '../Shared';

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
            status: 'Idle'
        };
    }

    // Gets file names from uploads and filters
    mapFiles(uploads) {
        let typeFilter = this.state.inputType === 'tsv' ? '.tsv' : (this.state.inputType === 'xlsx' ? '.xlsx' : '.txt')
        let files = Array.from(uploads)
            .filter(f => f !== undefined && f.name.includes(typeFilter));
        files.forEach(f => f.checked = true);
        return files;
    }

    // Upload input document(s) from user input
    uploadInput(uploads, inputType) {
        console.log('uploadInput', uploads, inputType)
        let files = this.mapFiles(uploads);
        console.log('uploadInput', files)
        this.setState({
            corpusDocs: files,
            inputType: inputType
        });
    }

    // Toggle whether an uploaded file is included in the input corpus
    toggleCorpusCheck(filename) {
        let doc = this.state.corpusDocs.find(d => d.name === filename);
        doc.checked = !doc.checked;
    }

    // Propogate PubMed query text to parent state
    updateQuery() {
        let m = document.getElementById("maxResults").value
        let q = document.getElementById("query").value
        if (q.trim().length > 0) {
            this.setState({
                maxResults: m,
                query: q,
                inputType: 'pubmed'
            });
        } else {
            this.setState({ inputType: null })
        }
    }

    //This method saves uploads into expansionDocs and shares with InputPanel
    uploadExpansionDocs(uploads) {
        let files = this.mapFiles(uploads);
        this.setState({ expansionDocs: files });
    }
    toggleExpansionCheck(filename) {
        let doc = this.state.expansionDocs.find(d => d.name === filename);
        doc.checked = !doc.checked;
    }

    // Resets all inputs for clustering corpus
    resetClusteringCorpus(wipeQuery = true) {
        document.getElementById('multiDocInput').value = ''
        document.getElementById('singleDocInput').value = ''
        this.setState({
            corpusDocs: [],
            inputType: null
        });

        if (wipeQuery) {
            document.getElementById("query").value = ''
            this.setState({ query: '' });
        }
    }

    // Resets all inputs for expansion corpus
    resetExpansionCorpus() {
        document.getElementById('uploadExpansionDocsInput').value = ''
        this.uploadExpansionDocs([]);
    }

    async cluster() {
        this.setState({ status: 'Processing, please wait…' })
        let params = await this.props.extractParams()
        params['inputType'] = this.state.inputType
        params['query'] = this.state.query
        params['maxResults'] = this.state.maxResults

        let formData = new FormData()
        document.getElementById("drawer-toggle").checked = false;

        // Append corpusDocs to form data
        for (var i = 0; i < this.state.corpusDocs.length; i++) {
            let file = this.state.corpusDocs[i];
            formData.append("File" + i, file);
        }

        // Concatenate expansionDocs into a single string
        let expansionCorpus = '';
        for (let i = 0; i < this.state.expansionDocs.length; i++) {
            expansionCorpus += await shared.getFileContents(this.state.expansionDocs[i])
            expansionCorpus += '<newdoc>' //add this so we can split on it in the create_tfidf funtion in script
        }
        params['expansionCorpus'] = expansionCorpus

        this.setState({ runningScript: true })

        var response = await this.postCluster(formData, params)
        this.setState({ graphData: response })

        // Propogate graphData back up to parent
        response['runtime'] = new Date().getTime();
        this.props.graphDataCallback(response)

        this.setState({ runningScript: false })
    }

    //Responsible for sending the POST request which runs the script
    async postCluster(formData, params) {
        let dict = params;
        Object.keys(dict).forEach(function (key) {
            formData.append(key, dict[key]);
        });
        console.log('params', params);

        let pending = true
        const promise = Axios.post(`${process.env.REACT_APP_API}/cluster`, formData, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data'
            }
        }).then((promise) => {
            let data = promise.data
            data["visualizationMethod"] = params["visualizationMethod"]

            if (data.msg) alert(data.msg);
            pending = false;
            return data
        }).catch((err) => {
            pending = false;
            this.setState({ runningScript: false })
            console.error(err.message)
            alert(err);
        })

        // Ping clustering function status from another thread
        while (pending) {
            await new Promise(r => setTimeout(r, 3000));
            await Axios.get(`${process.env.REACT_APP_API}/status/1`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data'
                }
            }).then(res => {
                this.setState({ status: res.data })
            }).catch((err) => {
                console.error(err.message)
            })
        }

        this.setState({ status: 'Idle' })
        let response = await promise
        console.log(response)
        return response == null ? null : response
    }

    render() {
        return (
            <div className="InputPanelContainer">
                <Header as='h3'>Clustering Corpus (Required)</Header>
                <p>Choose the set of texts you want to analyze with TopEx. You must <strong><em>choose only one</em></strong> of the options below. If you choose to run a PubMed search from within TopEx then your query will be run after pressing the Run button.</p>


                <Button
                    variant="contained"
                    color="primary"
                    disabled={this.state.runningScript || this.state.inputType == null}
                    onClick={() => this.cluster()}
                    className='vspace'
                >Run TopEx!</Button>
                &nbsp;&nbsp;&nbsp;
                <Button
                    style={{ backgroundColor: '#6b6b6b', color: '#FFF' }}
                    variant="contained"
                    onClick={() => this.resetClusteringCorpus()}
                    className='vspace'
                >Reset Input Corpus</Button>
                <br />

                <div className='file-input spacing file-manager'>
                    <Header as="h4">
                        1. From Text Files
                        &nbsp;
                        <span className="tooltip" data-tooltip="Each document must be in it's own UTF-8 encoded text file with a .txt extension. All text documents must be in the same folder with no other files."><i aria-hidden="true" className="question circle fitted icon"></i></span>
                    </Header>
                    <Button
                        variant="contained"
                        color='secondary'
                        onClick={() => {
                            this.resetClusteringCorpus()
                            document.getElementById('multiDocInput').click();
                        }}
                        startIcon={<CloudUploadIcon />}
                    >Upload docs to cluster</Button>
                    <br />
                    {
                        this.state.inputType === 'multi' &&
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

                    <Header as="h4">
                        2. From Delimited File
                        &nbsp;
                        <span className="tooltip" data-tooltip="File has 2 columns (DocID and Text) and a .tsv extension, but columns are delimited by the pipe '|' character."><i aria-hidden="true" className="question circle fitted icon"></i></span>
                    </Header>
                    <Button
                        variant="contained"
                        color='secondary'
                        onClick={() => {
                            this.resetClusteringCorpus()
                            this.setState({ inputType: 'tsv' });
                            document.getElementById('singleDocInput').click();
                        }}
                        startIcon={<CloudUploadIcon />}
                    >Upload .tsv to cluster</Button>

                    {
                        this.state.inputType === 'tsv' &&
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

                    <Header as="h4">
                        3. From Excel File
                        &nbsp;
                        <span className="tooltip" data-tooltip="File has 2 columns (DocID and Text) located on a single sheet and saved with a .xlsx extension."><i aria-hidden="true" className="question circle fitted icon"></i></span>
                    </Header>
                    <Button
                        variant="contained"
                        color='secondary'
                        onClick={() => {
                            this.resetClusteringCorpus()
                            this.setState({ inputType: 'xlsx' });
                            document.getElementById('singleDocInput').click();
                        }}
                        startIcon={<CloudUploadIcon />}
                    >Upload .xlsx to cluster</Button>

                    {
                        this.state.inputType === 'xlsx' &&
                        <div id="excelFileList" className='fileList'>
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

                    <Header as="h4">
                        4. From MEDLINE Formatted File
                        &nbsp;
                        <span className="tooltip" data-tooltip="File is a text file with .txt extension in PubMed MEDLINE format."><i aria-hidden="true" className="question circle fitted icon"></i></span>
                    </Header>
                    <Button
                        variant="contained"
                        color='secondary'
                        onClick={() => {
                            this.resetClusteringCorpus()
                            this.setState({ inputType: 'medline' });
                            document.getElementById('singleDocInput').click();
                        }}
                        startIcon={<CloudUploadIcon />}
                    >Upload MEDLINE file to cluster</Button>

                    {
                        this.state.inputType === 'medline' &&
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

                    <Header as="h4">
                        5. From PubMed Search
                        &nbsp;
                        <span className="tooltip" data-tooltip="Perform and in-app search of PubMed using keywords."><i aria-hidden="true" className="question circle fitted icon"></i></span>
                    </Header>
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
                <p>Select additional documents to be included in the background corpus (Clustering Corpus is automatically included). The Expansion Corpus determines which words are highly informative for clustering. Note, sentences in these documents will not be clustered. **Recommended if clustering a small set of documents.</p>

                <div className='file-input spacing file-manager'>
                    <Button
                        variant="contained"
                        color='secondary'
                        onClick={() => { document.getElementById('uploadExpansionDocsInput').click(); }}
                        startIcon={<CloudUploadIcon />}
                    >Upload expansion docs</Button>
                    <br />
                    <Button
                        style={{ backgroundColor: '#6b6b6b', color: '#FFF' }}
                        variant="contained"
                        onClick={() => { this.resetExpansionCorpus() }}
                        className='vspace'
                    >Reset</Button>

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

                    {this.state.status !== "Idle" &&
                        <div id="status-popup-wrapper">
                            <div className="status-popup">
                                <div className="loader">
                                    <div className="spinner one"></div>
                                    <div className="spinner two"></div>
                                    <div className="spinner three"></div>
                                </div>
                                <p>{this.state.status}</p>
                            </div>
                        </div>
                    }
                </div>
            </div>
        )
    }
}

export default LoadDataTab