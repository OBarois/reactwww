import React, { useEffect } from "react";
import { useGlobal } from 'reactn';
import { useHotkeys } from 'react-hotkeys-hook';
import './missionselector.css'


// should use a prop

function MissionSelector() {


    const [ mission, setMission ] = useGlobal('mission');
    useHotkeys("1",()=>{setMission('S1')}) 
    useHotkeys("2",()=>{setMission('S2')}) 
    useHotkeys("3",()=>{setMission('S3')}) 
    useHotkeys("5",()=>{setMission('S5P')}) 
    useHotkeys("6",()=>{setMission('ENVISAT')}) 

    // useEffect(() => {
    //     console.log('Mission changed to: '+ mission)
    // }, [mission]);
    
    
    //console.log('mission rendering')
    return (
        <div className='MissionSelector'>
            <div className='Circle'><img className='MissionIcon' src='./images/s1_black.png' alt='' onClick={() => setMission('S1')} /></div>
            <div className='Circle'><img className='MissionIcon' src='./images/s2_black.png' alt='' onClick={() => setMission('S2')} /></div>
            <div className='Circle'><img className='MissionIcon' src='./images/s3_black.png' alt='' onClick={() => setMission('S3')} /></div>
            <div className='Circle'><img className='MissionIcon' src='./images/s5p_black.png' alt='' onClick={() => setMission('S5P')} /></div>
           
            
        </div>
    )
}

export default MissionSelector;
