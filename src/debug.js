import React, { useEffect, useState } from "react";
import { useGlobal } from 'reactn';
import { useHotkeys } from 'react-hotkeys-hook';
import './debug.css'




function Debug() {

    const [ debug, setDebug ] = useGlobal('debug')
    const [ active, setActive ] = useState(false)
    const [ debugkeys, setDebugkeys ] = useState([])
    

    useHotkeys("d",()=>{setActive(active => !active)}) 

    useEffect(() => {
        console.log('Debug Overlay Key: d')
    }, []);

    useEffect(() => {
        if(active) {
            console.log('debug txt: ')
            console.log(debug)
            let lines = debugkeys
            lines[debug[1]] = debug[0]
            setDebugkeys( lines )
            console.log(lines)
        }
    }, [debug]);


    useEffect(() => {
        setDebug( ['Hi',0])
    }, []);

//     const listItems = numbers.map((number) =>
//     <li>{number}</li>
//   );
//   return (
//     <ul>{listItems}</ul>
//   )

    return (
        <div className='Debug' style={{display: (active)?'inline':'none', width: '100%', height:'100%'}}>
            {/* <div className='ContinuousScroll' style={{position: 'relative', top: '70%', right:0, width: 60, height:'100%', background:  'rgba(22, 22, 20, 0.24)'}}/> */}
            <div className='DebugBox1'>
                <ul>
                    {debugkeys.map(item=><li key={item?item[1]:''}>{item?item:'free'}</li>)}
                </ul>
            </div> 
        </div>
    )
}

export default Debug
