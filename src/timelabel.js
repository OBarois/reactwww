import React, { useState, useLayoutEffect } from "react";
import { useGlobal } from 'reactn';
import dateFormat from "dateformat"
import "./timelabel.css"




function TimeLabel() {

    const [ appdate,  ] = useGlobal('appdate')
    const [ highlight, setHighlight] = useGlobal('highlight')

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
            <div className='DayLabel' key='day' style={highlight=='day'?{color: 'rgba(120,0,0,1)'}:{}} >{day}</div>
            <div className='YearLabel' key='year' style={highlight=='year'?{color: 'rgba(120,0,0,1)'}:{}} >{year}</div>
            <div className='MonthLabel' key='month' style={highlight=='month'?{color: 'rgba(120,0,0,1)'}:{}} >{month}</div>
            <div className='TimeLabel' key='time' >{time}</div>
        </div>
    );


    
}

export default TimeLabel;
