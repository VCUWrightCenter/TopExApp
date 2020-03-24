
const saveSvgAsPng = require('save-svg-as-png')

export const sendPointData = (pointData) => {
    console.log("sacatterplot sending ponit daat", pointData)
    this.props.pointData(pointData)
};

export const convertToJson = (jsonString) => {
    try {
        return JSON.parse(jsonString)
    } catch (error) {
        console.error(error)
    }
}

//This method is responsible for formatting the JSON data we received into a format such that each object is "complete"
//Complete = every object in the resulting array will hold all of the information for a single datapoint
//Now that we have the new return object, this method will need to be updated
//The complete objects contain labels which correspond to the raw sentence which was used. We can use this info to add on the raw_sent to each complete object
//The complete object also contain a cluster identifier. Not sure what this could be used for yet, but most likely could be used to color code clusters, and add on cluster specific info later

export const reformatJSON = (getThis) => {
    console.log(getThis)
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
            console.log(completeObjects)

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

export const exportSVGAsPNG = () => {
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
    saveSvgAsPng.saveSvgAsPng(document.getElementById("scatterplotSVG"), name + ".png")
}

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