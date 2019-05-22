import React, { useEffect, useState } from "react";
import { useHotkeys } from 'react-hotkeys-hook';
import './stepmask.css'




function StepMask({action}) {

    const [ active, setDebug ] = useState(action)
    useHotkeys("m",()=>{setDebug(active => !active)}) 

    useEffect(() => {
        console.log('Debug Overlay: press D ')
        console.log('action (use): '+action)
    }, []);

    useEffect(() => {
        console.log('active: '+active)
    }, [active]);

    console.log('active rendered')

    return (
        <div className='StepMask' style={{display: (active)?'inline':'none'}}>
            <div className='DayMask' style={{display: (active)?'inline':'none'}}/>
            <div className='MonthMask' style={{display: (active)?'inline':'none'}}/>
            <div className='YearMask' style={{display: (active)?'inline':'none'}}/>
        
        </div>
    )
}

export default StepMask
