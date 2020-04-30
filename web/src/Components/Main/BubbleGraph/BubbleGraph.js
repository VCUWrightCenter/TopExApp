//What you should know before you work on the Bubble graph

//Our objective was to take the clusters in the scatter plot and make one data point out of each cluster.
//To accomplish this use this source to understand how to create a simple bubble graph https://www.d3-graph-gallery.com/graph/bubble_basic.html 
//To figure out the size of the cluster, there must be a count on the number of data points in a cluster.  This count will be the size of the new data point.
//Next find the averages of both the x and y values of that cluster to determine where the new large data point should be placed on the graph.
//Do this using the data array "let data = dataArray[dataFrameNumber]" at line 56


import React, { Component } from 'react';
import * as d3 from "d3";
import './BubbleGraph.css'
import * as util from '../graphUtil.js'
import { max } from 'd3';
import { Button } from 'semantic-ui-react'

class BubbleGraph extends Component {

    constructor(props) {
        super(props);
        this.state = {
            graphType: 'BubbleGraph',
            dataframe_identifier: 0,
            completeObjectsArray: null,
            pre_process_data: null,
            dimensions: null
        }
    }

    //This is for the radio buttons
    componentDidUpdate() {
        //console.log("Scatteplot update")
        this.drawChart(this.state.dataframe_identifier)
    }

    //This is to get the graph to show upp in the tab
    componentDidMount() {
        if (this.props.data) {
            this.drawChart(this.state.dataframe_identifier);
        }
        else {
            console.log("No Bubble Graph data")
            console.log(this.state.completeObjectsArray)
        }
    }


    //Reponsible for drawing the graph. This is the only place where D3 should live. 
    async drawChart(dataFrameNumber) {

        //console.log(this.convertToJson(this.props.data))

        let dataArray = util.reformatJSON(this)
        //console.log("This is the reformatted json that should contains the data for all 3 of the datafrmaes")
        //console.log(dataArray)
        let data = dataArray[dataFrameNumber] //ARRAY FROM THE DIRECTIONS AT THE BEGINNING 


        //console.log("DATA", data)

        let clusterID = util.getClusterID(data[0])
        //console.log('clusterID',clusterID)

        let max = util.getMax(data)

        let xArr = data.map((obj) => obj.x)
        let yArr = data.map((obj) => obj.y)


        let xMin = Math.min(...xArr) < 0 ? Math.min(...xArr) * 1.2 : Math.min(...xArr) * 0.8
        let yMin = Math.min(...yArr) < 0 ? Math.min(...yArr) * 1.2 : Math.min(...yArr) * 0.8
        let xMax = Math.max(...xArr) > 0 ? Math.max(...xArr) * 1.2 : Math.max(...xArr) * 0.8
        let yMax = Math.max(...yArr) > 0 ? Math.max(...yArr) * 1.2 : Math.max(...yArr) * 0.8

        var margin = { top: 10, right: 30, bottom: 30, left: 60 }
        let width = document.getElementById('mainWrapper').offsetWidth
            - margin.left
            - margin.right
            - parseInt(getComputedStyle(document.getElementsByClassName('ui segment')[0]).paddingRight)
            - parseInt(getComputedStyle(document.getElementsByClassName('ui segment')[0]).paddingLeft)


        let height = document.getElementById('mainWrapper').offsetHeight -
            margin.top -
            margin.bottom -
            document.getElementsByClassName('ui segment')[0].offsetHeight
            - document.getElementById('exportButtons').offsetHeight
            - document.getElementById('dfSelectContainer').offsetHeight
            - parseInt(getComputedStyle(document.getElementsByClassName('ui segment')[0]).paddingTop)
            - parseInt(getComputedStyle(document.getElementsByClassName('ui segment')[0]).paddingBottom)
            - parseInt(getComputedStyle(document.getElementsByClassName('ui segment')[0]).marginBottom)
            ;

        if (this.state.dimensions == null) {
            await this.setState({
                dimensions: { width, height }
            })
        }

        width = this.state.dimensions.width
        height = this.state.dimensions.height

        d3.select("#BubbleGraphSVG").remove();
        // append the svg object to the body of the page
        var svg = d3.select("#BubbleGraphNode")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .attr("id", "BubbleGraphSVG")
            // .call(d3.zoom().on("zoom", function () {
            //     svg.attr("transform", d3.event.transform)
            // }))
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

        // Add X axis
        var x = d3.scaleLinear()
            .domain([xMin, xMax])
            .range([0, width]);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        // Add Y axis
        var y = d3.scaleLinear()
            .domain([yMin, yMax])
            .range([height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));

        // Add a scale for bubble size
        var z = d3.scaleLinear()
            .domain([1, 1000])
            .range([ 1, 40]);

        //Add dots
        svg.append('g')
            .selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", function (d) { return x(d.x) }) //Plotting x value
            .attr("cy", function (d) { return y(d.y) }) //Plotting y value
            //.attr("r", function (d) { return z(d.) } ) //Need something here to represent cluster size
            .attr("r", 3)
            .style("fill", "gold")
            .attr("stroke", "grey")
            //Source; some code from here: https://www.d3-graph-gallery.com/graph/bubble_basic.html


    }

    render() {
        return (
            <div id='graphContainer' className='graphContainer'>
                <div className='graph' id="BubbleGraphNode"></div>
                <div id="dfSelectContainerBubbleGraph" hidden='true'>
                    <div className="gridContainer" id='gridContainer'>
                        <div className='gridItem'>
                            <label>UMAP</label>
                            <input type='radio' id='dataframe1Radio' name='dfSelect' value='1' onClick={() => this.setState({ dataframe_identifier: 0 })} defaultChecked />
                        </div>
                        <div className='gridItem'>
                            <label>MDS</label>
                            <input type='radio' id='dataframe2Radio' name='dfSelect' value='2' onClick={() => this.setState({ dataframe_identifier: 1 })} />
                        </div>
                        <div className='gridItem'>
                            <label>SVD</label>
                            <input type='radio' id='dataframe3Radio' name='dfSelect' value='3' onClick={() => this.setState({ dataframe_identifier: 2 })} />
                        </div>
                    </div>
                </div>
                <div id='exportButtons' className='exportButtons'>
                    <Button
                        onClick={(e) => util.exportSVGAsPNG("BubbleGraphSVG")}
                        content="Export graph as png"
                    />
                    <Button
                        onClick={() => util.exportDataForGraph(this)}
                        content="Export graph data"
                    />
                    {/* <button onClick={(e) => util.exportSVGAsPNG("scatterplotSVG")}>Export graph as png</button>
                    <button onClick={() => util.exportDataForGraph(this)}>Export Graph Data</button> */}
                </div>
            </div>
        )
    }
}

export default BubbleGraph;
