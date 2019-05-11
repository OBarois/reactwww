import React from "react";
import { useGlobal } from 'reactn';




function TimeLabel() {

    const [ appdate, setAppdate ] = useGlobal('appdate');
    //console.log("Render TimerLabel (appdate): "+appdate)

    return (
        <div style={{display: "flex", justifyContent: "center", alignItems: "center", width:"100%", height: "100%"}}>
            {(new Date(appdate) ).toUTCString()} 
        </div>
    );


    
}

export default TimeLabel;
