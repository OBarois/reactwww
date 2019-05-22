import React, { useState, useEffect } from "react";
import ClockController from "./clockController";
import Map from "./map";
import Eww from "./eww";
import MissionSelector from "./missionselector";
import Fullscreen from "react-full-screen";
import { useFullscreen } from '@straw-hat/react-fullscreen';
import { useHotkeys } from 'react-hotkeys-hook';
import { useGlobal } from 'reactn';

import "./styles.css"
import TimeSelector from "./timeselector";
import TimeLabel from "./timelabel";
import MapStateLabel from "./mapstatelabel";

import Debug from "./debug";
import ControlPanel from "./controlpanel";



const App = () => {
  //const [count, setCount] = useState(1000);
  const [hasFetched, setFetch] = useState(false)


  
  const [ mission, setMission ] = useGlobal('mission');
    useEffect(() => {
        console.log('Mission changed to: '+ mission)
    }, [mission]);
 


  // Set boundaries and zoom factor of the time scale
  const [min, setMin] = useState((new Date("2015-04-10")).getTime())
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
  const [isControlPanel, setIscontrolpanel] = useState(false)
  
  useHotkeys("f",toggleFullscreen )  
  
  //const [ appdate, setAppdate ] = useGlobal('appdate');
  // const [ myname,  ] = useGlobal('appnames');
console.log('app renders')
  return (
    <div className="App">
      <Fullscreen enabled={isFull} onChange={() =>  {if(!isFull) setIsfull(false)} }>
      
        <div className="DateTimeLabel" >
          <TimeLabel vertical={vertical} />
        </div>
        
        <div className="ClockController">
          <ClockController duration="600000"/>
        </div> 

        <div className="Globe">
          <Eww id="globe" starfield="true" atmosphere='true' clon='0.5' clat='40' names='true'/>
        </div>
        <div className={vertical?"TimeSelectorv":"TimeSelectorh"}>
          <TimeSelector min={min} max={max} vertical={vertical}/>
        </div>
        
        <img className='Logo' src='./images/EOi_logo.png' alt='' onClick={()=>setIscontrolpanel((isControlPanel => !isControlPanel))} />
        <div className='MissionLabel'>{mission}</div>
        <MapStateLabel></MapStateLabel>
        <ControlPanel active={isControlPanel}/>
        <Debug action='Bonjour'/>
      </Fullscreen>
   </div>
  );
}

        // <div className='MiniGlobe' >
        //   <Eww id='miniglobe' clon='0.5' clat='40' myname={myname}/>  
        // </div>  




export default App
