import React, { Component } from 'react';
import * as d3 from "d3";
import './Scatterplot.css'
import * as util from '../graphUtil.js'
import { Button } from 'semantic-ui-react'

class Scatterplot extends Component {

    constructor(props) {
        super(props);
        this.state = {
            graphType: 'scatterplot',
            dataframe_identifier: 0,
            dataPoints: null,
            pre_process_data: null,
            dimensions: null
        }
    }

    //This is for the radio buttons
    componentDidUpdate() {
        this.drawChart(this.state.dataframe_identifier)
    }

    //This is to get the graph to show upp in the tab
    componentDidMount() {
        if (this.props.data) {
            this.drawChart(this.state.dataframe_identifier);
        }
    }


    //Reponsible for drawing the graph. This is the only place where D3 should live. 
    async drawChart(dataFrameNumber) {
        let data = util.reformatJSON(this)
        
        // Filter out points for clusters with < min_cluster_size
        data = data.filter(p => p.valid);
        
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
        200 -
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

        d3.select("#scatterplotSVG").remove();
        // append the svg object to the body of the page
        var svg = d3.select("#node")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom + 60)
            .attr("id", "scatterplotSVG")
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

        // Add X axis label:
        svg.append("text")
            .attr("text-anchor", "end")
            .attr("x", width/2 + margin.left)
            .attr("y", height + margin.top + 40)
            .text("X Axis Label");

        // Y axis label:
        svg.append("text")
            .attr("text-anchor", "end")
            .attr("transform", "rotate(-90)")
            .attr("y", -margin.left + 20)
            .attr("x", -margin.top - height/2 + 20)
            .text("Y Axis Label")
      
        //Add dots
        svg.append('g')
            .selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", function (d) { return x(d.x) }) //Plotting x value
            .attr("cy", function (d) { return y(d.y) }) //Plotting y value
            .attr("r", 3)
            .attr("fill", (d, i) => {
                return util.getClusterColor(d, max)
            })
            .attr("color", (d, i) => {
                return util.getClusterColor(d, max)
            })
            // .on('mouseover', function (d, i) {
            //     d3.select(this)
            //         .transition()
            //         .duration(100)
            //         .attr('fill', 'red');
            // })
            .on('mouseout', function (d, i) {
                d3.select(this)
                    .transition()
                    .duration(100)
                    .attr('fill', this.getAttribute("color"));
            })
            .on('mouseover', (d, i) => {
                util.sendPointData(JSON.stringify(d), this)
            })
        //source:
        //http://jonathansoma.com/tutorials/d3/clicking-and-hovering/
    }

    render() {
        return (
            <div id='graphContainer' className='graphContainer'>
                <div className='graph' id="node"></div>
                <div id="dfSelectContainer" hidden={true}>
                    <div className="gridContainer" id='gridContainer'>
                        <div className='gridItem'>
                            <label htmlFor="dataframe1Radio">UMAP</label>
                            <input type='radio' id='dataframe1Radio' name='dfSelect' value='1' onClick={() => this.setState({ dataframe_identifier: 0 })} defaultChecked />
                        </div>
                        <div className='gridItem'>
                            <label htmlFor="dataframe2Radio">MDS</label>
                            <input type='radio' id='dataframe2Radio' name='dfSelect' value='2' onClick={() => this.setState({ dataframe_identifier: 1 })} />
                        </div>
                        <div className='gridItem'>
                            <label htmlFor="dataframe3Radio">SVD</label>
                            <input type='radio' id='dataframe3Radio' name='dfSelect' value='3' onClick={() => this.setState({ dataframe_identifier: 2 })} />
                        </div>
                    </div>
                </div>

                <Button
                    onClick={(e) => util.exportSVGAsPNG("scatterplotSVG")}
                    content="Export Scatterplot (.png)"
                    className="ui black button"
                />
            </div>
        )
    }
}

export default Scatterplot;
