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
        cluster_info: cluster_topics[data.cluster[i]],
        label: data.label[i],
        phrase: data.phrase[i],
        raw_sent: data.text[i],
        x: data.x[i],
        y: data.y[i]
    }
}

//This method is responsible for formatting the JSON data we received into a format such that each object is "complete"
//Complete = every object in the resulting array will hold all of the information for a single datapoint. 
//Now that we have the new return object, this method will need to be updated
//The complete objects contain labels which correspond to the raw sentence which was used. We can use this info to add on the raw_sent to each complete object
//The complete object also contain a cluster identifier. Not sure what this could be used for yet, but most likely could be used to color code clusters, and add on cluster specific info later
//NOTE: This graph was intitially designed to format data for the scatterplot. However, more methods may need to be created when working with other types of graphs to correctly format the data. 

export const reformatJSON = (getThis) => {
    if (getThis.state.pre_process_data !== getThis.props.data) {
        //Begin data reformatting
        var APIReturnObject = convertToJson(getThis.props.data)

        let umap = convertToJson(APIReturnObject.df1)
        let mds = convertToJson(APIReturnObject.df2)
        let svd = convertToJson(APIReturnObject.df3)
        let cluster_topics = APIReturnObject.main_cluster_topics

        let umapObjects = []
        let mdsObjects = []
        let svdObjects = []
        
        for (var i=0; i<APIReturnObject.count; i++){
            umapObjects.push(createPointObject(umap, cluster_topics, i));
            mdsObjects.push(createPointObject(mds, cluster_topics, i));
            svdObjects.push(createPointObject(svd, cluster_topics, i));
        }
        let completeObjectsArray = [umapObjects, mdsObjects, svdObjects];

        getThis.setState({
            dataframe_identifier: getThis.state.dataframe_identifier,
            completeObjectsArray: completeObjectsArray,
            pre_process_data: getThis.props.data
        })
        return completeObjectsArray;
    }
    else {
        return getThis.state.completeObjectsArray;
    }
}

//This is what is called when you click the 'export as png' button under the graphs
export const exportSVGAsPNG = (id) => {
    let name = null
    while (true) {
        name = prompt("Enter name for export file", "export")
        if (name == null) {
            return;
        }
        else if (name === "") {
            alert("Name cannot be empty!")
        }
        else {
            break;
        }
    }
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
        cluster_info: item.cluster_info
    }
    return obj
}

//This is what is called when you click on the 'export graph data' button under each graph.
//It essentially just exports a text file containing the data used to create the graph. 
//This does not work for Wordcloud graphs at the moment. 
export const exportDataForGraph = (getThis) => {
    //Get the data we need to export
    let name = null
    while (true) {
        name = prompt("Enter name for export file", "export")
        if (name == null) {
            return;
        }
        else if (name === "") {
            alert("Name cannot be empty!")
        }
        else {
            break;
        }
    }

    let data;
    let exportDataStr = ''
    let exportData;
    
    if (getThis.state.graphType === 'scatterplot') {
        data = getThis.state.completeObjectsArray[getThis.state.dataframe_identifier]
        exportData = data.map((obj) => createObjectFromItem(obj));
    }
    else if (getThis.state.graphType === 'wordcloud') {
        exportData = getThis.state.graphData
    }

    for (let x in exportData) {
        exportDataStr += JSON.stringify(exportData[x]) + '\n'
    }
    const element = document.createElement("a");
    const file = new Blob([exportDataStr], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = name + ".txt";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
}

//Used in coloring graph. We are essentially just creating a color scale from 0 to the integer equivalent of DDDDDD
export const getClusterColor = (d, max) => {
    let clusterData = d.cluster
    let maxScaleVal = parseInt('DDDDDD', 16)
    let increment = Math.round(maxScaleVal / parseInt(max))
    let color = maxScaleVal - (increment * parseInt(clusterData))
    color = color.toString(16)
    return '#' + color
}

//This is used to format the data for the wordcloud graph. 
//NOTE: you must pass in data that has already been formatted by reformatJSON()
export const reformatJSONWordcloud = (rawData, getThis) => {
    let phraseTracker = {}
    for (let objectIndex in rawData[0]) {
        let currentObject = rawData[0][objectIndex];
        let clusterNum = currentObject.cluster
        for (let phraseIndex in currentObject['phrase']) {
            let phrase = currentObject['phrase'][phraseIndex]
            
            if (clusterNum in phraseTracker) {
                if (phrase in phraseTracker[clusterNum]) {
                    phraseTracker[clusterNum][phrase] += 1
                }
                else {
                    phraseTracker[clusterNum][phrase] = 1
                }
            }
            else {
                let temp = {}
                temp[phrase] = 1
                phraseTracker[clusterNum] = temp
            }
        }
    }

    let ret = {}
    for (let x in phraseTracker) {
        let arr = []
        for (let phrase in phraseTracker[x]) {
            if (phraseTracker[x][phrase] !== 1) {
                arr.push({ 'phrase': phrase, 'value': phraseTracker[x][phrase], "cluster": x })
            }
        }
        ret[x] = arr
    }
    // Ret from reformat json Word cloud
    if (JSON.stringify(getThis.state.graphData) !== JSON.stringify(ret)) {
        getThis.setState({
            "graphData": ret
        })
    }
    return ret
}


//This is used to get the highest cluster number from a dataframe.
export const getMax = (data) => {
    return Math.max(...data.map(x => x.cluster))
}