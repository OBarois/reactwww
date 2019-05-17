import React, { useState, useEffect, useLayoutEffect, useRef } from "react"
import {useSpring, animated, config} from 'react-spring'
import { useGesture } from 'react-use-gesture'
import './timeselector.css'
import { useGlobal } from 'reactn'
import { add, sub, scale } from 'vec-la'


// to be split in a controller and a useTouchScale hook () => {<TouchScale>, scaleRenderer, size}




function TimeSelector(props)  {
    //console.log("Render TimeSelector ")
    const dayspace = 40
    const zoomfactor = (props.max-props.min)/(dayspace*(props.max-props.min)/(1000*60*60*24))
    const min = props.min
    const max = min +((props.max - props.min) / zoomfactor)

    

    let wid, hei = 0
    if(props.vertical) {
        hei = max - min
        wid = 100
    } else {
        wid = max - min
        hei = 100

    }

    const [appdate, setAppdate] = useGlobal('appdate')
    const [, setSearchdate] = useGlobal('searchdate')
    const [livePosition, setLiveposition] = useState(new Date())

    const [active, setActive] = useState(false); 



    const myvertical = useRef()
    myvertical.current = props.vertical


    const timecontainer = useRef()

    const [{ xy }, set] = useSpring(() => ({ xy: [0, 0] }))


    const bind = useGesture({
        onDrag: ({  down, delta, velocity, target , direction, wheeling, time, first, last, temp = {xy: xy.getValue(), deltaOffset: [0,0], lastNewxy: [0,0],deltaFactor: [1,1], lastStep: 1, lastIncrement: 0 }}) => {
            let springConfigUp = { mass: 1, tension: 200 , friction: 40, precision: 1 }
            let springConfigDown = { mass: 1, tension: 1200 , friction: 40, precision: 0.01 }
            let config = {  velocity: scale(direction, velocity), decay: true, precision: 1 }

            velocity = (velocity<.15)?0:velocity
            const runBefore = () => {setActive(true)} 
           
            if(myvertical.current) {    
                //let pos = target.getBoundingClientRect().top
                let height = timecontainer.current.parentElement.offsetHeight

                //let followDest = (delta[0]<-200)?delta[1]*10+temp.xy[1]:delta[1]+temp.xy[1]
                let step = 1
                let div = 1
                if (delta[0]<-30) {step = (1000 * 60 * 60 * 24)  / zoomfactor; div = 10}
                if (delta[0]<-80) {step = (1000 * 60 * 60 * 24 * 30) / zoomfactor; div = 15}
                if (delta[0]<-130) {step = (1000 * 60 * 60 * 24 * 365) / zoomfactor; div = 40}

                if(step !== temp.lastStep) {
                    console.log('Step changed from: '+temp.lastStep+' to: '+ step)
                    temp.deltaOffset = delta
                    temp.xy = temp.lastNewxy
                }

                delta = sub(delta,temp.deltaOffset)
                let deltaFactor = [Math.round(delta[0]/div)*step,Math.round(delta[1]/div)*step]
                if(down) velocity = 0
                let newxy = add(scale(deltaFactor,Math.pow(velocity+1,2.5)), temp.xy)

                if(step !== temp.lastStep) {
                    temp.xy = newxy
                    temp.lastStep = step
                }

                temp.lastNewxy = newxy
                
                const setLiveTime = ({ xy }) => { setLiveposition(min+(-xy[1]+height/2)*zoomfactor)}
                const setFinalTime = ({ xy }) => {  setActive(false); if(!down) { setSearchdate(min+(-xy[1]+height/2)*zoomfactor) }}  

                let minX = timecontainer.current.parentElement.offsetTop + timecontainer.current.parentElement.offsetHeight / 2
                let maxX = - timecontainer.current.offsetHeight + timecontainer.current.parentElement.offsetHeight / 2
        
                newxy[1] = newxy[1]>minX ? minX : newxy[1]
                newxy[1] = newxy[1]<maxX ? maxX : newxy[1]

                set({  xy: newxy ,   config: down?springConfigDown:springConfigUp, immediate: down, onRest: setFinalTime, onFrame: setLiveTime, onStart: runBefore } )

            } else {    
            }
            return temp
        }
    })

    

    const scaleText = () => {
        
        let monthcode = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
        let day, month, hour, year = 0
        let lastday, lastmonth = 0
        let tics = []
        const dayclass = (!props.vertical)?'DayTic':'DayTic-v'
        const monthclass = (!props.vertical)?'MonthTic':'MonthTic-v'
        const yearclass = (!props.vertical)?'YearTic':'YearTic-v'
        
        
        for (let i=props.min;i<=props.max;i+=3600000) {
            day = (new Date(i)).getUTCDate()
            month = monthcode[(new Date(i)).getUTCMonth()]
            hour = (new Date(i)).getUTCHours()
            year = (new Date(i)).getUTCFullYear()
            if(day !== lastday) tics.push({class:dayclass, pos: (i-props.min)/zoomfactor, label: day})
            if(month !== lastmonth ) {
                tics.push({class:monthclass, pos: (i-props.min)/zoomfactor, label: month})
                tics.push({class:yearclass, pos: (i-props.min)/zoomfactor, label: year})
            }
            //if(year != lastyear) tics.push({class:'YearTic', pos: (i-props.min)/zoomfactor, label: year})
            //if(hour != lasthour) tics.push({class:'HourTic', pos: (i-props.min)/zoomfactor, label: '.'})
            lastday = day
            lastmonth = month
        }

            return tics.map(item => (            <div className={item.class} key={item.class+item.pos} style={(!props.vertical)?{left:item.pos}:{top:item.pos}}>{item.label}</div>))
    }

    const [timescale, setTimescale] = useState('')    
    //const [vertical, setVertical] = useState(props.vertical)    
    useLayoutEffect(() => {
        //console.log("useEffect (livePosition) in TimeSelector: "+livePosition)
        setTimescale(scaleText(props.vertical))
    
    },[props.vertical])


    


    useLayoutEffect(() => {     
        let offset =0
        if(!active) {
            if(props.vertical) {
                offset = ((min - appdate)/zoomfactor)+timecontainer.current.parentElement.offsetHeight/2
                set({ xy: [0,offset], config: { tension: 1200, friction: 40 }, onFrame: null, onRest: null }  )
            } else {
                offset = ((min - appdate)/zoomfactor)+timecontainer.current.parentElement.offsetWidth/2
                set({ xy: [offset,0], config: { tension: 1200, friction: 40 }, onFrame: null, onRest: null }  )

            }
   
            
        }
    },[appdate,timescale])  

    useEffect(() => {
        setAppdate(livePosition)
    },[livePosition])


    useLayoutEffect(() => {
        console.log("zoom changed to: "+props.zoom)
    },[props.zoom])

    return (
        <div className={props.vertical?"Mask-v":"Mask"} >
            
            <div className="TriangleContainer" >
                <svg height="40" width="20" className="Triangle">
                    <polygon points="20,5 20,35 12,20" />   
                </svg> 
            </div>        
            <div className="TimeContainer" ref={timecontainer}>
                
                <animated.div className="TimeScale" {...bind()} style={{ width: wid,height: hei, transform: xy.interpolate((x, y) => `translate3d(0px,${y}px,0)`) }}>
                    {timescale}
                </animated.div>
            </div>
        </div>
    )
}

export default TimeSelector