import React, { useEffect, useState } from "react";
import { useHotkeys } from 'react-hotkeys-hook';
import './missionselector.css'




function Debug({action}) {


    const [ debug, setDebug ] = useState(true)
    useHotkeys("d",()=>{setDebug(action => !action)}) 

    useEffect(() => {
        console.log('Debug Overlay: press D ')
        console.log('action: '+action)
    }, []);

    

    return (
        <div className='debug' style={{display: (debug)?'inline':'hidden', width: 30, height:'100%'}}>
            <div className='ContinuousScroll' style={{top: '70%', right:0, width: 30, height:'100%', background:  'rgba(22, 22, 20, 0.74)'}}/>
        </div>
    )
}

export default Debug
