//This is a utility function that is used to read in file contents
export function getFileContents(file) {
    console.log('getFileContents', file);
    return new Promise((resolve, reject) => {
        let contents = ""
        const reader = new FileReader()
        reader.onloadend = function (e) {
            contents = e.target.result
            resolve(contents)
        }
        reader.onerror = function (e) {
            reject(e)
        }
        reader.readAsText(file)
    })
}

//Used to send data from child component to parent component
//https://medium.com/@nipunadilhara/passing-data-between-different-components-using-react-c8e27319ee69
export function sendPointData(pointData, getThis) {
    getThis.props.pointData(pointData);
}


export function promptForFileName() {
    let name = null
    while (true) {
        name = prompt("Enter name for export file", "export")
        if (name == null) { //cancel
            return;
        }
        else if (name === "") { //blank name
            alert("Name cannot be empty!")
        }
        else { // Valid name
            break;
        }
    }
    return name;
}

export function exportPipeDelimited(body, filename) {
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

//This is what is called when you click the 'export as png' button under the graphs
export const exportSVGAsPNG = (id) => {
    let name = promptForFileName();
    require('save-svg-as-png').saveSvgAsPng(document.getElementById(id), name + ".png")
}

function getDropdownList(array, dropdownid) {
    return array.map((m, ix) => {
        return {
            key: m,
            text: m,
            value: m,
            dropdownid: ix === 0 ? dropdownid : null
        }
    })
}

export function getVisualizationMethods(dropdownid) { 
    const options = ['umap', 'svd', 'tsne', 'mds'];
    return getDropdownList(options, dropdownid); 
}

export function getClusteringMethods(dropdownid) { 
    const options = ['hac', 'kmeans'];
    return getDropdownList(options, dropdownid); 
}

export function getDistanceMetric(dropdownid) { 
    const options = ['correlation','cosine','euclidean'];
    return getDropdownList(options, dropdownid); 
}

export function getVectorizationMethod(dropdownid) { 
    const options = ['svd', 'tfidf','umap','pretrained','local'];
    return getDropdownList(options, dropdownid); 
}

export function getTfidfCorpus(dropdownid) { 
    const options = ['both', 'clustering','expansion'];
    return getDropdownList(options, dropdownid); 
}

//This is used to get the highest cluster number from a dataframe.
export function getMax(data) {
    return Math.max(...data.map(x => x.cluster))
}

function createPointObject(data, cluster_topics, i) {
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
export function reformatJSON(apiResultRaw) {
    if (apiResultRaw.state.pre_process_data !== apiResultRaw.props.data) {
        //Begin data reformatting
        var apiResult = JSON.parse(apiResultRaw.props.data)
        var visualizationMethod = apiResult["visualizationMethod"];

        let viz_df = JSON.parse(apiResult.viz_df);
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

//This is used to format the data for the wordcloud graph. 
//NOTE: you must pass in data that has already been formatted by reformatJSON()
export function reformatJSONWordcloud(data, getThis) {
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
    if (getThis && JSON.stringify(getThis.state.graphData) !== JSON.stringify(clusterTokenDict)) {
        getThis.setState({ "graphData": clusterTokenDict })
    }
    return clusterTokenDict
}