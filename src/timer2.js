import React, {useEffect} from "react";
import { useClock } from "./useClock";
import { setGlobal } from 'reactn';
import { useHotkeys } from 'react-hotkeys-hook';


function Timer({ expiryTimestamp, count }) {
    const {
        date,
        start,
        pause,
        reset
    } = useClock({
        autoStart: true,
        count: count
    })

    //const [ appdate, setAppdate ] = useGlobal('appdate');
    setGlobal({appdate: date})

    useHotkeys("p",pause)

    const dateLabel = (new Date(date) ).toTimeString()
    return (
        <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "100px", fontKerning: "none" }}>
                <span>{dateLabel}</span>
            </div>
        </div>
    );
}

export default Timer;
