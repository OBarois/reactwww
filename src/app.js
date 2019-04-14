import React, { useState, useEffect } from "react";
import Timer from "./timer";
import Map from "./www";
import Fullscreen from "react-full-screen";
import { useHotkeys } from 'react-hotkeys-hook';
import { useGlobal } from 'reactn';

import "./styles.css"
import TimeSelector from "./timeselector";
import TimeLabel from "./timelabel";


const mockApi = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      const randomInt = Math.ceil(Math.random() * 10)
      resolve(randomInt);
    }, 1000);
  });
};

const App = () => {
  //const [count, setCount] = useState(1000);
  const [hasFetched, setFetch] = useState(false)

  //const [date, setdate ] = useGlobal('appdate')
  //setdate((new Date()).getTime())
  const min = (new Date("2019-04-10")).getTime()
  const max = (new Date()).getTime() 



  useEffect(() => {
    doFetch()
  }, []);
  //useEffect(async () => {
  async function doFetch() {
    if (!hasFetched) {
      const apiResponse = await mockApi();
      setFetch(true);
      //setCount(apiResponse);
    }
  }



  const [isFull,setIsfull] = useState(false)
  //const goFull = () => { setIsfull(true) }
  useHotkeys("f",() => {setIsfull(true)} )  



  return (
    <div className="App">
      <Fullscreen enabled={isFull} onChange={isFull => setIsfull({isFull})} >
        <div className="TimeLabel">
          <TimeLabel duration="3000"/>
        </div>
        <div className="Globe">
          <Map id="globe" starfield="true"/>
        </div>
        <div className="TimeSelectorh">
          <TimeSelector min={min} max={max} direction="verticalh"/>
        </div>
        
      </Fullscreen>
   </div>
  );
}

export default App;
