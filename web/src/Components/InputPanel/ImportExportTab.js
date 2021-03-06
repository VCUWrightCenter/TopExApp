import React, { Component } from "react";
import './InputPanel.css';
import { Button, Header } from 'semantic-ui-react';
import * as util from '../Shared'

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

        let fileContent = await util.getFileContents(file);

        if (fileContent != null && file.name.endsWith('.topex')) {
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
            alert("Error parsing file. Must be a .topex file exported from previous run.")
        }
    }

    //This is used to ensure the import file is not null
    checkImportFile(e) {
        e.preventDefault()
        let input = document.getElementById("importFileInput")
        let file = input.files[0]

        if (file != null) {
            this.setState({ ImportButtonDisabled: false })
        }
        else {
            this.setState({ ImportButtonDisabled: true })
        }
    }

    // This is the function that exports ALL of the graph data that is generated from the last call to the API
    exportData() {
        if (this.props.graphData == null) {
            alert('No data to export')
        }
        else {
            let name = util.promptForFileName();
            const element = document.createElement("a");
            const file = new Blob([JSON.stringify(this.props.graphData)], { type: 'text/plain' });
            element.href = URL.createObjectURL(file);
            element.download = name + ".topex";
            document.body.appendChild(element); // Required for this to work in FireFox
            element.click();
            name = null;
        }
    }

    // This is the function that exports ALL of the graph data that is generated from the last call to the API
    exportCSV(data) {
        if (this.props.graphData == null) {
            alert('No data to export')
        }
        else {
            // Name the export file
            let filename = util.promptForFileName();

            // Create .csv body from scatterplot data
            let results = JSON.parse(data.data);
            let body = "doc_name|text\n"
            for (let i = 0; i < data.count; i++) {
                body += `${results.id[i]}|${results.text[i]}\n`;
            }
            util.exportPipeDelimited(body, filename);
        }
    }

    
    exportResults(data) {
        // Name the export file
        let filename = util.promptForFileName();

        // Create .csv body from scatterplot data
        let results = JSON.parse(data.data);
        let body = "id|cluster|phrase|tokens|text|cluster_topics\n"
        for (let i = 0; i < data.count; i++) {
            body += `${results.id[i]}|${results.cluster[i]}|${results.phrase[i]}|${results.tokens[i]}|${results.text[i]}|${data.main_cluster_topics[results.cluster[i]]}\n`;
        }
        util.exportPipeDelimited(body, filename);
    }

    //This is what is called when you click on the 'export graph data' button under each graph.
    //It essentially just exports a text file containing the data used to create the graph. 
    exportScatterplotData (data) {
        // Name the export file
        let filename = util.promptForFileName();

        // Create .csv body from scatterplot data
        let scatterplotData = JSON.parse(data.viz_df);
        let body = "x|y|cluster\n"
        for (let i = 0; i < data.count; i++) {
            body += `${scatterplotData.x[i]}|${scatterplotData.y[i]}|${scatterplotData.cluster[i]}\n`;
        }
        util.exportPipeDelimited(body, filename);
    }

    exportWordcloudData(data)  {
        // Name the export file
        let filename = util.promptForFileName();
    
        // Format data
        let rawData = JSON.parse(data.data);
        let sents = []
        for (var i = 0; i < Object.keys(rawData.cluster).length; i++) {
            sents.push({ 'cluster': rawData.cluster[i], 'phrase': rawData.phrase[i] });
        }
        let wordcloud = util.getWordClouds(sents);
        
        let results = []
        for (var j = 0; j < Object.keys(wordcloud).length; j++) {
            results = results.concat(wordcloud[j]);
        }
    
        // Create .csv body from scatterplot data
        let body = "cluster|phrase|count\n"
        for (var k = 0; k < results.length; k++) {
            body += `${results[k].cluster}|${results[k].phrase}|${results[k].value}\n`;
        }
        util.exportPipeDelimited(body, filename);
    }

    render() {
        return (
            <div className="InputPanelContainer acknowledgements">
                <Header as='h3'>Import</Header>
                <p>Import the output from a previous clustering.</p>
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
                            content="Import clustering (.topex)"
                            onClick={(e) => this.importData(e)}
                            className='vspace'
                        />
                    </Button.Group>
                    <form>
                        <input id='importFileInput' type="file" hidden onChange={(e) => this.checkImportFile(e)} />
                        <button id='importFileButton' type='submit' hidden onClick={(e) => this.importData(e)}>Import</button>
                    </form>
                </div>
                <Header as='h3'>Export</Header>
                <p>Export results.</p>
                <div className='file-input'>
                    <Button.Group vertical>
                        <Button
                            color='black'
                            content="Export clustering (.topex)"
                            onClick={(e) => this.exportData()}
                        />
                        <Button
                            color='black'
                            content="Export sentences (.csv)"
                            onClick={(e) => this.exportCSV(this.props.graphData)}
                            className='vspace'
                        />
                        <Button
                            color='black'
                            content="Export row-level results (.txt)"
                            onClick={(e) => this.exportResults(this.props.graphData)}
                            className='vspace'
                        />
                        <Button
                            color='black'
                            content="Export scatterplot data (.txt)"
                            onClick={(e) => this.exportScatterplotData(this.props.graphData)}
                            className='vspace'
                        />
                        <Button
                            color='black'
                            content="Export word cloud data (.txt)"
                            onClick={(e) => this.exportWordcloudData(this.props.graphData)}
                            className='vspace'
                        />
                    </Button.Group>
                </div>
            </div>)
    }
}

export default ImportExportTab