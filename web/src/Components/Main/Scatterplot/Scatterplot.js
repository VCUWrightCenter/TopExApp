import React, { Component } from 'react';
import * as d3 from "d3";

class Scatterplot extends Component {

    constructor(props) {
        super(props);
    }


    componentDidUpdate() {
        this.drawChart();
    }

    convertToJson(jsonString) {
        try {
            return JSON.parse(jsonString)
        } catch (error) {
            console.log(error)
        }
    }

    drawChart() {
        var margin = { top: 10, right: 30, bottom: 30, left: 60 },
            width = 800 ,
            height = 800;

        // append the svg object to the body of the page
        var svg = d3.select("#node")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");


        var data = this.convertToJson(this.props.data)
        console.log(data)

        //var dataArray = Object.keys(data).map((key, index) => data[key])

        // console.log(Object.keys(testData[testKeys0[0]]))

        let objArray = []

        for(var obj in data){
            console.log(obj)
            let currentObject = data[obj]
            objArray.push(currentObject)
        }


        let completeObjects = []
        console.log(objArray)
        var numKeys = Object.keys(objArray[0]).length
        console.log(numKeys)


        for(var i = 0; i < numKeys; i++){
            let tempObj = {}
            for(var obj in objArray){
                let label = Object.keys(data)[obj]
                var currentObject = objArray[obj]
                var currentKey = Object.keys(currentObject)[i]
                tempObj[label] = currentObject[currentKey]
                //console.log(tempObj)
            }
            completeObjects.push(tempObj)
        }

        console.log(completeObjects)

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
            .data(completeObjects)
            .enter()
            .append("circle")
            .attr("cx", function (d) { return x(d.x) })
            .attr("cy", function (d) { return y(d.y) })
            .attr("r", 3)

    }

    render() {
        return <div id="node"></div>
    }
}

export default Scatterplot;