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


    //This method is responsible for formatting the JSON data we received into a format such that each object is "complete"
    //Complete = every object in the resulting array will hold all of the information for a single datapoint
    reformatJSON(){
                //Begin data reformatting
                var data = this.convertToJson(this.props.data)

                //Put every object into an array
                let objArray = []
                for(var obj in data){
                    console.log(obj)
                    let currentObject = data[obj]
                    objArray.push(currentObject)
                }
        
        
                let completeObjects = []
                console.log(objArray)
        
                //Figure out the number of keys within each object
                var numKeys = Object.keys(objArray[0]).length
                console.log(numKeys)
        
        
                //Loop through the new list of objects to create "complete" objects
                for(var i = 0; i < numKeys; i++){
                    let tempObj = {}
                    for(var obj in objArray){
                        let label = Object.keys(data)[obj]
                        var currentObject = objArray[obj]
                        var currentKey = Object.keys(currentObject)[i]
                        tempObj[label] = currentObject[currentKey]
                    }
                    completeObjects.push(tempObj)
                }
        
                return completeObjects
    }

    drawChart() {
        let data = this.reformatJSON()

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

    }

    render() {
        return <div id="node"></div>
    }
}

export default Scatterplot;