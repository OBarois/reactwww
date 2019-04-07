import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import WorldWind from "webworldwind-esa";
//import { useClock } from "./useClock";
import { useGlobal } from 'reactn';


export default function Map(props) {
  //const [wwd, setWwd] = useState([]);
  //const [date, setDate] = useState(0);
  const [date, setAppdate ] = useGlobal('appdate');
  const wwd = useRef(null)
  

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

    //var starFieldLayer = new WorldWind.StarFieldLayer();
    var atmosphereLayer = new WorldWind.AtmosphereLayer();

    var layers = [
      { layer: new WorldWind.WmsLayer(wmsConfig, ""), enabled: true },
    //  { layer: starFieldLayer, enabled: true },
      { layer: atmosphereLayer, enabled: true }
    ];

    for (var l = 0; l < layers.length; l++) {
      layers[l].layer.enabled = layers[l].enabled;
      wwd.current.addLayer(layers[l].layer);
    }
    //var date = new Date();
    //starFieldLayer.time = date;
    atmosphereLayer.time = new Date(date);
    wwd.current.redraw();
  }, []); // effect runs only once

  useEffect(() => {
    wwd.current.layers[1].time = new Date(date)
    wwd.current.redraw();
  },[date]);


  var globeStyle = {
    background:  "linear-gradient(rgb(67, 124, 199), #111) repeat scroll 0 0 #222",
    width: props.width,
    height: props.height,
    position: "fixed",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
  };

  return (
    <div>
      <canvas id={props.id} style={globeStyle} />
    </div>
  );
}
