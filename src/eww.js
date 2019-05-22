import React, { useGlobal, useState, useEffect } from "reactn"
import { useEww } from "./useEww"
// import { useGlobal } from 'reactn'
import { useHotkeys } from 'react-hotkeys-hook'
import useDatahub from "./useDatahub"


export default function Eww({ id, clat, clon, alt, starfield, atmosphere, names }) {

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
    atmosphere: atmosphere,
    names: names
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
  const [ appstarfield,  setAppstarfield] = useGlobal('appstarfield')
  const [ appatmosphere,  setAppatmosphere] = useGlobal('appatmosphere')
  const [ appnames,  setAppnames] = useGlobal('appnames')
  const [ , setSearching ] = useGlobal('searching')
  const [ , setAppaltitude ] = useGlobal('appaltitude')
  const [ , setApplatitude ] = useGlobal('applatitude')
  const [ , setApplongitude ] = useGlobal('applongitude')
  const [ , setApppolygon ] = useGlobal('apppolygon')

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
    console.log('atmosphere')
    toggleAtmosphere(appatmosphere)
  },[appatmosphere])

  useEffect(() => {
    toggleStarfield(appstarfield)
  },[appstarfield])
  useEffect(() => {
    toggleNames(appnames)
  },[appnames])


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
    // uncomment to search via polygon at low lats
    setApppolygon(ewwstate.viewpolygon)
    setApppolygon('')
  },[ewwstate.viewpolygon ]);



  useEffect(() => {
    setTime(appdate)
  },[appdate]);

  useEffect(() => {
    setAppatmosphere(atmosphere)
    setAppstarfield(starfield)
    setAppnames(names)
  },[]);


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
