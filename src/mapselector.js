import React, { useEffect, useGlobal } from "reactn";
// import { useGlobal } from 'reactn';
import { useHotkeys } from 'react-hotkeys-hook';
import './mapselector.css'


// should use a prop

function MapSelector() {


    const [ appatmosphere, setAppatmosphere ] = useGlobal('appatmosphere');
    const [ appstarfield, setAppstarfield ] = useGlobal('appstarfield');
    const [ appnames, setAppnames ] = useGlobal('appnames');
    // useHotkeys("1",()=>{setMission('S1')}) 
    // useHotkeys("2",()=>{setMission('S2')}) 
    // useHotkeys("3",()=>{setMission('S3')}) 
    // useHotkeys("5",()=>{setMission('S5P')}) 
    // useHotkeys("6",()=>{setMission('ENVISAT')}) 

    // useEffect(() => {
    //     console.log('Mission changed to: '+ mission)
    // }, [mission]);
    
    
    //console.log('mission rendering')
    return (
        <div className='MapSelector'>
            <div className='CircleButton'><img className='MapIcon' src='./images/atmosphere.png' alt='' onClick={() => setAppatmosphere(!appatmosphere)} /></div>
            <div className='CircleButton'><img className='MapIcon' src='./images/starfield.png' alt='' onClick={() => setAppstarfield(!appstarfield)} /></div>
            <div className='CircleButton'><img className='MapIcon' src='./images/names.png' alt='' onClick={() => setAppnames(!appnames)} /></div>
           
        </div>
    )
}

export default MapSelector
