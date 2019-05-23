import React, { useEffect, useState } from "react";
import { useGlobal } from 'reactn';
import { useHotkeys } from 'react-hotkeys-hook';
import useDebug from './useDebug'
import './debug.css'




function Debug() {

    // const [ debug, setDebug ] = useDebug()
    const [ debug,  ] = useGlobal('debug')
    const [ active, setActive ] = useState(false)

    useHotkeys("d",()=>{setActive(active => !active)}) 

    useEffect(() => {
        console.log('Debug Overlay Key: d')
    }, []);

    useEffect(() => {
        if(active) console.log(debug)
    }, [debug]);

    return (
        <div className='Debug' style={{display: (active)?'inline':'none', width: '100%', height:'100%'}}>
            {/* <div className='ContinuousScroll' style={{position: 'relative', top: '70%', right:0, width: 60, height:'100%', background:  'rgba(22, 22, 20, 0.24)'}}/> */}
            <div className='DebugBox1'>{debug}</div> 
        </div>
    )
}

export default Debug
