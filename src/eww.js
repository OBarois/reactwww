import React, { useState, useEffect } from "react"
import { useEww } from "./useEww"
import { useGlobal } from 'reactn'
import { useHotkeys } from 'react-hotkeys-hook'
import useDatahub from "./useDatahub"


export default function Eww({ id, clat, clon, alt, starfield, atmosphere }) {

const {
    ewwstate,
    addGeojson,
    removeGeojson,
    addWMS,
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

  const { geojsonResults, loading} = useDatahub();
  const [ searchdate,  ] = useGlobal('searchdate');
  const [ mission,  ] = useGlobal('mission');
  const [ appdate,  ] = useGlobal('appdate')
  const [ , setSearching ] = useGlobal('searching')
  const [ , setAppaltitude ] = useGlobal('appaltitude')
  const [ , setApplatitude ] = useGlobal('applatitude')
  const [ , setApplongitude ] = useGlobal('applongitude')

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

  useEffect(() => {
    setSearching(loading)
  },[loading]);

  useEffect(() => {
    // console.log(' ewwstate changed')
    setAppaltitude(ewwstate.altitude)
    setApplongitude(ewwstate.longitude)
    setApplatitude(ewwstate.latitude)
  },[ewwstate.longitude,ewwstate.latitude, ewwstate.altitude ]);




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
