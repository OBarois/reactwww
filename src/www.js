import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import WorldWind from "webworldwind-esa";
//import { useClock } from "./useClock";
import { useGlobal } from 'reactn';
import { useHotkeys } from 'react-hotkeys-hook';


export default function Map(props) {
  //const [wwd, setWwd] = useState([]);
  //const [date, setDate] = useState(0);
  const [date, setAppdate ] = useGlobal('appdate')
  const wwd = useRef(null)
  
  
  // toogle projection
  useHotkeys("p",toggleProjection)  
  const [projection, setProjection] = useState("3D")
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
    wwd.current.layers[1].enabled = !wwd.current.layers[1].enabled
  }

  useEffect(() => {
    console.log("Init Globe")
    var elevationModel = new WorldWind.EarthElevationModel();
    wwd.current = new WorldWind.WorldWindow(props.id, elevationModel);
    //setWwd(wwd);
    var wmsConfig = {
      service: "https://tiles.maps.eox.at/wms",
      layerNames: "s2cloudless-2018",
      numLevels: 19,
      format: "image/png",
      size: 256,
      sector: WorldWind.Sector.FULL_SPHERE,
      levelZeroDelta: new WorldWind.Location(90, 90)
    };

    var starFieldLayer = new WorldWind.StarFieldLayer();
    var atmosphereLayer = new WorldWind.AtmosphereLayer("atmosphere");

    var layers = [
      { layer: new WorldWind.WmsLayer(wmsConfig, ""), enabled: true },
      { layer: starFieldLayer, enabled: true },
      { layer: atmosphereLayer, enabled: true }
    ];

    for (var l = 0; l < layers.length; l++) {
      layers[l].layer.enabled = layers[l].enabled;
      wwd.current.addLayer(layers[l].layer);
    }
    //var date = new Date();
    starFieldLayer.time = new Date(date);
    atmosphereLayer.time = new Date(date);
    wwd.current.redraw();
  }, []); // effect runs only once

  useEffect(() => {
    wwd.current.layers[1].time = wwd.current.layers[2].time = new Date(date)
    wwd.current.redraw();
  },[date]);



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
