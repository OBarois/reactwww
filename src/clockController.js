import React, { useEffect } from "react"
import { useClock } from "./useClock";
import { useGlobal } from 'reactn';
import { useHotkeys } from 'react-hotkeys-hook';
import playImage from './images/play.png'
import pauseImage from './images/pause.png'





function ClockController({ duration }) {

    const [ appdate, setAppdate ] = useGlobal('appdate');

    const {
        date,
        playing,
        togglePause,
        reset,
        increaseSpeed,
        decreaseSpeed,
        forceDate
    } = useClock({
        autoStart: false,
        duration: duration,
        startdate: appdate
    })

    //const [playing, setPlaying ] = useState(false);
    //const [playpauseimage, setPlaypauseimage] = useState((playing?pauseImage:playImage))
    //setGlobal({appdate: date})

    useHotkeys("t",togglePause)
    useHotkeys("r",reset)
    useHotkeys(".",increaseSpeed)
    useHotkeys(",",decreaseSpeed)

    //const dateLabel = (new Date(date) ).toUTCString()


    useEffect(() => {
        console.log("playing: "+playing)
    },[playing]);

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
    <div onClick={togglePause}><img className='Buttons' src={playing?pauseImage:playImage} /></div>
    );
}

export default ClockController;
