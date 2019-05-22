import React, { useState, useLayoutEffect } from "react";
import { useGlobal } from 'reactn';
import "./mapstatelabel.css"



function MapStateLabel() {

    const [ appaltitude,  ] = useGlobal('appaltitude')
    // const [altitude, setAltitude] = useState()


    // useLayoutEffect(() => {    
    //     console.log('Altitude changed') 
    //     setAltitude(Math.ceil(appaltitude / 1000))
    // },[appaltitude])

    return (
        <div className='MapStateLabel' >
            <div >{Math.ceil(appaltitude / 1000)+ ' Km'}</div>
        </div>
    )
    // <div className='MonthLabel' key='month' style={highlight=='month'?{color: 'rgba(120,0,0,1)'}:{}} >{month}</div>


    
}

export default MapStateLabel;
