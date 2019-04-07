import React, {useEffect} from "react";
import { useClock } from "./useClock";
import { setGlobal } from 'reactn';
import { useHotkeys } from 'react-hotkeys-hook';


function Timer({ expiryTimestamp, count }) {
    const {
        date,
        start,
        pause,
        reset,
        increaseSpeed,
        decreaseSpeed
    } = useClock({
        autoStart: true,
        count: count
    })

    //const [ appdate, setAppdate ] = useGlobal('appdate');
    setGlobal({appdate: date})

    useHotkeys("t",pause)
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
