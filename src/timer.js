import React from "react";
import { useClock } from "./useClock";
import { setGlobal } from 'reactn';
import { useHotkeys } from 'react-hotkeys-hook';
import { useSwipeable } from 'react-swipeable'

//import {useSpring, animated} from 'react-spring'



function Timer({ duration }) {
    const {
        date,
        togglePause,
        reset,
        increaseSpeed,
        decreaseSpeed,
        swipe
    } = useClock({
        autoStart: true,
        duration: duration
    })

    //const [ appdate, setAppdate ] = useGlobal('appdate');
    setGlobal({appdate: date})

    useHotkeys("t",togglePause)
    useHotkeys("r",reset)
    useHotkeys(".",increaseSpeed)
    useHotkeys(",",decreaseSpeed)

    //const dateLabel = (new Date(date) ).toUTCString()

    const config = {
        delta: 10,                             // min distance(px) before a swipe starts
        preventDefaultTouchmoveEvent: true,   // preventDefault on touchmove, *See Details*
        trackTouch: true,                      // track touch input
        trackMouse: true,                     // track mouse input
        rotationAngle: 0,    
    }

    const handlers = useSwipeable({ onSwiped: (eventData) => timeSwipe(eventData), ...config })
    function timeSwipe(e) {
        swipe(e.velocity,(e.dir == "Left")?-1:1)
    }


    return (
        <div {...handlers} style={{display: "flex", justifyContent: "center", alignItems: "center", width:"100%", height: "100%"}}>
            {(new Date(date) ).toUTCString()}
        </div>
    );
}

export default Timer;
