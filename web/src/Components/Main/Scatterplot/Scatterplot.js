import React, { Component } from 'react';
import * as d3 from "d3";
import './Scatterplot.css'
import * as util from '../graphUtil.js' 

class Scatterplot extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataframe_identifier: 0,
            completeObjectsArray: null,
            pre_process_data: null
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
            console.log("No scatterplot data")
            console.log(this.state.completeObjectsArray)
        }
    }


    drawChart(dataFrameNumber) {

        //console.log(this.convertToJson(this.props.data))

        let dataArray = util.reformatJSON(this)
        //console.log("This is the reformatted json that should contains the data for all 3 of the datafrmaes")
        //console.log(dataArray)
        let data = dataArray[dataFrameNumber]

        let xArr = data.map((obj) => obj.x)
        let yArr = data.map((obj) => obj.y)
        console.log("xarr", xArr)


        let xMin = Math.min(...xArr) < 0 ? Math.min(...xArr) * 1.2 : Math.min(...xArr) * 0.8
        let yMin = Math.min(...yArr) < 0 ? Math.min(...yArr) * 1.2 : Math.min(...yArr) * 0.8
        let xMax = Math.max(...xArr) > 0 ? Math.max(...xArr) * 1.2 : Math.max(...xArr) * 0.8
        let yMax = Math.max(...yArr) > 0 ? Math.max(...yArr) * 1.2 : Math.max(...yArr) * 0.8

        console.log('xmin, xmax', xMin, xMax)
        console.log('ymin, ymax', yMin, yMax)



        //console.log("This is the data in drawChart that is used in d3")
        //console.log(data)


        var margin = { top: 10, right: 30, bottom: 30, left: 60 },
            width = 600,
            height = 600;
        d3.select("svg").remove();
        // append the svg object to the body of the page
        var svg = d3.select("#node")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .attr("id", "scatterplotSVG")
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

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

        //Add dots
        svg.append('g')
            .selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", function (d) { return x(d.x) }) //Plotting x value
            .attr("cy", function (d) { return y(d.y) }) //Plotting y value
            .attr("test", "here")
            .attr("r", 3)
            .on('mouseover', function (d, i) {
                //console.log("mouseover on", this);
                d3.select(this)
                    .transition()
                    .duration(100)
                    //   .attr('r', 10)
                    .attr('fill', 'gold');
            })
            .on('mouseout', function (d, i) {
                //console.log("mouseout", this);
                d3.select(this)
                    .transition()
                    .duration(100)
                    //.attr('r', 3)
                    .attr('fill', 'black');
            })
            .on('click', (d, i) => {
                console.log("clicked", d)
                this.sendPointData(JSON.stringify(d))
            })


        //source: 
        //http://jonathansoma.com/tutorials/d3/clicking-and-hovering/ 

        document.getElementById('dfSelectContainer').hidden = false

    }


    render() {
        return (
            <React.Fragment>
                <div className='graph' id="node"></div>
                <div id="dfSelectContainer" hidden='true'>
                    <div className="gridContainer">
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
                <div>
                    <button onClick={(e) => util.exportSVGAsPNG(this)}>Export graph as png</button>
                    <button onClick={() => util.exportDataForGraph(this)}>Export Graph Data</button>
                </div>

            </React.Fragment>
        )
    }
}

export default Scatterplot;