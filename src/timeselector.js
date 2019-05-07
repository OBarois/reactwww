import React, { useState, useEffect, useRef } from "react"
import {useSpring, animated, config} from 'react-spring'
import { useGesture } from 'react-with-gesture'
import './timeselector.css'
import { setGlobal, useGlobal } from 'reactn'

// to be split in a controller and a useTouchScale hook () => {<TouchScale>, scaleRenderer, size}

//easeLinear,easeQuad,easeQuadIn,easeQuadOut,easeQuadInOut,easeCubic,easeCubicIn,easeCubicOut,easeCubicInOut,easePoly,easePolyIn,easePolyOut,easePolyInOut,easeSin,
//easeSinIn,easeSinOut,easeSinInOut,easeExp,easeExpIn,easeExpOut,easeExpInOut,easeCircle,easeCircleIn,easeCircleOut,easeCircleInOut,easeBounce,easeBounceIn,easeBounceOut,
//easeBounceInOut,easeBack,easeBackIn,easeBackOut,easeBackInOut,easeElastic,easeElasticIn,easeElasticOut,easeElasticInOut
import { easeSinOut  as easeeffect} from 'd3-ease'



function TimeSelector(props)  {
    //console.log("Render TimeSelector ")

    const zoomfactor = 800000
    const min = props.min
    const max = min +((props.max - props.min) / zoomfactor)

    const timecontainer = useRef()
    
    
    const vertical = props.direction=="vertical"?true:false

    const wid = max - min
    const [appdate, setAppdate] = useGlobal('appdate')
    const [searchdate, setSearchdate] = useGlobal('searchdate')
    const [finalPosition, setFinalposition] = useState(appdate)
    const [livePosition, setLiveposition] = useState(appdate)

    const [{ xy,pos }, set] = useSpring(() => ({ xy: [0, 0], pos: 0 }))

    const [active, setActive] = useState(false); 

    const bind = useGesture(({ down, delta, velocity, target , temp = xy.getValue()}) => {
        //setActive(true)
        if (!down) console.log('velocity: '+velocity+' delta: '+delta[0])

        let springConfigUp = { mass: 1, tension: 200 , friction: 40, precision: 1 }
        let springConfigDown = { mass: 1, tension: 1200 , friction: 40, precision: 1 }
        //let springConfigUp = { easing: easeeffect ,duration: 10+velocity*100, precision: 1 }
        //let springConfigDown = { easing: easeeffect ,duration: 10, precision: 1 }
        //let swipefactor = (velocity<1?1:velocity*6)
        let swipefactor = 1

        //const runBefore = () => {setActive(active)}        
        const runBefore = () => {setActive(true)}        
        if(vertical) {    
            let pos = target.getBoundingClientRect().top
            let topOrigin = target.parentNode.getBoundingClientRect().top
            let height = target.parentNode.getBoundingClientRect().height
            let scaleheight = target.getBoundingClientRect().height
            let fardelta = delta[1] + delta[1] * Math.pow(velocity,2)
            let dest = (pos+delta[1]+temp[1]>=topOrigin+height)?Math.min(height/2,delta[1]+temp[1]):delta[1]+temp[1]
            //tbd: 400 is the height of widget
            dest = (pos+delta[1]+temp[1]< -scaleheight+height)?Math.max(-1*(max-min-height/2),delta[1]+temp[1]):dest
            const setLiveTime = ({ xy }) => {setLiveposition(min+(-xy[1]+height/2)*zoomfactor)}
            const setFinalTime = () => {setActive(down); setFinalposition(min+(-dest+height/2)*zoomfactor)}                
            set({ xy: down ? [0,delta[1]+temp[1]] : [0,dest], pos: pos, config: down?springConfigDown:springConfigUp, onRest: setFinalTime, onFrame: setLiveTime, onStart: runBefore } )
            //set({ xy: down ? [0,delta[1]+temp[1]] : [0,dest], pos: pos, config: { mass: velocity, tension: 500 * velocity, friction: 10, precision: 1 }, onRest: setFinalTime, onFrame: setLiveTime } )
        } else {    
            let pos = target.getBoundingClientRect().left
            let leftOrigin = target.parentNode.getBoundingClientRect().left
            let width = target.parentNode.getBoundingClientRect().width
            console.log('width: '+width)
            let scalewidth = target.getBoundingClientRect().width
            //console.log(leftOrigin+"/width: "+width+" /max-min: "+(max-min)+" /scalewidth: "+scalewidth+" /wid: "+wid)
            let fardelta = delta[0] + delta[0] * Math.pow(velocity,2)
            //console.log(swipefactor)
            let dest = (pos+fardelta+temp[0]>=leftOrigin+width/2)?Math.min(width/2,fardelta+temp[0]):fardelta+temp[0]
            //let dest = (pos+fardelta+temp[0]>=leftOrigin-width/2)?leftOrigin-width/2:fardelta+temp[0]
            dest = (pos+fardelta+temp[0]<= -scalewidth-width/2)?Math.max(-1*(max-min-width/2),fardelta+temp[0]):dest
            const setLiveTime = ({ xy }) => {setLiveposition(min+(-xy[0]+width/2)*zoomfactor)}
            const setFinalTime = () => {setActive(down); setFinalposition(min+(-dest+width/2)*zoomfactor)}                
            set({ xy: down ? [delta[0]+temp[0],0] : [dest,0], pos: pos, config: down?springConfigDown:springConfigUp, onRest: setFinalTime, onFrame: setLiveTime, onStart: runBefore } )
            //set({ xy: down ? [delta[0]+temp[0],0] : [dest,0], pos: pos, config: {  tension: 1200 , friction: 40, precision: 1 }, onRest: setFinalTime, onFrame: setLiveTime, onStart: runBefore } )
            //set({ xy: down ? [delta[0]+temp[0],0] : [dest,0], pos: pos, config: { mass: velocity, tension: 500 * velocity, friction: 10, precision: 1 }, onRest: setFinalTime, onFrame: setLiveTime } )
        }
        return temp    
    })

    

    const scaleTextold = (min,max) => {
        let text = ''
        for (let i=min;i<=max;i++) {
            text += i +"   "
        }
        return text
    }
    const scaleText = (min,max) => {
        let monthcode = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
        let day, month, hour, year = 0
        let lastday, lastmonth, lasthour, lastyear = 0
        let tics = []
        let days = []
        //console.log(day)
        for (let i=props.min;i<=props.max;i+=60000) {
            day = (new Date(i)).getUTCDate()
            month = monthcode[(new Date(i)).getUTCMonth()]
            hour = (new Date(i)).getUTCHours()
            year = (new Date(i)).getUTCFullYear()
            if(day != lastday) tics.push({class:'DayTic', pos: (i-props.min)/zoomfactor, label: day})
            if(month != lastmonth) {
                tics.push({class:'MonthTic', pos: (i-props.min)/zoomfactor, label: month})
                tics.push({class:'YearTic', pos: (i-props.min)/zoomfactor, label: year})
            }
            //if(year != lastyear) tics.push({class:'YearTic', pos: (i-props.min)/zoomfactor, label: year})
            //if(hour != lasthour) tics.push({class:'HourTic', pos: (i-props.min)/zoomfactor, label: '.'})
            lastday = day
            lastmonth = month
            lasthour = hour
            lastyear = year
        }
            console.log(tics.map(item => (            <div className={item.class} left={item.class+item.pos}>{item.label}</div>)))
        return tics.map(item => (            <div className={item.class} key={item.class+item.pos} style={{left:item.pos}}>{item.label}</div>))
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
    useEffect(() => {
        //console.log("useEffect (livePosition) in TimeSelector: "+livePosition)
        setTimescale(scaleText(2000,3000))
    },[])

 
    useEffect(() => {
        //console.log("useEffect (livePosition) in TimeSelector: "+livePosition)
        if(active) setAppdate(livePosition)
    },[livePosition])

    useEffect(() => {     
        if(!active) {
            let offset = ((min - appdate)/zoomfactor)+timecontainer.current.parentElement.offsetWidth/2
            //console.log('wid: ')
            //console.log(timecontainer.current.parentElement.offsetWidth)
            //set({ xy: vertical?[0,offset]:[offset,0], config: { mass: 1, tension: 120 , friction: 14, precision: 1 } } )
            set({ xy: vertical?[0,offset]:[offset,0], config: { tension: 1200, friction: 40 }, onFrame: null }  )
        }
    },[appdate])

    useEffect(() => {
        //console.log("useEffect (finalPosition) in TimeSelector: "+finalPosition+'  '+active)
        if(!active) setSearchdate(finalPosition)
    },[finalPosition])

    /*
    useEffect(() => {
        //console.log("Time selector Active: "+active)   
    },[active]);
*/
    return (
    <div className="TimeContainer" ref={timecontainer}>
        <div className="Mire" ></div>
        <animated.div className="TimeScale" {...bind()} style={{ width: wid,height: wid, transform: xy.interpolate((x, y) => `translate3d(${x}px,${y}px,0)`) }}>
            {timescale}
        </animated.div>
    </div>
    )
}

export default TimeSelector