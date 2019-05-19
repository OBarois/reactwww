import React, { useState, useEffect, useRef } from "react";
import WorldWind from "webworldwind-esa";


export function useEww({ id, clon, clat, alt, starfield, atmosphere }) {
    //console.log('useEww renders')
  
    const eww = useRef(null)
    const [, setProjection] = useState("3D")
    const [geojsonlayers, setGeojsonlayers] = useState([])

    function toggleAtmosphere() {
        eww.current.layers[3].enabled = !eww.current.layers[3].enabled
        eww.current.redraw();
    }
  //toggle starField
  function toggleStarfield() {
    eww.current.layers[2].enabled = !eww.current.layers[2].enabled
    eww.current.redraw();
  }

  //toggle name overlay
  function toggleNames() {
    eww.current.layers[1].enabled = !eww.current.layers[1].enabled
    eww.current.redraw();
  }

    function addGeojson(url,replace) {
        console.log('replace: '+replace)
        function shapeConfigurationCallback(geometry, properties) {
            let configuration = {};
    
            let placemarkAttributes = new WorldWind.PlacemarkAttributes(null);
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
                configuration.attributes.interiorColor = new WorldWind.Color(1, 0, 0, 0.2);
                configuration.attributes.outlineColor = new WorldWind.Color(1, 0, 0, 0.3);
            }
    
            //console.log(configuration.attributes);
            return configuration;
        }

        
        function loadCompleteCallback() {
            console.log('geojsonlayers state updated')
            // setGeojsonlayers((geojsonlayers)=>[...geojsonlayers,renderableLayer])
            eww.current.redraw();
        }
    
    
        let renderableLayer = new WorldWind.RenderableLayer(url.properties.updated+Math.ceil(Math.random() * 10000))
        // if (replace) removeGeoJson()
        eww.current.addLayer(renderableLayer);
        // setGeojsonlayers((geojsonlayers)=>[...geojsonlayers,renderableLayer])
        setGeojsonlayers((geojsonlayers)=>[...geojsonlayers,renderableLayer])
        // setGeojsonlayers(eww.current.layers)
        let geoJson = new WorldWind.GeoJSONParser(url);
        geoJson.load(loadCompleteCallback, shapeConfigurationCallback, renderableLayer);
        // setGeojsonlayers((geojsonlayers)=>[...geojsonlayers,renderableLayer])        
    }

    function removeGeojson() {
        console.log('will remove json layers ')
        console.log(geojsonlayers)
        for(let i=0;i<geojsonlayers.length;i++) {
          eww.current.removeLayer(geojsonlayers[i])
          console.log('removing json layers: ')
          console.log(geojsonlayers[i])
        }
        setGeojsonlayers([])
        console.log(geojsonlayers)
        eww.current.redraw();
      }


    function setTime(epoch) {
        eww.current.layers[2].time = eww.current.layers[3].time = new Date(epoch)
        eww.current.redraw();
        

     }

    function toggleProjection() {
        setProjection( prevProj => {
          console.log("prevProjection: "+prevProj)
          let supportedProjections = [ "3D", "Equirectangular", "Mercator"];
          let newProj = (supportedProjections.indexOf(prevProj) + 1)%supportedProjections.length
          console.log("newProjection: "+supportedProjections[newProj])
          switch (supportedProjections[newProj]) {
            case "3D":
                eww.current.globe.projection = new WorldWind.ProjectionWgs84();
                break;
            case "Equirectangular":
                eww.current.globe.projection = new WorldWind.ProjectionEquirectangular();
                break;
            case "Mercator":
                eww.current.globe.projection = new WorldWind.ProjectionMercator();
                break;
            case "North Polar":
                eww.current.globe.projection = new WorldWind.ProjectionPolarEquidistant("North");
                break;
            case "South Polar":
                eww.current.globe.projection = new WorldWind.ProjectionPolarEquidistant("South");
                break;
            default:
            eww.current.globe.projection = new WorldWind.ProjectionWgs84();
            }
          eww.current.redraw();
          return supportedProjections[newProj]
          })      
      }
    

    
    let globeStyle = {
        background: 'inherit',
        position: "fixed",
        width: 'inherit',
        height: 'inherit'
      };
    
    let canvas = <canvas id={id} style={globeStyle} />
    // didMount effect
    useEffect(() => {
        console.log("useEffect (mount) in Eww  star/atmo: "+ starfield+'/'+atmosphere)
        //eww.current = new WorldWind.WorldWindow(id, elevationModel);
        eww.current = new WorldWind.WorldWindow(id);
        //setWwd(eww);
        let wmsConfigBg = {
            service: "https://tiles.maps.eox.at/wms",
            layerNames: "s2cloudless-2018",
            numLevels: 19,
            format: "image/png",
            size: 256,
            sector: WorldWind.Sector.FULL_SPHERE,
            levelZeroDelta: new WorldWind.Location(90, 90)
        }
    
        let wmsConfigNames = {
            service: "https://tiles.maps.eox.at/wms",
            layerNames: "overlay_bright",
            numLevels: 19,
            format: "image/png",
            size: 256,
            sector: WorldWind.Sector.FULL_SPHERE,
            levelZeroDelta: new WorldWind.Location(90, 90)
        }
        WorldWind.configuration.baseUrl = WorldWind.configuration.baseUrl.slice(0,-3)
        let starFieldLayer = new WorldWind.StarFieldLayer();
        let atmosphereLayer = new WorldWind.AtmosphereLayer('images/BlackMarble_2016_01deg.jpg');
        atmosphereLayer.minActiveAltitude = 5000000
    
        let layers = [
            { layer: new WorldWind.WmsLayer(wmsConfigBg, ""), enabled: true },
            { layer: new WorldWind.WmsLayer(wmsConfigNames, ""), enabled: false },
            { layer: starFieldLayer, enabled: starfield },
            { layer: atmosphereLayer, enabled: atmosphere }
        ];
    
        for (let l = 0; l < layers.length; l++) {
            layers[l].layer.enabled = layers[l].enabled;
            eww.current.addLayer(layers[l].layer);
        }
        //let date = new Date();
        starFieldLayer.time = new Date();
        atmosphereLayer.time = new Date();
        setTimeout(() => {
            eww.current.goToAnimator.travelTime = 1000;
            eww.current.goTo(new WorldWind.Position(clat, clon, alt));
            eww.current.redraw();
            }, 2000)
    
        eww.current.redraw();
        eww.current.deepPicking = true;
    }, []); // effect runs only once
        

  
  return { canvas, removeGeojson, addGeojson, toggleStarfield, toggleAtmosphere, setTime, toggleProjection, toggleNames };
}
