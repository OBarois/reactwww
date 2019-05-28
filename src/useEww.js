import React, { useState, useEffect, useRef } from "react";
import WorldWind from "webworldwind-esa";


// BasicWorldWindowController.prototype.applyLimits = function () {
//     var navigator = this.wwd.navigator;

//     // Clamp latitude to between -90 and +90, and normalize longitude to between -180 and +180.
//     navigator.lookAtLocation.latitude = WWMath.clamp(navigator.lookAtLocation.latitude, -90, 90);
//     navigator.lookAtLocation.longitude = Angle.normalizedDegreesLongitude(navigator.lookAtLocation.longitude);

//     // Clamp range to values greater than 1 in order to prevent degenerating to a first-person navigator when
//     // range is zero.
//     navigator.range = WWMath.clamp(navigator.range, 1, Number.MAX_VALUE);

//     // Normalize heading to between -180 and +180.
//     navigator.heading = Angle.normalizedDegrees(navigator.heading);

//     // Clamp tilt to between 0 and +90 to prevent the viewer from going upside down.
//     navigator.tilt = WWMath.clamp(navigator.tilt, 0, 90);

//     // Normalize heading to between -180 and +180.
//     navigator.roll = Angle.normalizedDegrees(navigator.roll);

//     // Apply 2D limits when the globe is 2D.
//     if (this.wwd.globe.is2D() && navigator.enable2DLimits) {
//         // Clamp range to prevent more than 360 degrees of visible longitude. Assumes a 45 degree horizontal
//         // field of view.
//         var maxRange = 2  Math.PI  this.wwd.globe.equatorialRadius;
//         navigator.range = WWMath.clamp(navigator.range, 1, maxRange);

//         // Force tilt to 0 when in 2D mode to keep the viewer looking straight down.
//         navigator.tilt = 0;
//     }
// };

