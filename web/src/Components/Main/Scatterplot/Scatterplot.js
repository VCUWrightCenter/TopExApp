import React, { Component } from 'react';
import * as d3 from "d3";

class Scatterplot extends Component {


    constructor(props) {
        super(props);
        this.state = {
            dataframe_identifier: 0,
            completeObjectsArray: null
        }
    }

    componentDidUpdate() {
        this.drawChart(this.state.dataframe_identifier);
    }

    convertToJson(jsonString) {
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

    reformatJSON() {
        if (this.state.completeObjectsArray == null) {

            let completeObjectsArray = []
            //Begin data reformatting
            var APIReturnObject = this.convertToJson(this.props.data)
            var raw_sentences = APIReturnObject.raw_sent
            var main_cluster_topics = APIReturnObject.main_cluster_topics
            console.table(raw_sentences)
            console.table(main_cluster_topics)
            var dataframeArray = []
            dataframeArray[0] = this.convertToJson(APIReturnObject.df1)
            dataframeArray[1] = this.convertToJson(APIReturnObject.df2)
            dataframeArray[2] = this.convertToJson(APIReturnObject.df3)

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

                    console.log(index)
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
            this.setState({
                dataframe_identifier: 0,
                completeObjectsArray: completeObjectsArray})
            return completeObjectsArray;
        }
        else{
            console.log('data already processed')
            return this.state.completeObjectsArray;
        }
    }


    drawChart(dataFrameNumber) {

        console.log(this.convertToJson(this.props.data))

        let dataArray = this.reformatJSON()
        console.log("This is the reformatted json that should contains the data for all 3 of the datafrmaes")
        console.log(dataArray)
        let data = dataArray[dataFrameNumber]



        var margin = { top: 10, right: 30, bottom: 30, left: 60 },
            width = 600,
            height = 600;
        d3.select("svg").remove();
        // append the svg object to the body of the page
        var svg = d3.select("#node")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        // Add X axis
        var x = d3.scaleLinear()
            .domain([-10, 10])
            .range([0, width]);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        // Add Y axis
        var y = d3.scaleLinear()
            .domain([-10, 10])
            .range([height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));

        //Add dots
        svg.append('g')
            .selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", function (d) { return x(d.x) })
            .attr("cy", function (d) { return y(d.y) })
            .attr("r", 3)

        document.getElementById('dfSelectContainer').hidden = false

    }

    render() {
        return (
            <React.Fragment>
                <div id="node"></div>
                <div id="dfSelectContainer" hidden='true'>
                    <input type='radio' id='dataframe1Radio' name='dfSelect' value='1' onClick={() => this.setState({ dataframe_identifier: 0 })} defaultChecked />
                    <input type='radio' id='dataframe2Radio' name='dfSelect' value='2' onClick={() => this.setState({ dataframe_identifier: 1 })} />
                    <input type='radio' id='dataframe3Radio' name='dfSelect' value='3' onClick={() => this.setState({ dataframe_identifier: 2 })} />
                </div>
            </React.Fragment>
        )
    }
}

export default Scatterplot;