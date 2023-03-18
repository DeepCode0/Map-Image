var map = new ol.Map({
  target: 'left',
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM()
    })
  ],
  view: new ol.View({
    center: ol.proj.fromLonLat([10.93376479, 50.98380407]), // New York City coordinates
    zoom: 18
  })
});
// Load coordinates from text file using XMLHttpRequest
var xhr = new XMLHttpRequest();
xhr.open('GET', 'coordinates.txt', true);
xhr.onload = function () {
  if (xhr.readyState === xhr.DONE && xhr.status === 200) {
    var lines = xhr.responseText.split('\n');
    var features = [];
    // Loop through lines of text file and create markers on the map
    for (var i = 1; i < lines.length; i++) {
      var cols = lines[i].split(' ');
      if(cols.length!=8)
      continue;
      var lon = parseFloat(cols[2]);
      var lat = parseFloat(cols[3]);
      var coord = ol.proj.fromLonLat([lon, lat]);
      var marker = new ol.Feature({
        geometry: new ol.geom.Point(coord),
        name: cols[0]
      });
      features.push(marker);
    }
    // console.log(features)
    // Add markers to layer and display on map
    var vectorLayer = new ol.layer.Vector({
      source: new ol.source.Vector({
        features: features
      })
    });
    map.addLayer(vectorLayer);
    // Add click event listener to each marker on the map
    var viewer = new PANOLENS.Viewer({
        container: document.querySelector('#right')
      });
      var name = "./HMTpano_000001_000000.jpg/";
      name = name.substring(1,name.length-1)
      var panorama = new PANOLENS.ImagePanorama(name);
      viewer.add(panorama)
    map.on('click', function (evt) {
      var feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
        return feature;
      });
      if (feature) {
        var name = feature.get('name');
        name = name.substring(1,name.length-1)
        // Load corresponding 360 image using panolens.js and display on right side
        viewer.dispose()
        var panorama = new PANOLENS.ImagePanorama(name);
        viewer.add(panorama)
      }
    });
  }
};
xhr.send(null);