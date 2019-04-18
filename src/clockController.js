import React, { useState, useEffect, useRef } from "react"
import { useClock } from "./useClock";
import { useGlobal, setGlobal } from 'reactn';
import { useHotkeys } from 'react-hotkeys-hook';
import playImage from './images/play.png'
//import pauseImage from './images/pause.png'





function ClockController({ duration }) {
    const {
        date,
        togglePause,
        reset,
        increaseSpeed,
        decreaseSpeed,
        forceDate
    } = useClock({
        autoStart: false,
        duration: duration
    })

    const [ appdate, setAppdate ] = useGlobal('appdate');
    //setGlobal({appdate: date})

    useHotkeys("t",togglePause)
    useHotkeys("r",reset)
    useHotkeys(".",increaseSpeed)
    useHotkeys(",",decreaseSpeed)

    //const dateLabel = (new Date(date) ).toUTCString()

    useEffect(() => {
        console.log("useEffect (date) in ClockController")
        setAppdate(date)
        //forceDate(date)
        //setAppdate({appdate: new Date(date)})
    },[date]);
    useEffect(() => {
        //console.log("useEffect (appdate) in ClockController")
        //setAppdate(date)
        forceDate(appdate)
        //setAppdate({appdate: new Date(date)})
    },[appdate]);

    useEffect(() => {
        //console.log("useEffect (init) in ClockController")
        //console.log("appdate changed")
        forceDate(appdate)
    },[]);

    return (
/*
        <div {...handlers} style={{display: "flex", justifyContent: "center", alignItems: "center", width:"100%", height: "100%"}}>
            {(new Date(date) ).toUTCString()}
        </div>
*/
    <div onClick={togglePause}><img src={playImage} /></div>
    );
}

export default ClockController;
