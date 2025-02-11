/**
 * Load TopoJSON data of the world and the data of the world wonders
 */

Promise.all([
  d3.json('data/counties-10m.json'),
  d3.csv('data/People.csv'),
  d3.csv('data/Veterans.csv')
]).then(data => {
  const geoData = data[0];
  const peopleData = data[1];
  const veteransData = data[2];

  // Combine both datasets by adding the population density to the TopoJSON file
  console.log(geoData);
  const peopleDataMap = new Map();
  peopleData.forEach(d => {
    if (d.Attribute === "OwnHomePct") {
      peopleDataMap.set(d.FIPS.padStart(5, '0'), +d.Value);
    }
  });

  const veteransDataMap = new Map();
  veteransData.forEach(d => {
    if (d.Attribute === "Vets18OPct") {
      veteransDataMap.set(d.FIPS.padStart(5, '0'), +d.Value);
    }
  });

  geoData.objects.counties.geometries.forEach(d => {
    const fips = d.id.padStart(5, '0');
    d.properties.ownhome = peopleDataMap.get(fips) || 0;
    d.properties.pctVeterans = veteransDataMap.get(fips) || 0;
  });
      
  const choroplethMap = new ChoroplethMap({ 
    parentElement: '.viz',   
  }, geoData);
  const choroplethMap_vets = new ChoroplethMap_vets({ 
    parentElement: '.viz_vets',   
  }, geoData);

})
.catch(error => console.error(error));
