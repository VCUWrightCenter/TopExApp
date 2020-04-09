import React, { Component } from 'react';
import * as d3 from "d3";
import './WordCloud.css'
import * as util from '../graphUtil.js'
import { max } from 'd3';

class WordCloud extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataframe_identifier: 0,
            completeObjectsArray: null,
            pre_process_data: null,
            dimensions: null
        }
    }

    //This is for the radio buttons
    // componentDidUpdate() {
    //     //console.log("Scatteplot update")
    //     this.drawChart(this.state.dataframe_identifier)
    // }

    // This is to get the graph to show upp in the tab
    componentDidMount() {
        if (this.props.data) {
            this.drawChart(this.state.dataframe_identifier);
        }
        else {
            console.log("No WordCloud data")
            console.log(this.state.completeObjectsArray)
        }
    }

    async drawChart(dataFrameNumber) {

        console.log(util.reformatJSON(this))

        let dataArray = util.reformatJSONWordcloud(util.reformatJSON(this))

        console.log("WORDCLOUD STATE", this.state)

        let data = {"children": dataArray[dataFrameNumber]}

        console.log('data', dataArray)

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
            + 15;

        if (this.state.dimensions == null) {
            await this.setState({
                dimensions: { width, height }
            })
        }


        //console.log(this.state)
        width = this.state.dimensions.width
        height = this.state.dimensions.height


        d3.select("#WordCloudSVG").remove();
        // append the svg object to the body of the page
        var svg = d3.select("#WordCloudNode")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .attr("id", "WordCloudSVG")
            .call(d3.zoom().on("zoom", function () {
                svg.attr("transform", d3.event.transform)
            }))
            .append("g")
            .attr('class', 'bubble')
        // .attr("transform", "translate(" + margin.left + "," + margin.top + ")"

        var diameter = height;
        var bubble = d3.pack({"children": data})
            .size([diameter, diameter])
            .padding(1.5);

        var nodes = d3.hierarchy(data)
            .sum(function (d) { return d.value });

        var node = svg.selectAll(".node")
            .data(bubble(nodes).descendants())
            .enter()
            .filter(function (d) {
                return !d.children
            })
            .append("g")
            .attr("class", "node")
            .attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            });

        node.append("title")
            .text(function (d) {
                //console.log('d', d)
                return d.data.phrase + ": " + d.value;
            });

        node.append("circle")
            .attr("r", function (d) {
                return d.r;
            })
            .style("fill", function (d, i) {
                //console.log(d)
                return 'black';
            });

        node.append("text")
            .attr("dy", ".3em")
            .style("text-anchor", "middle")
            .text(function (d) {
                return d.data.phrase;
            })
            .attr("font-family", "sans-serif")
            .attr("font-size", function (d) {
                return d.r / 5;
            })
            .attr("fill", "white");

        node.append("text")
            .attr("dy", "1.3em")
            .style("text-anchor", "middle")
            .text(function (d) {
                //console.log('D', d)
                return d.data.value;
            })
            .attr("font-family", "Gill Sans", "Gill Sans MT")
            .attr("font-size", function (d) {
                return d.r / 5;
            })
            .attr("fill", "white");

        //document.getElementById('dfSelectContainerWordCloud').hidden = false

    }

    render() {
        return (
            <div id='graphContainer' className='graphContainer'>
                <div className='graph' id="WordCloudNode"></div>
                {/* <div id="dfSelectContainerWordCloud" hidden='true'>
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
                </div> */}
                <div id='exportButtons'>
                    <button onClick={() => util.exportSVGAsPNG("WordCloudSVG")}>Export graph as png</button>
                    <button onClick={() => util.exportDataForGraph(this)}>Export Graph Data</button>
                </div>

            </div>
        )
    }
}

export default WordCloud;
