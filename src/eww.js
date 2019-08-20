import React, { useGlobal, useState, useEffect, useLayoutEffect } from "reactn"
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
  useHotkeys("z",(state)=>setReplace(!state))
  

  const { geojsonResults, loading, firstpage} = useDatahub();
  const [ searchepoch,  ] = useGlobal('searchepoch');
  const [ startend,  ] = useGlobal('startend');
  // const [ replace, setReplace ] = useGlobal('replace');

  const [ replace,  setReplace] = useGlobal('replace');
  const [ appdate,  ] = useGlobal('appdate')
  const [ appstarfield,  setAppstarfield] = useGlobal('appstarfield')
  const [ appatmosphere,  setAppatmosphere] = useGlobal('appatmosphere')
  const [ appnames,  setAppnames] = useGlobal('appnames')
  // const [ , setSearching ] = useGlobal('searching')
  const [ , setAppaltitude ] = useGlobal('appaltitude')
  const [ , setApplatitude ] = useGlobal('applatitude')
  const [ , setApplongitude ] = useGlobal('applongitude')
  const [ apppolygon, setApppolygon ] = useGlobal('apppolygon')
  const [ apppickeditems, setApppickeditems ] = useGlobal('apppickeditems')
  // const [ replace, setReplace ] = useState(true)

  // useHotkeys("z",()=>setReplace(state=>!state))

  useEffect(() => {
    if(geojsonResults) {
      if(firstpage) removeGeojson()
      console.log('datahub in use')
        console.log(geojsonResults)
        try {
          addGeojson(geojsonResults,appdate)
        } catch (err) {
          console.log("error on geojson parsing")
          console.log(err)
        }
      }
      
  },[geojsonResults, firstpage]);

  useEffect(() => {
    console.log('replace: ' + replace)
  },[replace]);

  useEffect(() => {
    // console.log('atmosphere')
    toggleAtmosphere(appatmosphere)
  },[appatmosphere])

  useEffect(() => {
    toggleStarfield(appstarfield)
  },[appstarfield])

  useEffect(() => {
    toggleNames(appnames)
  },[appnames])


  useEffect(() => {
    setReplace(loading)
  },[loading]);

  useEffect(() => {
    setAppaltitude(ewwstate.altitude)
    setApplongitude(ewwstate.longitude)
    setApplatitude(ewwstate.latitude)
  },[ewwstate.longitude,ewwstate.latitude, ewwstate.altitude ]);

  // useEffect(() => {
  //   // uncomment to search via polygon at low lats
  //   // console.log(' could use polygon:')
  //   // console.log(ewwstate.viewpolygon)
  //   // setApppolygon(ewwstate.viewpolygon)

  // },[ewwstate.viewpolygon ]);

  useEffect(() => {
    setApppolygon(ewwstate.aoi)
    // setApppolygon('')
  },[ewwstate.aoi]);

  useEffect(() => {
    // console.log(ewwstate.pickedItems.length + ' items picked')
    // setApppolygon('')
    setApppickeditems(ewwstate.pickedItems)
  },[ewwstate.pickedItems]);



  useEffect(() => {
    // console.log('app date: '+appdate)
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
