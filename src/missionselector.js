import React, { useEffect } from "react";
import { useGlobal } from 'reactn';
import { useHotkeys } from 'react-hotkeys-hook';
import './missionselector.css'




function MissionSelector() {


    const [ mission, setMission ] = useGlobal('mission');
    useHotkeys("1",()=>{setMission('S1')}) 
    useHotkeys("2",()=>{setMission('S2')}) 
    useHotkeys("3",()=>{setMission('S3')}) 
    useHotkeys("5",()=>{setMission('S5P')}) 
    useHotkeys("6",()=>{setMission('ENVISAT')}) 

    useEffect(() => {
        console.log('Mission changed to: '+ mission)
    }, [mission]);

    return (
        <div className='MissionSelector'>
            <img className='MissionIcon' src='./images/s1_black.png' alt='' onClick={() => setMission('S1')} />
            <img className='MissionIcon' src='./images/s2_black.png' alt='' onClick={() => setMission('S2')} />
            <img className='MissionIcon' src='./images/s3_black.png' alt='' onClick={() => setMission('S3')} />
            <img className='MissionIcon' src='./images/s5p_black.png' alt='' onClick={() => setMission('S5P')} />
            <div className='MissionLabel'>{mission}</div>
        </div>
    )
}

export default MissionSelector;
