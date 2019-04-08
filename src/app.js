import React, { useState, useEffect } from "react";
import Timer from "./timer2";
import Swiper from "./swipe"
import Map from "./www";
//import './App.css';
//import ReactDOM from "react-dom";

import "./styles.css";


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


  var t = new Date();
  //var count =1000
  t.setSeconds(t.getSeconds() + 10); // 10 minutes timer

  return (
    <div className="App">
    <Swiper></Swiper>
      <div className="Time">
        <Timer duration="100000"/>
      </div>
      <div className="Globe">
        <Map id="globe" starfield="true"/>
      </div>
      <div className="Miniglobe">
      <Map id="miniglobe" starfield="false"/>
      </div>
    </div>
  );
};

export default App;
