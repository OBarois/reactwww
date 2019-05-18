import React from "react";
import dateFormat from "dateformat"
import "./timelabel.css"
//import { Spring  } from 'react-spring';




function TimeLabel({highlight,date}) {


    return (
        <div className='LabelCountainer' >
            <div className='Line' key='line' >____</div>
            <div className='DayLabel' key='day' >{dateFormat(date,'UTC:dd')}</div>
            <div className='YearLabel' key='year' >{dateFormat(date,'UTC:yyyy')}</div>
            <div className='MonthLabel' key='month' >{dateFormat(date,'UTC:mmm')}</div>
            <div className='TimeLabel' key='time' >{dateFormat(date,'UTC:HH:MM:ss')}</div>
        </div>
    )


    
    
}

export default TimeLabel
