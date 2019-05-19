import React, { useEffect, useState } from "react";
import { useHotkeys } from 'react-hotkeys-hook';
import './debug.css'




function Debug({action}) {

    const [ debug, setDebug ] = useState(false)
    useHotkeys("d",()=>{setDebug(action => !action)}) 

    useEffect(() => {
        console.log('Debug Overlay: press D ')
        console.log('action (use): '+action)
    }, []);

    useEffect(() => {
        console.log('debug: '+debug)
    }, [debug]);

    console.log('debug rendered')

    return (
        <div className='Debug' style={{display: (debug)?'inline':'none', width: '100%', height:'100%'}}>
            <div className='ContinuousScroll' style={{position: 'relative', top: '70%', right:0, width: 60, height:'100%', background:  'rgba(22, 22, 20, 0.24)'}}/>
        </div>
    )
}

export default Debug
