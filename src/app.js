import React, { useState, useEffect } from "react";
import ClockController from "./clockController";
import Map from "./map";
import MissionSelector from "./missionselector";
import Fullscreen from "react-full-screen";
import { useFullscreen } from '@straw-hat/react-fullscreen';
import { useHotkeys } from 'react-hotkeys-hook';
import { useGlobal } from 'reactn';

import "./styles.css"
import TimeSelector from "./timeselector";
import TimeLabel from "./timelabel";



const App = () => {
  //const [count, setCount] = useState(1000);
  const [hasFetched, setFetch] = useState(false)


  // Set boundaries and zoom factor of the time scale
  const [min, setMin] = useState((new Date("2010-04-10")).getTime())
  const [max, setMax] = useState((new Date("2019-12-31")).getTime())
  const [vertical, setVertical] = useState(true)
  useHotkeys("h",() => {
    setVertical(prevVertical => {
        return (!prevVertical)
      })
    })


  useEffect(() => {

    const mockApi = () => {
      return new Promise(resolve => {
        setTimeout(() => {
          const randomInt = Math.ceil(Math.random() * 10)
          console.log("mockApi done")
          resolve(randomInt)
        }, 2000)
      })
    }
    
    async function doFetch() {
      if (!hasFetched) {
        const apiResponse = await mockApi();
        setFetch(true);
      }
    }

    doFetch()
  }, []);
  



  const [isFull,setIsfull] = useState(false)
  const { isFullscreen, toggleFullscreen } = useFullscreen(window.document.body);
  
  useHotkeys("f",toggleFullscreen )  
  
  //const [ appdate, setAppdate ] = useGlobal('appdate');

  return (
    <div className="App">
      <Fullscreen enabled={isFull} onChange={() =>  {if(!isFull) setIsfull(false)} }>
      
        <div className="DateTimeLabel" >
          <TimeLabel vertical={vertical}/>
        </div>
        
        <div className="ClockController">
          <ClockController duration="600000"/>
        </div> 

        <div className="Globe">
          <Map id="globe" starfield="true"/>
        </div>
        <div className={vertical?"TimeSelectorv":"TimeSelectorh"}>
          <TimeSelector min={min} max={max} vertical={vertical}/>
        </div>
        <MissionSelector mission='S1'/>
      </Fullscreen>
   </div>
  );
}

export default App;
