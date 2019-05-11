import React, { useEffect } from "react";
import { useGlobal } from 'reactn';
import { useHotkeys } from 'react-hotkeys-hook';




function MissionSelector() {

console.log('mission selector')
    const [ mission, setMission ] = useGlobal('mission');
    console.log("selected: "+mission)
    useHotkeys("1",()=>{setMission('S1')}) 
    useHotkeys("2",()=>{setMission('S2')}) 
    useHotkeys("3",()=>{setMission('S3')}) 
    useHotkeys("5",()=>{setMission('S5P')}) 



    return (
        <div></div>
    )
}

export default MissionSelector;
