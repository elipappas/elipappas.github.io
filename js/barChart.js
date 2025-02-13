class BarChart {
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
        
        const nationalVetsIncome = vis.data.filter(d => d.FIPS === "0" && d.Attribute === "MedianVetsInc")[0]?.Value || 0;
        const nationalNonVetsIncome = vis.data.filter(d => d.FIPS === "0" && d.Attribute === "MedianNonVetsInc")[0]?.Value || 0;

        // data
        const data = [
            // {name: "Poor Vets", value: nationalNonPoorVets},
            // {name: "Total Vets", value: totalVets},
            {name: "Median Vet Income", value: nationalVetsIncome, color: "blue"},
            {name: "Median Non-Vet Income", value: nationalNonVetsIncome, color: "red"},
            // {name: "E", value: 20},
            // {name: "F", value: 90},
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
            .domain([0, d3.max(data, d => d.value)])
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
