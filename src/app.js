import React, { useState, useEffect } from "react";
import ClockController from "./clockController";
import Eww from "./eww";
import MissionSelector from "./missionselector";
import MapSelector from "./mapselector";
import Fullscreen from "react-full-screen";
import { useFullscreen } from '@straw-hat/react-fullscreen';
import { useHotkeys } from 'react-hotkeys-hook';
import { useGlobal } from 'reactn';

import "./styles.css"
import TimeSelector from "./timeselector2";
import TimeLabel from "./timelabel";
import MapStateLabel from "./mapstatelabel";
import DateManager from './datemanager'

import Debug from "./debug";
import SlidePanel from "./slidepanel";
import StepMask from './stepmask'
import ColorPicker from './colorpicker'



const App = () => {
  //const [count, setCount] = useState(1000);
  const [hasFetched, setFetch] = useState(false)

  let initdate = new Date()
  const [startdate, ] = useState(initdate)
  // const [searching, ] = useState(false)
  const [ searching, ] = useGlobal('searching')


  const [ appdate, setAppdate ] = useGlobal('appdate')
  const [, setSearchdate] = useGlobal('searchepoch')



  
  const [ mission, setMission ] = useGlobal('mission');
    useEffect(() => {
        console.log('Mission changed to: '+ mission)
    }, [mission]);
 
    const changeDate = (newdate) => {
      // console.log('App changeDate callback: ' + newdate.toJSON())
      setAppdate(newdate.getTime())
    }
    const changeFinalDate = (newdate) => {
      // console.log('App final changeDate callback: ' + newdate.toJSON())
      setSearchdate(newdate.getTime())
    }
    

  
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
  // const [isControlPanel, setIscontrolpanel] = useState(false)
  
  useHotkeys("f",toggleFullscreen )  
  
  //const [ appdate, setAppdate ] = useGlobal('appdate');
  // const [ myname,  ] = useGlobal('appnames');
  return (
    <div className="App">
      <Fullscreen enabled={isFull} onChange={() =>  {if(!isFull) setIsfull(false)} }>

      
        {/* <div className="DateTimeLabel" >
          <TimeLabel vertical={vertical} />
        </div>
        
        <div className="ClockController">
          <ClockController duration="600000"/>
        </div>  */}

        <div className="Globe">
          <Eww id="globe" starfield="true" atmosphere='true' clon='0.5' clat='40' names='true'/>
        </div>
        <DateManager startdate={startdate}  searching={searching} onDateChange={changeDate} onFinalDateChange={changeFinalDate} />
        
        <div className='MissionLabel'>{mission}</div>
        <MapStateLabel></MapStateLabel>
        <SlidePanel active='false' imageSrc='./images/ESA_logo_white.png' >
          <MissionSelector></MissionSelector>
          <MapSelector></MapSelector>
          <ColorPicker />
        </SlidePanel>

        <Debug action='Bonjour'/>

      </Fullscreen>
   </div>
  );
}


        // <ControlPanel active='false' imageSrc='./images/EOi_logo.png' >
        //         <MissionSelector></MissionSelector>
        //         <MapSelector></MapSelector>
        // </ControlPanel>

// <ColorPicker />
//         <StepMask/>

        // <div className='MiniGlobe' >
        //   <Eww id='miniglobe' clon='0.5' clat='40' myname={myname}/>  
        // </div>  

                // <img className='Logo' src='./images/EOi_logo.png' alt='' onClick={()=>setIscontrolpanel((isControlPanel => !isControlPanel))} />




export default App
