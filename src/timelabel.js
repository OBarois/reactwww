import React, { useState, useLayoutEffect } from "react";
import { useGlobal } from 'reactn';
import dateFormat from "dateformat"
import "./timelabel.css"




function TimeLabel() {

    const [ appdate,  ] = useGlobal('appdate')
    const [ highlight, ] = useGlobal('highlight')
    const [ searching, ] = useGlobal('searching')

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

    useLayoutEffect(() => {     
        console.log('Searching: '+searching)
    },[searching])


    return (
        <div className='LabelContainer' >
            <div className='Date'>
                <div className={highlight==='day'?'DayLabel  Highlighted':'DayLabel'}  key='day'  >{day}</div>
                <div className='YearMonth'>
                    <div className={highlight==='month'?'MonthLabel  Highlighted':'MonthLabel'}  key='month' >{month}</div>
                    <div className={highlight==='year'?'YearLabel  Highlighted':'YearLabel'}  key='year' >{year}</div>
                </div>
            </div>
            <div className={searching===true?'Line  Line-active':'Line'} key='line' ></div>
            <div className='TimeLabel' key='time' >{time}</div>
        </div>
    );
    // <div className='MonthLabel' key='month' style={highlight=='month'?{color: 'rgba(120,0,0,1)'}:{}} >{month}</div>


    
}

export default TimeLabel;
