var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var charts = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)
    .attr("class", "chart");

//import data
d3.csv("assets/data/data.csv").then(function (data) {
    console.log(data);
    data.forEach(function (data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
    });

    var xScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.poverty)])
        .range([0, width]);

    var yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.healthcare)])
        .range([height, 0]);
    
    var bottomAxis = d3.axisBottom(xScale);
    var leftAxis = d3.axisLeft(yScale);
   
    charts.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    charts.append("g")
        .call(leftAxis);
    
    charts.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr("class", "axisText")
        .text("In Poverty (%)");


    charts.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Lacks Healthcare(%)");


    // Create circles
    var circles = charts.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d.poverty))
        .attr("cy", d => yScale(d.healthcare))
        .attr("r", "15")
        .attr("class", "stateCircle");

    //Create text
    var text = charts.append("g")
        .attr("class", "stateText")
        .selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .attr("x", d => xScale(d.poverty) - 0.5)
        .attr("y", d => yScale(d.healthcare) + 5)
        .html(function (d) {
            return (`${d.abbr}`)
        });
    // Tool tip
    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([80, -60])
        .html(function (d) {
            return (`${d.state}<br>Poverty: ${d.poverty}%<br>Healthcare: ${d.healthcare}%`);
        });
    charts.call(toolTip);

    // Event listeners 

    text.on("mouseover", function (data) {
        toolTip.show(data, this);
    })
        
        .on("mouseout", function (data, index) {
            toolTip.hide(data);
        });





})
