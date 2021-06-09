import React, { Component } from 'react';
import * as d3 from "d3";
import './WordCloud.css'
import * as util from '../../Shared'
import { Button, Dropdown } from 'semantic-ui-react'

class WordCloud extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dropDownOptions: null,
            wordClouds: null,
            runtime: null,
            dimensions: null
        }
    }

    async componentDidUpdate() {
        if (this.props.runtime !== this.state.runtime) {
            this.setState({runtime: this.props.runtime});
            await this.reload()
        }
    }

    async componentDidMount() {
        this.setState({runtime: this.props.runtime});
        await this.reload()
    }

    async reload() {
        if (this.props.data) {
            // Generate word cloud data
            let wordClouds = util.getWordClouds(this.props.data)

            // Set drop down options
            let max = util.getMax(this.props.data);
            let options = Array.from({length: max+1}, (x,i) => {return { 'key':i, 'text':`Cluster ${i}`, 'value': i }})
            await this.setState({
                dropDownOptions: options,
                wordClouds: wordClouds
            });

            // Draw initial word cloud
            this.drawChart(0);
        }
    }

    //Reponsible for drawing the Word Cloud
    drawChart(cluster_id) {
        let clusterData = { "children": this.state.wordClouds[cluster_id] }

        var margin = { top: 10, right: 30, bottom: 30, left: 60 }
        let height, width = 0;
        if (this.state.dimensions == null) {
            width = document.getElementById('mainWrapper').offsetWidth
            - margin.left
            - margin.right
            - parseInt(getComputedStyle(document.getElementsByClassName('ui segment')[0]).paddingRight)
            - parseInt(getComputedStyle(document.getElementsByClassName('ui segment')[0]).paddingLeft);

            height = document.getElementById('mainWrapper').offsetHeight - 250;

            this.setState({
                dimensions: { width, height }
            })
        } else {
            width = this.state.dimensions.width
            height = this.state.dimensions.height
        }        

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

        var bubble = d3.pack({ "children": clusterData })
            .size([height, height])
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
            .style("fill", function (d) {
                return util.getClusterColor(d.data);
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
                    onChange={(e, data) => this.drawChart(data.value)}
                    defaultValue={this.state.dropDownOptions == null ? "" : this.state.dropDownOptions[0]?.value}
                    className='dropDown'
                />
                <div className='graph' id="WordCloudNode"></div>
                <div id='exportButtons' className='exportButtons'>
                    <Button
                        onClick={(e) => util.exportSVGAsPNG("WordCloudSVG")}
                        content="Export Word Cloud (.png)"
                        className="ui black button"
                    />
                </div>
            </div>
        )
    }
}

export default WordCloud;
