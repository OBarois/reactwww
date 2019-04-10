import React, { useState, useEffect } from "react";
import Timer from "./timer";
import Map from "./www";
import Fullscreen from "react-full-screen";
import { useHotkeys } from 'react-hotkeys-hook';

import "./styles.css";
//import Swiper from "./swipe";


const mockApi = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      const randomInt = Math.ceil(Math.random() * 10);
      resolve(randomInt);
    }, 1000);
  });
};

const App = () => {
  //const [count, setCount] = useState(1000);
  const [hasFetched, setFetch] = useState(false);

  useEffect(() => {
    doFetch();
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
  const goFull = () => {
    setIsfull(true)
  }
  useHotkeys("f",goFull)  

  return (
    <div className="App">
      <Fullscreen enabled={isFull} onChange={isFull => setIsfull({isFull})} >
        <div className="Time">
          <Timer duration="60000"/>
        </div>
        <div className="Globe">
          <Map id="globe" starfield="true"/>
        </div>
      </Fullscreen>
   </div>
  );
}

export default App;
