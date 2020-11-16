import { promptForFileName } from '../Shared'

//This file holds all of the utility functions for all of the graphs
//This allows for much easier creation of graphs since we do not have to worry about changing code in mulitple places
const saveSvgAsPng = require('save-svg-as-png')

//Used to send data from child component to parent component
//https://medium.com/@nipunadilhara/passing-data-between-different-components-using-react-c8e27319ee69
export const sendPointData = (pointData, getThis) => {
    getThis.props.pointData(pointData)
};

export const convertToJson = (jsonString) => {
    try {
        return JSON.parse(jsonString)
    } catch (error) {
        console.error(error)
    }
}

export const createPointObject = (data, cluster_topics, i) => {
    return {
        cluster: data.cluster[i],
        cluster_topic: cluster_topics[data.cluster[i]],
        label: data.label[i],
        phrase: data.phrase[i],
        raw_sent: data.text[i],
        x: data.x[i],
        y: data.y[i],
        valid: data.valid[i]
    }
}

//This method is responsible for formatting the JSON data we received into a format such that each object is "complete"
//Complete = every object in the resulting array will hold all of the information for a single datapoint. 
//Now that we have the new return object, this method will need to be updated
//The complete objects contain labels which correspond to the raw sentence which was used. We can use this info to add on the raw_sent to each complete object
//The complete object also contain a cluster identifier. Not sure what this could be used for yet, but most likely could be used to color code clusters, and add on cluster specific info later
//NOTE: This graph was intitially designed to format data for the scatterplot. However, more methods may need to be created when working with other types of graphs to correctly format the data. 

export const reformatJSON = (apiResultRaw) => {
    if (apiResultRaw.state.pre_process_data !== apiResultRaw.props.data) {
        //Begin data reformatting
        var apiResult = convertToJson(apiResultRaw.props.data)
        var visualizationMethod = apiResult["visualizationMethod"];

        let viz_df = convertToJson(apiResult.viz_df);
        let cluster_topics = apiResult.main_cluster_topics;
        let dataPoints = [];

        for (var i = 0; i < apiResult.count; i++) {
            dataPoints.push(createPointObject(viz_df, cluster_topics, i));
        }

        apiResultRaw.setState({
            dataframe_identifier: apiResultRaw.state.dataframe_identifier,
            dataPoints: dataPoints,
            pre_process_data: apiResultRaw.props.data,
            visualizationMethod: visualizationMethod
        })
        return dataPoints;
    }
    else {
        return apiResultRaw.state.dataPoints;
    }
}

//This is what is called when you click the 'export as png' button under the graphs
export const exportSVGAsPNG = (id) => {
    let name = promptForFileName();
    saveSvgAsPng.saveSvgAsPng(document.getElementById(id), name + ".png")
}

//Used in exportDataForGraph
export const createObjectFromItem = (item) => {

    let keys = Object.keys(item)
    let cluster = ""
    let clusterData = ""
    for (let x in keys) {
        if (keys[x].includes("cluster")) {
            cluster = keys[x]
            clusterData = item[cluster]
            break;
        }
    }
    let obj = {
        x: item.x,
        y: item.y,
        [cluster]: clusterData,
        cluster_topic: item.cluster_topic
    }
    return obj
}

//This is what is called when you click on the 'export graph data' button under each graph.
//It essentially just exports a text file containing the data used to create the graph. 
//This does not work for Wordcloud graphs at the moment. 
export const exportScatterplotData = (data) => {
    // Name the export file
    let filename = promptForFileName();

    // Create .csv body from scatterplot data
    let scatterplotData = JSON.parse(data.viz_df);
    let body = "x|y|cluster\n"
    for (let i = 0; i < data.count; i++) {
        body += `${scatterplotData.x[i]}|${scatterplotData.y[i]}|${scatterplotData.cluster[i]}\n`;
    }
    exportPipeDelimited(body, filename);    
}

export const exportResults = (data) => {
    // Name the export file
    let filename = promptForFileName();
    
    // Create .csv body from scatterplot data
    let results = JSON.parse(data.data);
    let body = "id|cluster|phrase|tokens|text|cluster_topics\n"
    for (let i = 0; i < data.count; i++) {
        body += `${results.id[i]}|${results.cluster[i]}|${results.phrase[i]}|${results.tokens[i]}|${results.text[i]}|${data.main_cluster_topics[results.cluster[i]]}\n`;
    }
    exportPipeDelimited(body, filename);    
}

function exportPipeDelimited(body, filename) {
    let blob = new Blob([body], { type: 'text/csv;charset=utf-8;' });
    let link = document.createElement("a");
    var url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}.txt`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Deterministically generate color for each cluster
export const getClusterColor = (d, max) => {
    return '#' + ('00000' + (Math.abs(Math.cos(d.cluster)) * (1 << 24) | 0).toString(16)).slice(-6);
}

//This is used to format the data for the wordcloud graph. 
//NOTE: you must pass in data that has already been formatted by reformatJSON()
export const reformatJSONWordcloud = (data, getThis) => {
    let tokenCounter = {}
    data.forEach(sentence => {
        let cluster = sentence.cluster

        sentence.phrase.forEach(token => {
            // Initialize dictionary for cluster
            if (!(cluster in tokenCounter)) {
                tokenCounter[cluster] = {};
            }

            // Initialize dictionary for token within cluster
            if (!(token in tokenCounter[cluster])) {
                tokenCounter[cluster][token] = 1;
            } else {
                tokenCounter[cluster][token] += 1;
            }
        });
    });

    let clusterTokenDict = {}
    for (let cluster in tokenCounter) {
        let tokenCounts = []
        for (let token in tokenCounter[cluster]) {
            if (tokenCounter[cluster][token] !== 1) {
                tokenCounts.push({ 'phrase': token, 'value': tokenCounter[cluster][token], "cluster": cluster })
            }
        }
        clusterTokenDict[cluster] = tokenCounts
    }
    // Ret from reformat json Word cloud
    if (JSON.stringify(getThis.state.graphData) !== JSON.stringify(clusterTokenDict)) {
        getThis.setState({
            "graphData": clusterTokenDict
        })
    }
    return clusterTokenDict
}


//This is used to get the highest cluster number from a dataframe.
export const getMax = (data) => {
    return Math.max(...data.map(x => x.cluster))
}