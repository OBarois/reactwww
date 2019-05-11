import React, { useState, useEffect, useRef } from "react";
import WorldWind from "webworldwind-esa";
//import { useClock } from "./useClock";
import { useGlobal } from 'reactn';
import { useHotkeys } from 'react-hotkeys-hook';
import useDatahub from "./useDatahub";



export default function Map(props) {
  //const [wwd, setWwd] = useState([]);
  //const [date, setDate] = useState(0);


  const wwd = useRef(null)
  
  
  // toogle projection
  useHotkeys("p",toggleProjection)  
  const [, setProjection] = useState("3D")

  // remove geojson layers
  useHotkeys("c",removeGeoJson)  
  const [geojsonlayers, setGeojsonlayers] = useState([])
  useEffect(() => {
    console.log('geojson changed')
    console.log(geojsonlayers)
  },[geojsonlayers]);



  function toggleProjection() {
    setProjection( prevProj => {
      console.log("prevProjection: "+prevProj)
      let supportedProjections = [ "3D", "Equirectangular", "Mercator"];
      let newProj = (supportedProjections.indexOf(prevProj) + 1)%supportedProjections.length
      console.log("newProjection: "+supportedProjections[newProj])
      switch (supportedProjections[newProj]) {
        case "3D":
            wwd.current.globe.projection = new WorldWind.ProjectionWgs84();
            break;
        case "Equirectangular":
            wwd.current.globe.projection = new WorldWind.ProjectionEquirectangular();
            break;
        case "Mercator":
            wwd.current.globe.projection = new WorldWind.ProjectionMercator();
            break;
        case "North Polar":
            wwd.current.globe.projection = new WorldWind.ProjectionPolarEquidistant("North");
            break;
        case "South Polar":
            wwd.current.globe.projection = new WorldWind.ProjectionPolarEquidistant("South");
            break;
        default:
        wwd.current.globe.projection = new WorldWind.ProjectionWgs84();
        }
      wwd.current.redraw();
      return supportedProjections[newProj]
      })      
  }
  
  //toggle atmosphere
  useHotkeys("a",toggleAtmosphere)  
  function toggleAtmosphere() {
    wwd.current.layers[3].enabled = !wwd.current.layers[3].enabled
    wwd.current.redraw();
  }
  //toggle starField
  useHotkeys("s",toggleStarField)  
  function toggleStarField() {
    wwd.current.layers[2].enabled = !wwd.current.layers[2].enabled
    wwd.current.redraw();
  }

<<<<<<< HEAD
  //toggle names
  useHotkeys("n",togglePlaceNames)  
  function togglePlaceNames() {
=======
  //toggle starField
  useHotkeys("n",toggleNames)  
  function toggleNames() {
>>>>>>> 72b06e915026d9e8897770a9b9c3ce5a2fa11f88
    wwd.current.layers[1].enabled = !wwd.current.layers[1].enabled
    wwd.current.redraw();
  }

  function addGeoJson(url) {
    function shapeConfigurationCallback(geometry, properties) {
        var configuration = {};

        var placemarkAttributes = new WorldWind.PlacemarkAttributes(null);
        placemarkAttributes.imageScale = 10;
        placemarkAttributes.imageColor = new WorldWind.Color(0, 1, 1, 0.2);
        placemarkAttributes.labelAttributes.offset = new WorldWind.Offset(
            WorldWind.OFFSET_FRACTION, 5,
            WorldWind.OFFSET_FRACTION, 5);
        //placemarkAttributes.imageSource = whiteDot;


        if (geometry.isPointType() || geometry.isMultiPointType()) {
            configuration.attributes = new WorldWind.PlacemarkAttributes(placemarkAttributes);
            
        } else if (geometry.isLineStringType() || geometry.isMultiLineStringType()) {
            configuration.attributes.drawOutline = true;
            configuration.attributes.outlineColor = new WorldWind.Color(
              0.1 * configuration.attributes.interiorColor.red,
              0.3 * configuration.attributes.interiorColor.green,
              0.7 * configuration.attributes.interiorColor.blue,
              1
            );
            configuration.attributes.outlineWidth = 1;
        } else if (geometry.isPolygonType() || geometry.isMultiPolygonType()) {
            configuration.attributes = new WorldWind.ShapeAttributes(null);
            configuration.attributes.interiorColor = new WorldWind.Color(0, 1, 1, 0.2);
            configuration.attributes.outlineColor = new WorldWind.Color(1, 1, 1, 1);
        }

        //console.log(configuration.attributes);
        return configuration;
    }

    function loadCompleteCallback() {
        wwd.current.redraw();
    }


    let renderableLayer = new WorldWind.RenderableLayer("GeoJSON_"+(new Date()))
    removeGeoJson()
    wwd.current.addLayer(renderableLayer);
    setGeojsonlayers((geojsonlayers)=>[...geojsonlayers,renderableLayer])
    let geoJson = new WorldWind.GeoJSONParser(url);
    geoJson.load(loadCompleteCallback, shapeConfigurationCallback, renderableLayer);
}

  function removeGeoJson() {
    console.log('removing json layers ')

    for(let i=0;i<geojsonlayers.length;i++) {
      wwd.current.removeLayer(geojsonlayers[i])
      console.log(geojsonlayers[i])
    }
    setGeojsonlayers([])
    wwd.current.redraw();
  }

  useEffect(() => {
    console.log("useEffect (mount) in Map")
    var elevationModel = new WorldWind.EarthElevationModel();
    wwd.current = new WorldWind.WorldWindow(props.id, elevationModel);
    //setWwd(wwd);
<<<<<<< HEAD
    var wmsConfig1 = {
=======
    var wmsConfigBg = {
>>>>>>> 72b06e915026d9e8897770a9b9c3ce5a2fa11f88
      service: "https://tiles.maps.eox.at/wms",
      layerNames: "s2cloudless-2018",
      numLevels: 19,
      format: "image/png",
      size: 256,
      sector: WorldWind.Sector.FULL_SPHERE,
      levelZeroDelta: new WorldWind.Location(90, 90)
    }
    var wmsConfig2 = {
      service: "https://tiles.maps.eox.at/wms",
      layerNames: "overlay",
      numLevels: 19,
      format: "image/png",
      size: 256,
      sector: WorldWind.Sector.FULL_SPHERE,
      levelZeroDelta: new WorldWind.Location(90, 90)
    }

    var wmsConfigNames = {
      service: "https://tiles.maps.eox.at/wms",
      layerNames: "overlay_bright",
      numLevels: 19,
      format: "image/png",
      size: 256,
      sector: WorldWind.Sector.FULL_SPHERE,
      levelZeroDelta: new WorldWind.Location(90, 90)
    }

    var starFieldLayer = new WorldWind.StarFieldLayer();
    var atmosphereLayer = new WorldWind.AtmosphereLayer();

    var layers = [
<<<<<<< HEAD
      { layer: new WorldWind.WmsLayer(wmsConfig1, ""), enabled: true },
      { layer: new WorldWind.WmsLayer(wmsConfig2, ""), enabled: true },
=======
      { layer: new WorldWind.WmsLayer(wmsConfigBg, ""), enabled: true },
      { layer: new WorldWind.WmsLayer(wmsConfigNames, ""), enabled: false },
>>>>>>> 72b06e915026d9e8897770a9b9c3ce5a2fa11f88
      { layer: starFieldLayer, enabled: props.starfield },
      { layer: atmosphereLayer, enabled: true }
    ];

    for (var l = 0; l < layers.length; l++) {
      layers[l].layer.enabled = layers[l].enabled;
      wwd.current.addLayer(layers[l].layer);
    }
    //var date = new Date();
    starFieldLayer.time = new Date(appdate);
    atmosphereLayer.time = new Date(appdate);
    wwd.current.redraw();
  }, []); // effect runs only once

  // The Map component reacts to changes of the global state 'appdate' (in ms since Epoch)
  const [appdate, setAppdate ] = useGlobal('appdate')
  useEffect(() => {
    //console.log("useEffect (appdate) in Map")
    wwd.current.layers[2].time = wwd.current.layers[3].time = new Date(appdate)
    wwd.current.redraw();
  },[appdate]);

  // The Map component reacts to changes of geoJson data provided by the Copernicus Sentinel data hub
  const { data, loading } = useDatahub();
  useEffect(() => {
    console.log('datahub in use')
    if(!loading) {
      console.log(data)
      addGeoJson(data)
    }
  },[data,loading]);


  var globeStyle = {
    //background:  "linear-gradient(rgb(67, 124, 199), #111) repeat scroll 0 0 #222",
    background: 'inherit',
    position: "fixed",
    //width: props.width,
    //height: props.height
    width: 'inherit',
    height: 'inherit'
  };

  return (
      <canvas id={props.id} style={globeStyle} />
  );
}
