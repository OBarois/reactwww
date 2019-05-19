import React, { useState, useEffect } from "react"
import { useEww } from "./useEww"
import { useGlobal } from 'reactn'
import { useHotkeys } from 'react-hotkeys-hook'
import useDatahub from "./useDatahub"


export default function Eww({ id, clat, clon, alt, starfield, atmosphere }) {

const {
    
    addGeojson,
    removeGeojson,
    toggleProjection,
    toggleAtmosphere,
    toggleStarfield,
    toggleNames,
    setTime
} = useEww({
    id: id,
    clat: clat,
    clon: clon,
    alt: alt,
    starfield: starfield,
    atmosphere: atmosphere
})

  // toogle projection
  useHotkeys("p",toggleProjection)  
  useHotkeys("a",toggleAtmosphere)  
  useHotkeys("s",toggleStarfield)  
  useHotkeys("n",toggleNames)  
  useHotkeys("c",removeGeojson)

  const { geojsonResults} = useDatahub();
  const [ searchdate,  ] = useGlobal('searchdate');
  const [ mission,  ] = useGlobal('mission');

  useEffect(() => {
    if(geojsonResults !== {}) {
      console.log('datahub in use')
        console.log(geojsonResults)
        try {
          addGeojson(geojsonResults)
        } catch (err) {
          console.log("error on geojson parsing")
          console.log(err)
        }
      }
      
  },[geojsonResults]);

  useEffect(() => {
    console.log('reacting to searchdate or mission')
    removeGeojson()
  },[searchdate,mission]);


const [appdate,  ] = useGlobal('appdate')
useEffect(() => {
    setTime(appdate)
  },[appdate]);


let globeStyle = {
    background: 'inherit',
    position: "fixed",
    width: 'inherit',
    height: 'inherit'
  };


return (
    <canvas id={id} style={globeStyle} />
)

}
