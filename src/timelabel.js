import React, { useState, useLayoutEffect } from "react";
import { useGlobal } from 'reactn';
import dateFormat from "dateformat"
import "./timelabel.css"




function TimeLabel(props) {

    const [ appdate, setAppdate ] = useGlobal('appdate');
    //console.log("Render TimerLabel (appdate): "+appdate)
    let date = new Date(appdate)
    const [year, setYear] = useState('') 
    const [month, setMonth] = useState('') 
    const [day, setDay] = useState('') 
    const [time, setTime] = useState('') 


    useLayoutEffect(() => {     
           let date = new Date(appdate)
           setYear(date.getUTCFullYear())
           setMonth(dateFormat(date,'UTC:mmm'))
           setDay(dateFormat(date,'UTC:dd'))
           setTime(dateFormat(date,'UTC:HH:MM:ss'))
    },[appdate])


    return (
        <div className='LabelCountainer' >
            <div className='Line' key='line' >____</div>
            <div className='DayLabel' key='day' >{day}</div>
            <div className='YearLabel' key='year' >{year}</div>
            <div className='MonthLabel' key='month' >{month}</div>
            <div className='TimeLabel' key='time' >{time}</div>
        </div>
    );


    
}

export default TimeLabel;
