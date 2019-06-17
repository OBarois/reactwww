import React from 'react';
import dateFormat from "dateformat"
import './DateLabel.css';

function DateLabel({date, highlight, animated}) {


    return (
        <div className='LabelContainer' >
            <div className='Date'>
                <div className={highlight==='day' || highlight==='none'?'DayLabel':'DayLabel Greyedout'}  key='day'  >{dateFormat(date,'UTC:dd')}</div>
                <div className='YearMonth'>
                    <div className={highlight==='month' || highlight==='none'?'MonthLabel ':'MonthLabel  Greyedout'}  key='month' >{dateFormat(date,'UTC:mmm').toUpperCase()}</div>
                    <div className={highlight==='year' || highlight==='none'?'YearLabel ':'YearLabel Greyedout'}  key='year' >{date.getUTCFullYear()}</div>
                </div>
            </div>
            <div className={animated?'Line  Line-active':'Line'} key='line' ></div>
            <div className={highlight==='time' || highlight==='none'?'TimeLabel ':'TimeLabel Greyedout'} key='time' >{dateFormat(date,'UTC:HH:MM:ss')}</div>
        </div>
    )
}
export default DateLabel
