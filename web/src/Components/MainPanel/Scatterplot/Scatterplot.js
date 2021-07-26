import React, { Component } from 'react';
import * as d3 from "d3";
import './Scatterplot.css'
import * as util from '../../Shared'
import Button from '@material-ui/core/Button';

class Scatterplot extends Component {

    constructor(props) {
        super(props);
        this.state = {
            runtime: null,
            dimensions: null
        }
    }

    async componentDidUpdate() {
        if (this.props.runtime !== this.state.runtime) {
            this.setState({runtime: this.props.runtime});
            this.drawChart(this.props.data);
        }
    }

    //This is to get the graph to show up in the tab
    componentDidMount() {
        if (this.props.data) {
            this.setState({runtime: this.props.runtime});
            this.drawChart(this.props.data);
        }
    }

    //Reponsible for drawing the Scatterplot
    async drawChart(data) {
        // Filter out points for clusters with < min_cluster_size
        data = data.filter(p => p.valid);

        let xArr = data.map((obj) => obj.x)
        let yArr = data.map((obj) => obj.y)

        let xMin = Math.min(...xArr) < 0 ? Math.min(...xArr) * 1.2 : Math.min(...xArr) * 0.8
        let yMin = Math.min(...yArr) < 0 ? Math.min(...yArr) * 1.2 : Math.min(...yArr) * 0.8
        let xMax = Math.max(...xArr) > 0 ? Math.max(...xArr) * 1.2 : Math.max(...xArr) * 0.8
        let yMax = Math.max(...yArr) > 0 ? Math.max(...yArr) * 1.2 : Math.max(...yArr) * 0.8

        var margin = { top: 10, right: 30, bottom: 30, left: 60 }      
        let height, width = 0;
        if (this.state.dimensions == null) {
            width = document.getElementById('mainWrapper').offsetWidth
            - margin.left
            - margin.right
            - parseInt(getComputedStyle(document.getElementsByClassName('ui segment')[0]).paddingRight)
            - parseInt(getComputedStyle(document.getElementsByClassName('ui segment')[0]).paddingLeft)

            height = document.getElementById('mainWrapper').offsetHeight -
            200 -
            document.getElementsByClassName('ui segment')[0].offsetHeight
            - document.getElementById('dfSelectContainer').offsetHeight
            - parseInt(getComputedStyle(document.getElementsByClassName('ui segment')[0]).paddingTop)
            - parseInt(getComputedStyle(document.getElementsByClassName('ui segment')[0]).paddingBottom)
            - parseInt(getComputedStyle(document.getElementsByClassName('ui segment')[0]).marginBottom);

            this.setState({
                dimensions: { width, height }
            })
        } else {
            width = this.state.dimensions.width
            height = this.state.dimensions.height
        }  

        d3.select("#scatterplotSVG").remove();
        // append the svg object to the body of the page
        var svg = d3.select("#node")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom + 60)
            .attr("id", "scatterplotSVG")
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
            .text(this.props.visualizationMethod + "_1");

        // Y axis label:
        svg.append("text")
            .attr("text-anchor", "end")
            .attr("transform", "rotate(-90)")
            .attr("y", -margin.left + 20)
            .attr("x", -margin.top - height/2 + 20)
            .text(this.props.visualizationMethod + "_2")
      
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
                return util.getClusterColor(d)
            })
            .attr("color", (d, i) => {
                return util.getClusterColor(d)
            })
            .on('mouseout', function (d, i) {
                d3.select(this)
                    .transition()
                    .duration(100)
                    .attr('fill', this.getAttribute("color"));
            })
            .on('mouseover', (d) => {
                this.props.pointData(JSON.stringify(d));
            })
        //source:
        //http://jonathansoma.com/tutorials/d3/clicking-and-hovering/
    }

    render() {
        return (
            <div id='graphContainer' className='graphContainer'>
                <div className='graph' id="node"></div>
                <div id="dfSelectContainer" hidden={true}>
                    <div className="gridContainer" id='gridContainer'></div>
                </div>

                <Button
                    variant="contained"
                    style={{backgroundColor: '#000', color: '#FFF'}}
                    onClick={(e) => util.exportSVGAsPNG("scatterplotSVG")}
                >Export Scatterplot (.png)</Button>
            </div>
        )
    }
}

export default Scatterplot;
