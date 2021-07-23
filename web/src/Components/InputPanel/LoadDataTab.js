import React, { Component } from "react";
import Axios from "axios";
import './InputPanel.css';
import { Input, Button, Header } from 'semantic-ui-react';
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
        let files = Array.from(uploads)
            .filter(f => f !== undefined && f.name.includes('.txt'));
        files.forEach(f => f.checked = true);
        return files;
    }

    // Upload input document(s) from user input
    uploadInput(uploads, inputType) {
        let files = this.mapFiles(uploads);
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
        this.setState({
            maxResults: m,
            query: q,
            inputType: 'pubmed'
        });
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
        this.state.status = 'Initializing'
        let params = await this.props.extractParams()
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
            this.setState({ status: 'Idle' })
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
                if (pending) this.setState({ status: res.data })
            }).catch((err) => {
                console.error(err.message)
            })
        }

        let response = await promise
        return response == null ? null : response
    }

    render() {
        return (
            <div className="InputPanelContainer">

                <Button
                    color='green'
                    disabled={this.state.runningScript}
                    loading={this.state.runningScript}
                    onClick={() => this.cluster()}
                    content='CLUSTER!'
                    className='vspace'
                />

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
                        this.state.inputType==='multi' &&
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
                        this.state.inputType==='csv' &&
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
                        this.state.inputType==='medline' &&
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