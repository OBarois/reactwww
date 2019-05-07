import React, { useState, useEffect } from "react";
import ClockController from "./clockController";
import Map from "./map";
import Fullscreen from "react-full-screen";
import { useHotkeys } from 'react-hotkeys-hook';
import { useGlobal } from 'reactn';

import "./styles.css"
import TimeSelector from "./timeselector";
import TimeLabel from "./timelabel";



const App = () => {
  //const [count, setCount] = useState(1000);
  const [hasFetched, setFetch] = useState(false)


  // Set boundaries of the time scale
  const [min, setMin] = useState((new Date("2014-04-10")).getTime())
  const [max, setMax] = useState((new Date("2019-12-31")).getTime())


  useEffect(() => {

    const mockApi = () => {
      return new Promise(resolve => {
        setTimeout(() => {
          const randomInt = Math.ceil(Math.random() * 10)
          console.log("mockApi done")
          resolve(randomInt)
        }, 10000)
      })
    }
    
    async function doFetch() {
      if (!hasFetched) {
        const apiResponse = await mockApi();
        setFetch(true);
      }
    }

    console.log('useEffect (mount) in App')
    doFetch()
  }, []);
  



  const [isFull,setIsfull] = useState(false)
  //const goFull = () => { setIsfull(true) }
  useHotkeys("f",() => {setIsfull(true)} )  
  //const [ appdate, setAppdate ] = useGlobal('appdate');


  return (
    <div className="App">
      <Fullscreen enabled={isFull} onChange={isFull => setIsfull({isFull})} >
        <div className="TimeLabel">
          <TimeLabel />
        </div>
        <div className="ClockController">
          <ClockController duration="600000"/>
        </div> 

        <div className="Globe">
          <Map id="globe" starfield="true"/>
        </div>
        <div className="TimeSelectorh-m">
          <TimeSelector min={min} max={max} direction="horizontal"/>
        </div>
        
      </Fullscreen>
   </div>
  );
}

export default App;
