class ChoroplethMap {

  /**
   * Class constructor with basic configuration
   * @param {Object}
   * @param {Array}
   */
  constructor(_config, _data) {
    this.config = {
    parentElement: _config.parentElement,
    containerWidth: window.innerWidth / 2, // Set width to half the screen width
    containerHeight: _config.containerHeight || 500,
    margin: _config.margin || {top: 10, right: 10, bottom: 10, left: 10},
    tooltipPadding: 10
    }
    this.data = _data;
    // this.config = _config;
  
    this.us = _data;
  
    this.active = d3.select(null);
  
    this.initVis();
  }
  
  /**
   * We initialize scales/axes and append static elements, such as axis titles.
   */
  initVis() {
    let vis = this;

    // Calculate inner chart size. Margin specifies the space around the actual chart.
    vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
    vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

    // Define size of SVG drawing area
    vis.svg = d3.select(vis.config.parentElement).append('svg')
        .attr('class', 'center-container')
        .attr('width', vis.config.containerWidth)
        .attr('height', vis.config.containerHeight);

    vis.svg.append('rect')
            .attr('class', 'background center-container')
            .attr('height', vis.config.containerWidth ) //height + margin.top + margin.bottom)
            .attr('width', vis.config.containerHeight) //width + margin.left + margin.right)
            .on('click', vis.clicked);
    
    // Add a title
    vis.svg.append('text')
      .attr('x', vis.width / 2)
      .attr('y', vis.config.margin.top + 40) // Move the text down vertically
      .attr('text-anchor', 'middle')
      .attr('class', 'title')
      .style('font-weight', 'bold') // Make the text bold
      .text('Percentage of Home Ownership in the US');
  
    vis.projection = d3.geoAlbersUsa()
            .translate([vis.width /2 , vis.height / 2])
            .scale(vis.width);

    vis.colorScale = d3.scaleLinear()
            .domain([d3.min(vis.data.objects.counties.geometries, d => d.properties.ownhome), 0, d3.max(vis.data.objects.counties.geometries, d => d.properties.ownhome)])
            .range(["red", "blue"])
            .interpolate(d3.interpolateHcl);

    vis.path = d3.geoPath()
            .projection(vis.projection);

    vis.g = vis.svg.append("g")
            .attr('class', 'center-container center-items us-state')
            .attr('transform', 'translate('+vis.config.margin.left+','+vis.config.margin.top+')')
            .attr('width', vis.width + vis.config.margin.left + vis.config.margin.right)
            .attr('height', vis.height + vis.config.margin.top + vis.config.margin.bottom)


    vis.counties = vis.g.append("g")
                .attr("id", "counties")
                .selectAll("path")
                .data(topojson.feature(vis.us, vis.us.objects.counties).features)
                .enter().append("path")
                .attr("d", vis.path)
                // .attr("class", "county-boundary")
                .attr('fill', d => {
                      if (d.properties.ownhome) {
                        return vis.colorScale(d.properties.ownhome);
                      } else {
                        return 'url(#lightstripe)';
                      }
                    });

      vis.counties
        .on('mousemove', (d, event) => {
          const ownHome = d.properties.ownhome ? `<strong>${d.properties.ownhome.toFixed(2)}</strong>% difference between non-vets and vets poor` : 'No data available'; 
          d3.select('#tooltip')
            .style('display', 'block')
            .style('left', (event.pageX + vis.config.tooltipPadding) + 'px')
            .style('top', (event.pageY + vis.config.tooltipPadding) + 'px')
            .html(`
            <div class="tooltip-title">${d.properties.name}</div>
            <div>${ownHome}</div>
            `);
          })
          .on('mouseleave', () => {
            d3.select('#tooltip').style('display', 'none');
          });



    vis.g.append("path")
                .datum(topojson.mesh(vis.us, vis.us.objects.states, function(a, b) { return a !== b; }))
                .attr("id", "state-borders")
                .attr("d", vis.path);

  }

  
}