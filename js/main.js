Promise.all([
  d3.json('data/counties-10m.json'),
  d3.csv('data/People.csv'),
  d3.csv('data/Veterans.csv')
]).then(data => {
  const geoData = data[0];
  const peopleData = data[1];
  const veteransData = data[2];

  // Convert population values to numbers
  peopleData.forEach(d => {
    d.Value = +d.Value; // Ensure numeric data
  });

  // Map data by FIPS codes
  const peopleDataMap = new Map();
  peopleData.forEach(d => {
    if (d.Attribute === "OwnHomePct") {
      peopleDataMap.set(d.FIPS.padStart(5, '0'), d.Value);
    }
  });

  const veteransDataMap = new Map();
  veteransData.forEach(d => {
    if (d.Attribute === "Vets18OPct") {
      veteransDataMap.set(d.FIPS.padStart(5, '0'), +d.Value);
    }
  });

  const pctNonVetsPoorMap = new Map();
  veteransData.forEach(d => {
    if (d.Attribute === "PctNonVetsPoor") {
      pctNonVetsPoorMap.set(d.FIPS.padStart(5, '0'), +d.Value);
    }
  });

  const pctVetsPoorMap = new Map();
  veteransData.forEach(d => {
    if (d.Attribute === "PctVetsPoor") {
      pctVetsPoorMap.set(d.FIPS.padStart(5, '0'), +d.Value);
    }
  });

  // Add properties to geoData
  geoData.objects.counties.geometries.forEach(d => {
    const fips = d.id.padStart(5, '0');
    d.properties.ownhome = peopleDataMap.get(fips) || 0;
    d.properties.pctVeterans = veteransDataMap.get(fips) || 0;
    d.properties.ownhome = pctNonVetsPoorMap.get(fips) - pctVetsPoorMap.get(fips) || 0;
  });

  // Initialize visualizations
  const choroplethMap = new ChoroplethMap({ 
    parentElement: '.viz',   
  }, geoData);

  const choroplethMap_vets = new ChoroplethMap_vets({ 
    parentElement: '.viz-vets',   
  }, geoData);

  const barChart = new BarChart({
    parentElement: '#bar-chart-container',
    containerHeight: 500,
    margin: {top: 20, right: 30, bottom: 40, left: 50}
  }, veteransData);

  const barChart_2 = new BarChart_2({
    parentElement: '#bar-chart-2-container',
    containerHeight: 500,
    margin: {top: 20, right: 30, bottom: 40, left: 50}
  }, veteransData);

})
.catch(error => console.error(error));
