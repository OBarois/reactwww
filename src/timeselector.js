import React, { useState, useEffect, useLayoutEffect, useRef } from "react"
import {useSpring, animated, config} from 'react-spring'
import { useGesture } from 'react-with-gesture'
import './timeselector.css'
import { setGlobal, useGlobal } from 'reactn'
import dateFormat from "dateformat"


// to be split in a controller and a useTouchScale hook () => {<TouchScale>, scaleRenderer, size}

//easeLinear,easeQuad,easeQuadIn,easeQuadOut,easeQuadInOut,easeCubic,easeCubicIn,easeCubicOut,easeCubicInOut,easePoly,easePolyIn,easePolyOut,easePolyInOut,easeSin,
//easeSinIn,easeSinOut,easeSinInOut,easeExp,easeExpIn,easeExpOut,easeExpInOut,easeCircle,easeCircleIn,easeCircleOut,easeCircleInOut,easeBounce,easeBounceIn,easeBounceOut,
//easeBounceInOut,easeBack,easeBackIn,easeBackOut,easeBackInOut,easeElastic,easeElasticIn,easeElasticOut,easeElasticInOut
import { easeSinOut  as easeeffect} from 'd3-ease'



function TimeSelector(props)  {
    //console.log("Render TimeSelector ")
    const dayspace = 20
    const zoomfactor = (props.max-props.min)/(dayspace*(props.max-props.min)/(1000*60*60*24))
    const min = props.min
    const max = min +((props.max - props.min) / zoomfactor)

    const timecontainer = useRef()
    
    

    let wid, hei = 0
    if(props.vertical) {
        hei = max - min
        wid = 100
    } else {
        wid = max - min
        hei = 100

    }

    const [appdate, setAppdate] = useGlobal('appdate')
    const [searchdate, setSearchdate] = useGlobal('searchdate')
    const [finalPosition, setFinalposition] = useState(appdate)
    const [livePosition, setLiveposition] = useState(appdate)

    const [{ xy,pos }, set] = useSpring(() => ({ xy: [0, 0] }))

    const [active, setActive] = useState(false); 

    const myvertical = useRef()
    myvertical.current = props.vertical

    const bind = useGesture(({  down, delta, velocity, target , time, first, last, temp = {xy: xy.getValue(), startTime: time}}) => {
        

        let springConfigUp = { mass: 1, tension: 200 , friction: 40, precision: 1 }
        let springConfigDown = { mass: 1, tension: 1200 , friction: 40, precision: 1 }
        //let springConfigUp = { easing: easeeffect ,duration: 10+velocity*100, precision: 1 }
        //let springConfigDown = { easing: easeeffect ,duration: 10, precision: 1 }
        //console.log('velocity: '+velocity)
        //console.log('velocity: '+velocity)
        //velocity = (velocity<.1)?0:velocity
        const runBefore = () => {setActive(true)} 
        /*
        console.log('time: '+(time - temp.startTime)  )     
        if( down && time - temp.startTime  >3000 ) {
            console.log('zoom!!') 
            setTimescale(scaleText(props.vertical))     
        }
        */
        if (down) console.log('delta: '+delta[0])
        
        if(myvertical.current) {    
            let pos = target.getBoundingClientRect().top
            let topOrigin = target.parentNode.getBoundingClientRect().top
            let height = timecontainer.current.parentElement.offsetHeight
            let scaleheight = target.getBoundingClientRect().height

            //let followDest = (delta[0]<-200)?delta[1]*10+temp.xy[1]:delta[1]+temp.xy[1]
            let step = 0
            if (delta[0]<-100) step = (1000 * 60 * 60 * 24)  / zoomfactor
            if (delta[0]<-200) step = (1000 * 60 * 60 * 24 * 30) / zoomfactor
            console.log('step: '+step+' '+delta[1]+' velo: '+velocity)

            let followDest = (delta[0]<-100)?Math.round(delta[1]/10)*step+temp.xy[1]:delta[1]+temp.xy[1]
            console.log('followDest: '+followDest)
            
            let fardelta = (delta[0]<-100) ?  Math.round(delta[1]/10)*step + (step * Math.pow(velocity+1,3))*velocity  : delta[1] + (delta[1] * Math.pow(velocity+1,3))*velocity
            console.log('fardelta: '+fardelta)
            let dest = (pos+fardelta+temp.xy[1]>=topOrigin+height/2)?Math.min(height/2,fardelta+temp.xy[1]):fardelta+temp.xy[1]
            dest = (pos+fardelta+temp.xy[1]<= -scaleheight+height/2)?Math.max(-1*(max-min-height/2),fardelta+temp.xy[1]):dest




            const setLiveTime = ({ xy }) => { setLiveposition(min+(-xy[1]+height/2)*zoomfactor)}
            const setFinalTime = () => {if(!down) {setFinalposition(min+(-dest+height/2)*zoomfactor); setActive(false)}}   
            set({ xy: down ? [0,followDest] : [0,dest],  config: down?springConfigDown:springConfigUp, onRest: setFinalTime, onFrame: setLiveTime, onStart: runBefore } )
            //set({ xy: down ? [0,delta[1]+temp.xy[1]] : [0,dest], pos: pos, config: { mass: velocity, tension: 500 * velocity, friction: 10, precision: 1 }, onRest: setFinalTime, onFrame: setLiveTime } )
        } else {    
            let pos = target.getBoundingClientRect().left
            let leftOrigin = target.parentNode.getBoundingClientRect().left
            let width = timecontainer.current.parentElement.offsetWidth
            let scalewidth = target.getBoundingClientRect().width
            //console.log(leftOrigin+"/width: "+width+" /max-min: "+(max-min)+" /scalewidth: "+scalewidth+" /wid: "+wid)
            let fardelta = delta[0] + delta[0] * Math.pow(velocity,2)
            //console.log(swipefactor)
            //let dest = (pos+fardelta+temp.xy[0]>=leftOrigin+width/2)?Math.min(width/2,fardelta+temp.xy[0]):fardelta+temp.xy[0]
            let dest = (pos+fardelta+temp.xy[0]>=leftOrigin-width/2)?Math.min(width/2,fardelta+temp.xy[0]):fardelta+temp.xy[0]
            dest = (pos+fardelta+temp.xy[0]<= -scalewidth-width/2)?Math.max(-1*(max-min-width/2),fardelta+temp.xy[0]):dest
            const setLiveTime = ({ xy }) => {setLiveposition(min+(-xy[0]+width/2)*zoomfactor)}
            const setFinalTime = () => {if(!down) {setFinalposition(min+(-dest+width/2)*zoomfactor); setActive(false)}}                
            set({ xy: down ? [delta[0]+temp.xy[0],0] : [dest,0], config: down?springConfigDown:springConfigUp, onRest: setFinalTime, onFrame: setLiveTime, onStart: runBefore } )
            //set({ xy: down ? [delta[0]+temp.xy[0],0] : [dest,0], pos: pos, config: {  tension: 1200 , friction: 40, precision: 1 }, onRest: setFinalTime, onFrame: setLiveTime, onStart: runBefore } )
            //set({ xy: down ? [delta[0]+temp.xy[0],0] : [dest,0], pos: pos, config: { mass: velocity, tension: 500 * velocity, friction: 10, precision: 1 }, onRest: setFinalTime, onFrame: setLiveTime } )
        }
        return temp    
    })

    

    const scaleText = () => {
        
        let monthcode = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
        let day, month, hour, year = 0
        let lastday, lastmonth, lasthour, lastyear = 0
        let tics = []
        const dayclass = (!props.vertical)?'DayTic':'DayTic-v'
        const monthclass = (!props.vertical)?'MonthTic':'MonthTic-v'
        const yearclass = (!props.vertical)?'YearTic':'YearTic-v'
        
        
        for (let i=props.min;i<=props.max;i+=60000) {
            day = (new Date(i)).getUTCDate()
            month = monthcode[(new Date(i)).getUTCMonth()]
            hour = (new Date(i)).getUTCHours()
            year = (new Date(i)).getUTCFullYear()
            if(day != lastday) tics.push({class:dayclass, pos: (i-props.min)/zoomfactor, label: day})
            /*
            if(month != lastmonth) {
                tics.push({class:monthclass, pos: (i-props.min)/zoomfactor, label: month})
                tics.push({class:yearclass, pos: (i-props.min)/zoomfactor, label: year})
            }
            */
            //if(year != lastyear) tics.push({class:'YearTic', pos: (i-props.min)/zoomfactor, label: year})
            //if(hour != lasthour) tics.push({class:'HourTic', pos: (i-props.min)/zoomfactor, label: '.'})
            lastday = day
            lastmonth = month
            lasthour = hour
            lastyear = year
        }

            return tics.map(item => (            <div className={item.class} key={item.class+item.pos} style={(!props.vertical)?{left:item.pos}:{top:item.pos}}>{item.label}</div>))
            /*
        let text = ''
        for (let i=min;i<=max;i++) {
            text += i +"   "
        }
        console.log(tics)
        return text  
        */      
    }

    const [timescale, setTimescale] = useState('')    
    //const [vertical, setVertical] = useState(props.vertical)    
    useLayoutEffect(() => {
        //console.log("useEffect (livePosition) in TimeSelector: "+livePosition)
        setTimescale(scaleText(props.vertical))
    
    },[props.vertical])

    const [year, setYear] = useState('') 
    const [month, setMonth] = useState('') 
    const [day, setDay] = useState('') 
    const [time, setTime] = useState('') 

    useEffect(()=> {

    },[])
    useEffect(() => {
        let date
        try {
            date = new Date(livePosition)
        } catch {
            date = 0
        }
        setYear(date.getUTCFullYear())
        setMonth(dateFormat(date,'UTC:mmm'))
        setDay(dateFormat(date,'UTC:dd'))
        setTime(dateFormat(date,'UTC:HH:MM:ss'))        
        setAppdate(livePosition)
    },[livePosition])

    useLayoutEffect(() => {     
        let offset =0
        if(!active) {
            if(props.vertical) {
                offset = ((min - appdate)/zoomfactor)+timecontainer.current.parentElement.offsetHeight/2
                set({ xy: [0,offset], config: { tension: 1200, friction: 40 }, onFrame: null }  )
            } else {
                offset = ((min - appdate)/zoomfactor)+timecontainer.current.parentElement.offsetWidth/2
                set({ xy: [offset,0], config: { tension: 1200, friction: 40 }, onFrame: null }  )

            }
/*
            let offset = ((min - appdate)/zoomfactor)+(!props.vertical?timecontainer.current.parentElement.offsetWidth/2:timecontainer.current.parentElement.offsetHeight/2)
            //console.log('wid: ')
            //console.log(timecontainer.current.parentElement.offsetWidth)
            //set({ xy: vertical?[0,offset]:[offset,0], config: { mass: 1, tension: 120 , friction: 14, precision: 1 } } )
            if(props.vertical)
            set({ xy: props.vertical?[0,offset]:[offset,0], config: { tension: 1200, friction: 40 }, onFrame: null }  )
            */
           let date = new Date(appdate)
           setYear(date.getUTCFullYear())
           setMonth(dateFormat(date,'UTC:mmm'))
           setDay(dateFormat(date,'UTC:dd'))
           setTime(dateFormat(date,'UTC:HH:MM:ss'))
   
            
        }
    },[appdate,timescale])

    useEffect(() => {
        console.log("useEffect (finalPosition) in TimeSelector: "+finalPosition+'  '+active)
        //if(!active) setSearchdate(finalPosition)
        setSearchdate(finalPosition)
    },[finalPosition])

    useLayoutEffect(() => {
        console.log("zoom changed to: "+props.zoom)
    },[props.zoom])

    /*
    useEffect(() => {
        //console.log("Time selector Active: "+active)   
    },[active]);


                <div className={props.vertical?"FixedLabel-v":"FixedLabel"} >
                <div className='DayLabel' key='day' >{day}</div>
                <div className='YearLabel' key='year' >{year}</div>
                <div className='MonthLabel' key='month' >{month}</div>
                <div className='TimeLabel' key='time' >{time}</div>
            </div>

*/
    return (
        <div className={props.vertical?"Mask-v":"Mask"} >
            <div className={props.vertical?"Mire-v":"Mire"} ></div>
            <div className="TimeContainer" ref={timecontainer}>
                
                <animated.div className="TimeScale" {...bind()} style={{ width: wid,height: hei, transform: xy.interpolate((x, y) => `translate3d(${x}px,${y}px,0)`) }}>
                    {timescale}
                </animated.div>
            </div>
        </div>
    )
}

export default TimeSelector