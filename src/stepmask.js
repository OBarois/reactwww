import React, { useEffect, useState } from "react";
import { useHotkeys } from 'react-hotkeys-hook';
import { useGlobal } from 'reactn'
import './stepmask.css'




function StepMask() {
    const [highlight] = useGlobal('highlight')
    const [ active, setDebug ] = useState(false)
    useHotkeys("m",()=>{setDebug(active => !active)}) 

    useEffect(() => {
        console.log('Mask Overlay: press m ')
        console.log('active (use): '+active)
    }, []);

    useEffect(() => {
        setDebug((highlight !== 'none') )
    }, [highlight]);

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