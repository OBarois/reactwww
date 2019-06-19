import React, {useState, useEffect,useLayoutEffect, useRef} from 'react';
import {useSpring, animated} from 'react-spring'
import './DateSelector.css';

function DateSelectorScale({date, zoomfactor, immediate}) {

    const scale = useRef()
    const [start, setStart] = useState(date)    
    const [active, setActive] = useState(false)    
    const [timescale, setTimescale] = useState('')    
    // const [zoom, setZoom] = useState(zoomfactor)    


    // useEffect(() => {     
    //     setStart(date)
    // },[date])
        
    const scaleText = (_start, _zoom) => {
        // console.log('_start: '+_start.toJSON()+'  zoom: '+_zoom)
        if(!scale.current) return
            
        const monthcode = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC']
        const isEven = num => ((num % 2) == 0) ? true : false;


        let day, month, hour, year = 0
        let lastday =0
        let lastmonth = 0
        let lastyear = 0
        let lasthour = 0
        let tics = []    
        let putyear = (_zoom < 1000*60*60*24*30*10)
        let putmonth = (_zoom < 1000*60*60*24*5)
        let putday = (_zoom < 1000*60*60*2)
        let putevenhour = (_zoom < 1000*60*20)
        let puthour = (_zoom < 1000*60*8)
        // console.log('  zoom: '+((_zoom*10)/(1000*60*60*24) ) +'  puthour: '+puthour+'  putday: '+putday+'  putmonth: '+putmonth+'  putevenhour: '+putevenhour)
        let lastpos = 0
        for ( let i=0 ; i < scale.current.offsetHeight ; i+=1 ) {
            let refdate = new Date( (i- scale.current.offsetHeight/2) * _zoom + _start.getTime()  )
            day = refdate.getUTCDate()
            month = monthcode[refdate.getUTCMonth()]
            hour = refdate.getUTCHours()
            year = refdate.getUTCFullYear()

            if (putevenhour) {
                if(hour != lasthour) {
                    if (hour != 0 &&  (isEven(hour) || puthour)) {
                        tics.push({class:'HourTic', pos: i, label: hour})
                    } else  {
                        if (hour == 0) {
                            tics.push({class:'DayTic', pos: i, label: day})
                            tics.push({class:'MonthTic', pos: i, label: month})
                            tics.push({class:'YearTic', pos: i, label: year})            
                        }
                    }
                }
    
            } else if (putday) {
                if(day !== lastday) {
                    if (day != 1) {
                        tics.push({class:'DayTic', pos: i, label: day})
                    } else {
                        tics.push({class:'DayTic', pos: i, label: day})
                        tics.push({class:'MonthTic', pos: i, label: month})
                        tics.push({class:'YearTic', pos: i, label: year})
                     }
                    
                }
    
            } else if (putmonth) {
                if(month !== lastmonth && lastday!=0 && putmonth) {
                    if (month !== 'JAN') {
                        tics.push({class:'MonthTic', pos: i, label: month})
                    } else {
                        tics.push({class:'MonthTic', pos: i, label: month})
                        tics.push({class:'YearTic', pos: i, label: year})
                    }
                }
    
            } else if (putyear) {
                if(year !== lastyear && lastmonth !== 0 ) {
                    if (month !== 'JAN') {
                        tics.push({class:'MonthTic', pos: i, label: month})
                    } else {
                        // tics.push({class:'MonthTic', pos: i, label: month})
                        tics.push({class:'YearTic', pos: i, label: year})
                    }
                }
    
            }

            lastday = day
            lastyear = year
            lastmonth = month
            lasthour = hour
        }
        
        return tics.map(item => (            <div className={item.class} key={item.class+item.pos} style={{top:item.pos}}>{item.label}</div>))
    }

    // useLayoutEffect(() => {
    //     setTimescale(scaleText(date,zoomfactor))
    // },[date,zoomfactor])


    const [{ dater, zoomer }, set] = useSpring(() => ({ dater: date.getTime(), zoomer: zoomfactor}))
    useLayoutEffect(() => {
        // console.log('zoomfactor: '+zoomfactor+'  to: '+date.toJSON())
        
        set({ 
            to: {
                zoomer: zoomfactor, 
                dater: date.getTime()
            },
            config: {  duration: 400},
            immediate: false,
            onFrame: ()=>{
                // console.log(zoomer.value+'/ '+(new Date(dater.value)).toJSON())
                // setTimescale(scaleText(new Date(dater.value),zoomer.value))
                setTimescale(scaleText(new Date(dater.value),zoomer.value))
            }
        })

    },[ zoomfactor])

    useLayoutEffect(() => {
        // console.log('zoomfactor: '+zoomfactor+'  to: '+date.toJSON())
        
        set({ 
            to: {
                zoomer: zoomfactor, 
                dater: date.getTime()
            },
            config: {  duration: 400},
            immediate: immediate,
            onFrame: ()=>{
                // console.log(zoomer.value+'/ '+(new Date(dater.value)).toJSON())
                // setTimescale(scaleText(new Date(dater.value),zoomer.value))
                setTimescale(scaleText(new Date(dater.value),zoomer.value))
            }
        })

    },[date])


    return (
        <animated.div ref={scale} className='DateSelectorScale' >
            {timescale}
        </animated.div>
    )
}
export default DateSelectorScale
