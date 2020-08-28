import React, { Component } from 'react';
import * as d3 from "d3";
import './WordCloud.css'
import * as util from '../graphUtil.js'
import { Button, Dropdown } from 'semantic-ui-react'

class WordCloud extends Component {

    constructor(props) {
        super(props);
        this.state = {
            graphType: 'wordcloud',
            cluster_identifier: 0,
            dataPoints: null,
            pre_process_data: null,
            dimensions: null,
            dropDownOptions: null,
            graphData: null,
            max: 0,
        }
    }

    //This is so we can update the garph based on either radio buttons or dropdowns etc...
    componentDidUpdate() {
        this.drawChart(this.state.cluster_identifier)
    }

    // This is to get the graph to show upp in the tab
    componentDidMount() {
        if (this.props.data) {
            this.drawChart(this.state.cluster_identifier);
        }
    }

    async setDropDownOptions() {

        let arr = []
        for (let i = 0; i <= this.state.max; i++) {
            arr.push({ key: i, text: "Cluster " + i, value: i })
        }
        await this.setState({
            dropDownOptions: arr
        })
    }


    //Reponsible for drawing the graph. This is the only place where D3 should live. 
    async drawChart(clusterNumber) {

        let data = util.reformatJSON(this)

        let clusterArray = util.reformatJSONWordcloud(data, this)

        let clusterData = { "children": clusterArray[clusterNumber] }

        let max = util.getMax(data)

        if (this.state.max !== max) {
            await this.setState({
                max: max
            })
            this.setDropDownOptions()
        }

        if (this.state.dropDownOptions == null) {
            this.setDropDownOptions();
        }


        var margin = { top: 10, right: 30, bottom: 30, left: 60 }
        let width = document.getElementById('mainWrapper').offsetWidth
            - margin.left
            - margin.right
            - parseInt(getComputedStyle(document.getElementsByClassName('ui segment')[0]).paddingRight)
            - parseInt(getComputedStyle(document.getElementsByClassName('ui segment')[0]).paddingLeft)

        let height = document.getElementById('mainWrapper').offsetHeight -
        250

        if (this.state.dimensions == null) {
            await this.setState({
                dimensions: { width, height }
            })
        }

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
        var bubble = d3.pack({ "children": clusterData })
            .size([diameter, diameter])
            .padding(1.5);

        var nodes = d3.hierarchy(clusterData)
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
                return d.data.phrase + ": " + d.value;
            });

        node.append("circle")
            .attr("r", function (d) {
                return d.r;
            })
            .style("fill", function (d, i) {
                return util.getClusterColor(d.data, max);
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
                return d.data.value;
            })
            .attr("font-family", "Gill Sans", "Gill Sans MT")
            .attr("font-size", function (d) {
                return d.r / 5;
            })
            .attr("fill", "white");
    }

    render() {
        return (
            <div id='graphContainer' className='graphContainer'>
                <Dropdown
                    selection
                    placeholder='Cluster Number'
                    options={this.state.dropDownOptions}
                    onChange={(e, data) => {
                        this.setDropDownOptions()
                        this.setState({ cluster_identifier: data.value });
                    }}
                    defaultValue={this.state.dropDownOptions == null ? "" : this.state.dropDownOptions[0].value}
                    className='dropDown'

                />
                <div className='graph' id="WordCloudNode"></div>
                <div id='exportButtons' className='exportButtons'>
                    <Button
                        onClick={() => util.exportDataForGraph(this)}
                        content="Export graph data"
                        className="ui black button"
                    />
                </div>

            </div>
        )
    }
}

export default WordCloud;
