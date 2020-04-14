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

//This method is responsible for formatting the JSON data we received into a format such that each object is "complete"
//Complete = every object in the resulting array will hold all of the information for a single datapoint. 
//Now that we have the new return object, this method will need to be updated
//The complete objects contain labels which correspond to the raw sentence which was used. We can use this info to add on the raw_sent to each complete object
//The complete object also contain a cluster identifier. Not sure what this could be used for yet, but most likely could be used to color code clusters, and add on cluster specific info later
//NOTE: This graph was intitially designed to format data for the scatterplot. However, more methods may need to be created when working with other types of graphs to correctly format the data. 

export const reformatJSON = (getThis) => {
    //console.log("REFORMAT JSON STATE",getThis)
    if (getThis.state.pre_process_data != getThis.props.data) {

        let completeObjectsArray = []
        //Begin data reformatting
        var APIReturnObject = convertToJson(getThis.props.data)
        console.log("APIRETUIRN")
        console.log(APIReturnObject)
        //console.log(APIReturnObject)
        var raw_sentences = APIReturnObject.raw_sent
        var main_cluster_topics = APIReturnObject.main_cluster_topics
        // console.table(raw_sentences)
        // console.table(main_cluster_topics)
        var dataframeArray = []
        dataframeArray[0] = convertToJson(APIReturnObject.df1)
        dataframeArray[1] = convertToJson(APIReturnObject.df2)
        dataframeArray[2] = convertToJson(APIReturnObject.df3)

        for (var index in dataframeArray) {
            let data = dataframeArray[index]
            // console.log("This is the data tht is being processed in reformat json")
            // console.log(data)
            //Put every object into an array
            let objArray = []
            for (var obj in data) {
                //console.log(obj)
                let currentObject = data[obj]
                objArray.push(currentObject)
            }


            let completeObjects = []
            //console.log(objArray)

            //Figure out the number of keys within each object
            var numKeys = Object.keys(objArray[0]).length
            //console.log(numKeys)

            //Loop through the new list of objects to create "complete" objects
            for (var i = 0; i < numKeys; i++) {
                let tempObj = {}
                for (var obj in objArray) {
                    let label = Object.keys(data)[obj]
                    var currentObject = objArray[obj]
                    var currentKey = Object.keys(currentObject)[i]
                    tempObj[label] = currentObject[currentKey]
                }

                //This is where we should add on the cluster info as well as the raw sentence information. After this we dont need the UMAP_cluster raw a label fields, but unless it is easy to get rid of, its probably not worth getting rid of them
                let sentenceInfo = tempObj.label
                const sentenceRegex = /\d\d|\d/g
                let matchArr = sentenceInfo.match(sentenceRegex) //extract the words from the label
                let doc = matchArr[0]
                let sentenceNumber = matchArr[1]
                let document = raw_sentences[doc]
                tempObj["raw_sent"] = document[sentenceNumber]
                completeObjects.push(tempObj)

                //console.log(index)
                let clusterNumber;
                if (index == 0) {
                    clusterNumber = tempObj.UMAP_cluster
                    tempObj["cluster_info"] = main_cluster_topics[clusterNumber]
                }
                else if (index == 1) {
                    clusterNumber = tempObj.MDS_cluster
                    tempObj["cluster_info"] = main_cluster_topics[clusterNumber]
                }

                else if (index == 2) {
                    clusterNumber = tempObj.SVD_cluster
                    tempObj["cluster_info"] = main_cluster_topics[clusterNumber]
                }

                else {
                    console.error("Error at reformat JSON")
                    alert("Error")
                    return
                }
            }
            //console.log(completeObjects)

            completeObjectsArray.push(completeObjects)
            // return completeObjects
        }
        getThis.setState({
            dataframe_identifier: getThis.state.dataframe_identifier,
            completeObjectsArray: completeObjectsArray,
            pre_process_data: getThis.props.data
        })
        return completeObjectsArray;
    }
    else {
        console.log('data already processed')
        return getThis.state.completeObjectsArray;
    }
}

//This is what is called when you click the 'export as png' button under the graphs
export const exportSVGAsPNG = (id) => {
    let name = null
    while (true) {
        name = prompt("Enter name for export file", "export")
        console.log("NAME", name)
        if (name == null) {
            return;
        }
        else if (name == "") {
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
            //aconsole.log(keys[x])
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
export const exportDataForGraph = (getThis) => {
    //Get the data we need to export
    let name = null
    while (true) {
        name = prompt("Enter name for export file", "export")
        console.log("NAME", name)
        if (name == null) {
            return;
        }
        else if (name == "") {
            alert("Name cannot be empty!")
        }
        else {
            break;
        }
    }
    let data = getThis.state.completeObjectsArray[getThis.state.dataframe_identifier]
    let exportData = data.map((obj) => createObjectFromItem(obj));
    let exportDataStr = ''
    for (let x in exportData) {
        exportDataStr += JSON.stringify(exportData[x]) + '\n'
    }
    //console.log(exportDataList)

    const element = document.createElement("a");
    const file = new Blob([exportDataStr], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = name + ".txt";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
}

//This is used to get key for the cluster type in each dataframe (UMAP, MDS, SVD)
export const getClusterID = (obj) => {
    let clusterID = ''
    let keys = Object.keys(obj)
    for (let x in keys) {
        if (keys[x].includes("cluster")) {
            console.log(keys[x])
            clusterID = keys[x]
            break;
        }
    }
    return clusterID
}


//This is used to get the specific cluster number of a data point
export const getClusterNum = (d) => {
    return d[getClusterID(d)]
}

//Used in coloring graph. We are essentially just creating a color scale from 0 to the integer equivalent of DDDDDD
export const getClusterColor = (d, max) => {

    let clusterData = getClusterNum(d)

    //console.log("MAX",max)
    let maxScaleVal = parseInt('DDDDDD', 16)
    //console.log("max scale val", maxScaleVal)
    let increment = Math.round(maxScaleVal / parseInt(max))
    //console.log("Increment", increment)
    //console.log("cluster", clusterData)
    let color = maxScaleVal - (increment * parseInt(clusterData))
    //console.log("Decided Color b4 convert", color)
    color = color.toString(16)
    //console.log("Decided Color", color)
    return '#' + color

    // return clusterColor(clusterData)
}

//This is used to format the data for the wordcloud graph. 
//NOTE: you must pass in data that has already been formatted by reformatJSON()
export const reformatJSONWordcloud = (rawData) => {
    //console.log("raw data", rawData)
    let phraseTracker = {}
    for (let objectIndex in rawData[0]) {
        let currentObject = rawData[0][objectIndex];
        let clusterID = getClusterID(currentObject)
        let clusterNum = currentObject[clusterID]
        for (let phraseIndex in currentObject['phrase']) {
            let phrase = currentObject['phrase'][phraseIndex]
            //console.log('phrase', phrase)
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

    //console.log("return data", phraseTracker)
    let ret = {}
    for (let x in phraseTracker) {
        let arr = []
        for (let phrase in phraseTracker[x]) {
            if (phraseTracker[x][phrase] != 1) {
                arr.push({ 'phrase': phrase, 'value': phraseTracker[x][phrase], "cluster": x })
            }
        }
        ret[x] = arr
    }
    console.log("REt from reformat json Word cloud", ret)
    return ret
}


//This is used to get the highest cluster number from a dataframe.
export const getMax = (data) => {
    let max = 0;
    let clusterID = getClusterID(data[0])
    data.forEach(element => {
        if (max < element[clusterID]) {
            max = element[clusterID]
        }
    });
    //increment since clusterID's start at 0
    max++;

    return max
}