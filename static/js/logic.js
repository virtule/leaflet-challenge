let myMap = L.map("map", {
    center: [0, 0],
    zoom: 3
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);

let geoData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson";

let colorScale = chroma.scale(['#90EE90', '#8B0000']).domain([4, 630]);

d3.json(geoData).then(function(data) {

    let magnitude = null
    let lat = null
    let long = null 
    let depth = null
    let place = null

    for (i=0; i< data["features"].length; i++) {
        lat = data["features"][i]["geometry"]["coordinates"][1]
        long = data["features"][i]["geometry"]["coordinates"][0]
        depth = data["features"][i]["geometry"]["coordinates"][2]
        magnitude = data["features"][i]["properties"]["mag"]
        place = data["features"][i]["properties"]["place"]

        //Make size for circle based on magnitude
        size = Math.pow(magnitude, 7)
        // Assign colors based on depth
        let color = colorScale(depth).hex();

        //Create the marker
        L.circle([lat, long], {
            color : color,
            fillColor: color,
            fillOpacity: 0.75,
            radius: size
        }).bindPopup(`<h1> ${place} <h1> <hr> <h3>Magnitude: ${magnitude} <br> Depth: ${depth}km`).addTo(myMap)
    }

    let depthValues = [4, 80, 190, 300, 410, 520, 630]; 
    let colors = depthValues.map(depth => colorScale(depth).hex()); 
    let labels = depthValues.map((depth, index) => {
    return `<li style="background-color:  ${colors[index]}"> <b> ${depth} km <b></li>`;
});

let legend = L.control({ position: "bottomright" });
legend.onAdd = function() {
    let div = L.DomUtil.create("div", "info legend");
    let legendInfo = "<h2>Depth Legend</h2>";
    legendInfo += "<ul>" + labels.join("") + "</ul>";
    div.innerHTML = legendInfo;
    return div;
};

legend.addTo(myMap);
  
});