export function useEww({ id, clon, clat, alt, starfield, atmosphere, names }) {
    //console.log('useEww renders')
    
  
    const eww = useRef(null)
    const [projection, setProjection] = useState("3D")
    // const [aoi, setAoi] = useState({type: null, value: null})
    const [aoi, setAoi] = useState('')
    const [geojsonlayers, setGeojsonlayers] = useState([])
    const [ewwstate, setEwwState] = useState({latitude: clat, longitude: clon, altitude: alt, aoi:''})

    //toggle atmosphere
    function toggleAtmosphere() {
        console.log('toggleAtmosphere')
        eww.current.layers[3].enabled = !eww.current.layers[3].enabled
        eww.current.redraw();
    }

    //toggle starField
    function toggleStarfield() {
        console.log('toggleStarfield')
        eww.current.layers[2].enabled = !eww.current.layers[2].enabled
        eww.current.redraw();
    }

    //toggle name overlay
    function toggleNames() {
        console.log('toggleNames')
        eww.current.layers[1].enabled = !eww.current.layers[1].enabled
        eww.current.redraw();
    }

    function  getViewPolygon () {
        let view = eww.current.viewport
        let area = {}
        let polygon = ''
        // console.log('view: ' + view.x + '/' + view.y + '/' + view.width + '/' + view.height);

        let bl ;
        try { 
            bl =  eww.current.pickTerrain(eww.current.canvasCoordinates(view.x, view.y + view.height)).terrainObject().position
            bl.latitude = Math.round(bl.latitude * 10000)/10000
            bl.longitude = Math.round(bl.longitude * 10000)/10000
        }
        catch(err) {bl = null;}


        let tr ;
        try { 
            tr = eww.current.pickTerrain(eww.current.canvasCoordinates(view.x + view.width, view.y)).terrainObject().position
            tr.latitude = Math.round(tr.latitude * 10000)/10000
            tr.longitude = Math.round(tr.longitude * 10000)/10000
        }
        catch(err) {tr = null;}

        //console.log(bl.longitude+'/'+bl.latitude+'/'+tr.longitude+'/'+tr.latitude);
        if(bl == null || tr == null )  {
            //   area = {type:"bbox", value:"-180,-90,180,90"};
              polygon = ''
        } else {
              area = {
                    type: "bbox",
                    value:
                           bl.longitude +','
                          + bl.latitude +','
                          +tr.longitude +','
                          +tr.latitude
              };

              polygon = 'POLYGON((' 
                + bl.longitude + ' ' + bl.latitude + ',' 
                + tr.longitude + ' ' + bl.latitude + ',' 
                + tr.longitude + ' ' + tr.latitude + ',' 
                + bl.longitude + ' ' + tr.latitude + ',' 
                + bl.longitude + ' ' + bl.latitude + '))' 
        }
        return polygon

    }

    function addGeojson(url,replace) {

        console.log('replace: '+replace)
        function shapeConfigurationCallback(geometry, properties) {
            let configuration = {};
            configuration.userProperties = properties
    
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

                configuration.highlightAttributes = new WorldWind.ShapeAttributes(configuration.attributes);
                configuration.highlightAttributes.outlineColor = new WorldWind.Color(1, 0, 0, 0.4);
                configuration.highlightAttributes.interiorColor = new WorldWind.Color(1, 0, 0, 0.6);
                // configuration.attributes.outlineWidth = 0.3;

                configuration.attributes.applyLighting = true;

            }
    
            //console.log(configuration.attributes);
            return configuration;
        }

        
        function loadCompleteCallback() {
            console.log(renderableLayer)
            setGeojsonlayers((geojsonlayers)=>[...geojsonlayers,renderableLayer])
            eww.current.redraw();
        }
    
    
        let renderableLayer = new WorldWind.RenderableLayer(url.properties.updated+Math.ceil(Math.random() * 10000))
        // if (replace) removeGeoJson()
        eww.current.addLayer(renderableLayer);
        // setGeojsonlayers((geojsonlayers)=>[...geojsonlayers,renderableLayer])
        // setGeojsonlayers((geojsonlayers)=>[...geojsonlayers,renderableLayer])
        // setGeojsonlayers(eww.current.layers)
        let geoJson = new WorldWind.GeoJSONParser(url);
        geoJson.load(loadCompleteCallback, shapeConfigurationCallback, renderableLayer);
        // setGeojsonlayers((geojsonlayers)=>[...geojsonlayers,renderableLayer])        
    }

    function removeGeojson() {
        for(let i=0;i<geojsonlayers.length;i++) {
          eww.current.removeLayer(geojsonlayers[i])
        //   console.log('removing json layers: ')
        //   console.log(geojsonlayers[i])
        }
        setGeojsonlayers([])
        // console.log(geojsonlayers)
        eww.current.redraw();
      }

    function addWMS(config) {
        let layer =  new WorldWind.WmsLayer(config, "")
        // https://view.onda-dias.eu/instance00/ows?&service=WMS&request=GetMap&layers=S1B_IW_GRDH_1SDV_20190520T050758_20190520T050823_016323_01EB81_6EB6&styles=&format=image%2Fpng&transparent=true&version=1.1.1&width=256&height=256&srs=EPSG%3A3857&bbox=2035059.441064533,7044436.526761846,2191602.4749925737,7200979.560689885
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

    // callback from eww   
    const setGlobeStates = () => {
        let lo = eww.current.navigator.lookAtLocation.longitude
        let la = eww.current.navigator.lookAtLocation.latitude
        let al = eww.current.navigator.range
        let vp = (al < 2000000?getViewPolygon():'')
        // console.log(al + 'km : '+ vp)

        // let newewwstate = {...ewwstate, longitude:lo, 
        //     latitude: la,
        //     altitude: al, 
        //     viewpolygon: vp}
        // setEwwState(newewwstate)

        setEwwState((ewwstate) => { return {...ewwstate, longitude:lo, latitude: la, altitude: al, viewpolygon: vp}}) 

        // setEwwState({
        //     longitude:lo, 
        //     latitude: la,
        //     altitude: al, 
        //     viewpolygon: vp,
        //     aoi: ai
            
        // })
    }

    // handler for tap/click

    const handleClick  = (recognizer) => {
        console.log('click')
        let x = recognizer.clientX
        let y = recognizer.clientY
        // Perform the pick. Must first convert from window coordinates to canvas coordinates, which are
        // relative to the upper left corner of the canvas rather than the upper left corner of the page.
        let pickList = eww.current.pick(eww.current.canvasCoordinates(x, y));
        console.log(pickList)
        if (pickList.terrainObject()) {
            // position = pickList.terrainObject().position;
            // store list of selected footprints in a string for later comparison
            let pickedItems = []
            for (let i = 0; i < pickList.objects.length; i++) {
                if (pickList.objects[i].userObject instanceof WorldWind.SurfaceShape) {
                    pickedItems.push(pickList.objects[i].userObject.userProperties.name) 
                    pickList.objects[i].userObject.highlighted = !pickList.objects[i].userObject.highlighted
                }
            }
            console.log(pickedItems)
            eww.current.redraw()
        } else {
            console.log('No position !');
            return;
        }


    }

    const handleDoubleClick  = (recognizer) => {
        console.log('double click')
        let x = recognizer.clientX
        let y = recognizer.clientY
        let pickList = eww.current.pick(eww.current.canvasCoordinates(x, y));

        let position;
  
  
        // Get coordinates of clicked point and list of selected footprints. Do nothing if click done outside the globe.
        if (pickList.terrainObject()) {
            position = pickList.terrainObject().position;
            eww.current.goTo(new WorldWind.Location(position.latitude, position.longitude));

            let point = "POINT("+position.longitude+' '+position.latitude+")"
            
            setEwwState((ewwstate) => { return {...ewwstate, aoi: point}}) 
    
        } else {
              console.log('No position !');
              setEwwState((ewwstate) => { return {...ewwstate, aoi: ''}})
        }
  
        

       
    }

    // useEffect(() => {
    //     console.log("useEffect aoi: " + aoi)
    //     let newewwstate = {...ewwstate, aoi: aoi}
    //     setEwwState(newewwstate)
    // }, [aoi]); 

    // didMount effect
    useEffect(() => {
        console.log("useEffect (mount) in Eww  star/atmo: "+ starfield+'/'+atmosphere)
        // eww.current = new WorldWind.WorldWindow(id, elevationModel);
        eww.current = new WorldWind.WorldWindow(id);
        eww.current.redrawCallbacks.push(setGlobeStates)

        // Define a min/max altitude limit
        WorldWind.BasicWorldWindowController.prototype.applyLimits = function () {
            eww.current.navigator.range = WorldWind.WWMath.clamp(eww.current.navigator.range, 2000, 300000000);
        }

        // define click/tap recognisers
        // let tapRecognizer = new WorldWind.TapRecognizer(eww.current, handleClick);
        // tapRecognizer.numberOfTaps = 1;
        // let doubleTapRecognizer = new WorldWind.TapRecognizer(eww.current, handleDoubleClick);
        // doubleTapRecognizer.numberOfTaps = 2;
        // doubleTapRecognizer.recognizeSimultaneouslyWith(tapRecognizer);

        let clickRecognizer = new WorldWind.ClickRecognizer(eww.current, handleClick);
        clickRecognizer.numberOfClicks = 1;
        let doubleClickRecognizer = new WorldWind.ClickRecognizer(eww.current, handleDoubleClick);
        doubleClickRecognizer.numberOfClicks = 2;
        doubleClickRecognizer.recognizeSimultaneouslyWith(clickRecognizer);
        doubleClickRecognizer.maxClickInterval = 200;


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
        //atmosphereLayer.minActiveAltitude = 5000000
    
        let layers = [
            { layer: new WorldWind.WmsLayer(wmsConfigBg, ""), enabled: true },
            { layer: new WorldWind.WmsLayer(wmsConfigNames, ""), enabled: names },
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
        
  
  return { ewwstate, removeGeojson, addGeojson, addWMS, toggleStarfield, toggleAtmosphere, setTime, toggleProjection, toggleNames };
}
