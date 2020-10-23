//This is the left sidebar component. It is EXTREMELY important to this web app.
//This is where communication with the API happens. It is the gateway for data to enter and leave the web app. 
//This is where files are uploaded to the web app, eitehr for import or processing. 
//This is where the graph data is exported. NOTE: Data cannot be exported unless the user "processes" data. That is, unless you send and receive data from the API, you will not be able to export.

import React, { Component } from "react";
import './InputPanel.css';
import { Tab } from 'semantic-ui-react';
import ClusterTab from "./ClusterTab";
import FileManagerTab from "./FileManagerTab";
import ImportExportTab from "./ImportExportTab";
import ReclusterTab from "./ReclusterTab";

class InputPanel extends Component {

    filesToSend = [];

    constructor(props) {
        super(props);
        this.state = {
            corpusDocs: [],
            expansionDocs: [],
            stopwordsFile: null,
            leftTabs: null,
            graphData: null,
            ProcessingRunButtonDisabled: true,
            w2vBinFileFileName: [],
        };
    }

    // Callback for passing graphData from child components back up to App
    graphDataCallback = (graphData) => {
        this.setState({ graphData: graphData })
        this.props.graphDataCallback(graphData)
    }

    // Callback for passing expansionDocs from FileManagerTab components back up to InputPanel
    corpusDocsCallback = (files) => {
        this.setState({ corpusDocs: files })
    }

    // Callback for passing expansionDocs from FileManagerTab components back up to InputPanel
    expansionDocsCallback = (files) => {
        this.setState({ expansionDocs: files })
    }

    // Callback for passing stopwords file from FileManagerTab components back up to InputPanel
    stopwordsFileCallback = (file) => {
        this.setState({ stopwordsFile: file })
    }

    componentDidMount() {
        document.getElementById('tabs').hidden = false;
    }

    render() {
        let panes = [
            { menuItem: 'File Manager', pane: { key: 'pane1', content: <FileManagerTab corpusDocsCallback={this.corpusDocsCallback} expansionDocsCallback={this.expansionDocsCallback} stopwordsFileCallback={this.stopwordsFileCallback} />, className: "pane" } },
            { menuItem: 'Cluster', pane: { key: 'pane3', content: <ClusterTab corpusDocs={this.state.corpusDocs} expansionDocs={this.state.expansionDocs} stopwordsFile={this.state.stopwordsFile} graphDataCallback={this.graphDataCallback} />, className: "pane" } },
            { menuItem: 'Re-Cluster', pane: { key: 'pane0', content: <ReclusterTab graphData={this.state.graphData} graphDataCallback={this.graphDataCallback} />, className: "pane" } },
            { menuItem: 'Import/Export', pane: { key: 'pane2', content: <ImportExportTab graphData={this.state.graphData} graphDataCallback={this.graphDataCallback} />, className: "pane" } }
        ]

        return (
            <>
            <div className="left-sidebar">
                <input type="checkbox" id="drawer-toggle" name="drawer-toggle" />
                <label for="drawer-toggle" id="drawer-toggle-label"></label>

                <div id="drawer" className='left-wrapper'>
                    <div id='tabs' className='sidebar'>
                        <Tab className='pane' menu={{ borderless: true, attached: true, tabular: true, fluid: true, widths: 2, }} panes={panes} renderActiveOnly={false} />
                    </div>
                </div>
            </div>
            </>
        );
    }
}

export default InputPanel