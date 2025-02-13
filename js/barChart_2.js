class BarChart_2 {
    constructor(_config, _data) {
        this.config = {
            parentElement: _config.parentElement,
            containerWidth: window.innerWidth / 2, // Set width to half the screen width
            containerHeight: _config.containerHeight || 500,
            margin: _config.margin || {top: 30, right: 30, bottom: 40, left: 30},
            tooltipPadding: 10,
            legendBottom: 50,
            legendLeft: 50,
            legendRectHeight: 12, 
            legendRectWidth: 150
        };

        this.data = _data;
        this.us = _data;
        this.active = d3.select(null);

        this.initVis();
    }
    
    initVis() {
        let vis = this;
        
        vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
        vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;
        
        // Create SVG container inside the specified parent element
        vis.svg = d3.select(vis.config.parentElement)
            .append('svg')
            .attr('width', vis.config.containerWidth)
            .attr('height', vis.config.containerHeight)
            .append("g") // Append a group element to adjust for margins
            .attr("transform", `translate(${vis.config.margin.left},${vis.config.margin.top})`);
        
        const pctNonVetsPoor = vis.data.filter(d => d.FIPS === "0" && d.Attribute === "PctNonVetsPoor")[0]?.Value || 0;
        const pctVetsPoor = vis.data.filter(d => d.FIPS === "0" && d.Attribute === "PctVetsPoor")[0]?.Value || 0;
        const percentNonVetsDis = vis.data.filter(d => d.FIPS === "0" && d.Attribute === "PctNonVetsDisabilty")[0]?.Value || 0;
        const percentVetsDis = vis.data.filter(d => d.FIPS === "0" && d.Attribute === "PctVetsDisabilty")[0]?.Value || 0;
        // Sample data
        const data = [
            // {name: "Poor Vets", value: nationalNonPoorVets},
            // {name: "Total Vets", value: totalVets},
            {name: "Percent Vets Poor", value: pctVetsPoor, color: "blue"},
            {name: "Percent Non-Vets Poor", value: pctNonVetsPoor, color: "red"},
            {name: "Percent Vets Disabled", value: percentVetsDis, color:"blue"},
            {name: "Percent Non-Vets Disabled", value: percentNonVetsDis, color:"red"}
            
            // {name: "G", value: 55},
        ];
        
        // X axis
        const x = d3.scaleBand()
            .range([0, vis.width])
            .domain(data.map(d => d.name))
            .padding(0.4);
        
        vis.svg.append("g")
            .attr("transform", `translate(0,${vis.height})`)
            .call(d3.axisBottom(x));

        // Y axis
        const y = d3.scaleLinear()
            .domain([0, 100])
            .range([vis.height, 0]);
        
        vis.svg.append("g")
            .call(d3.axisLeft(y));
        
        // Bars
        vis.svg.selectAll(".bar")
            .data(data)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", d => x(d.name))
            .attr("y", d => y(d.value))
            .attr("width", x.bandwidth())
            .attr("height", d => vis.height - y(d.value))
            .attr("fill", d => d.color);

            
    }
}
