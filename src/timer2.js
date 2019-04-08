import React from "react";
import { useClock } from "./useClock";
import { setGlobal } from 'reactn';
import { useHotkeys } from 'react-hotkeys-hook';


function Timer({ duration }) {
    const {
        date,
        togglePause,
        reset,
        increaseSpeed,
        decreaseSpeed
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

    const dateLabel = (new Date(date) ).toUTCString()
    return (
        <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "50px", fontKerning: "none" }}>
                <span>{dateLabel}</span>
            </div>
        </div>
    );
}

export default Timer;
