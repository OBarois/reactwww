import React, { useState, useEffect, useRef } from "react"
import {useSpring, animated, config} from 'react-spring'
import { useGesture } from 'react-with-gesture'
import './timeselector.css'
import { setGlobal, useGlobal } from 'reactn'

// to be split in a controller and a useTouchScale hook () => {<TouchScale>, scaleRenderer, size}




function TimeSelector(props)  {
    //console.log("Render TimeSelector ")

    const zoomfactor = 100000
    const min = props.min
    const max = min +((props.max - props.min) / zoomfactor)

    //const scaleRef = useRef()
    
    
    const vertical = props.direction=="vertical"?true:false

    const wid = max - min
    const [appdate, setAppdate] = useGlobal('appdate')
    const [finalPosition, setFinalposition] = useState(appdate)
    const [livePosition, setLiveposition] = useState(appdate)

    const [{ xy,pos }, set] = useSpring(() => ({ xy: [0, 0], pos: 0 }))

    const [active, setActive] = useState(false); 

    const bind = useGesture(({ down, delta, velocity, target , temp = xy.getValue()}) => {
        //setActive(true)
        //console.log('active: '+active)

        const runBefore = () => {setActive(true)}        
        if(vertical) {    
            let pos = target.getBoundingClientRect().top
            let topOrigin = target.parentNode.getBoundingClientRect().top
            let height = target.parentNode.getBoundingClientRect().height
            let scaleheight = target.getBoundingClientRect().height
            let dest = (pos+delta[1]+temp[1]>=topOrigin+height)?Math.min(height/2,delta[1]+temp[1]):delta[1]+temp[1]
            //tbd: 400 is the height of widget
            dest = (pos+delta[1]+temp[1]<-scaleheight+height)?Math.max(-1*(max-min-height/2),delta[1]+temp[1]):dest
            const setLiveTime = ({ xy }) => {setLiveposition(min+(-xy[1]+height/2)*zoomfactor)}
            const setFinalTime = () => {setFinalposition(min+(-dest+height/2)*zoomfactor);setActive(false)}                
            set({ xy: down ? [0,delta[1]+temp[1]] : [0,dest], pos: pos, config: { mass: 1, tension: 120 , friction: 14, precision: 1 }, onRest: setFinalTime, onFrame: setLiveTime, onStart: runBefore } )
            //set({ xy: down ? [0,delta[1]+temp[1]] : [0,dest], pos: pos, config: { mass: velocity, tension: 500 * velocity, friction: 10, precision: 1 }, onRest: setFinalTime, onFrame: setLiveTime } )
        } else {    
            let pos = target.getBoundingClientRect().left
            let leftOrigin = target.parentNode.getBoundingClientRect().left
            let width = target.parentNode.getBoundingClientRect().width
            let scalewidth = target.getBoundingClientRect().width
            //console.log(leftOrigin+"/width: "+width+" /max-min: "+(max-min)+" /scalewidth: "+scalewidth+" /wid: "+wid)
            let dest = (pos+delta[0]+temp[0]>=leftOrigin+width)?Math.min(width/2,delta[0]+temp[0]):delta[0]+temp[0]
            dest = (pos+delta[0]+temp[0]<-scalewidth-width/2)?Math.max(-1*(max-min-width/2),delta[0]+temp[0]):dest
            const setLiveTime = ({ xy }) => {setLiveposition(min+(-xy[0]+width/2)*zoomfactor)}
            const setFinalTime = () => {setFinalposition(min+(-dest+width/2)*zoomfactor);setActive(false)}                
            set({ xy: down ? [delta[0]+temp[0],0] : [dest,0], pos: pos, config: { mass: 1, tension: 120 , friction: 14, precision: 1 }, onRest: setFinalTime, onFrame: setLiveTime, onStart: runBefore } )
            //set({ xy: down ? [delta[0]+temp[0],0] : [dest,0], pos: pos, config: {  tension: 1200 , friction: 40, precision: 1 }, onRest: setFinalTime, onFrame: setLiveTime, onStart: runBefore } )
            //set({ xy: down ? [delta[0]+temp[0],0] : [dest,0], pos: pos, config: { mass: velocity, tension: 500 * velocity, friction: 10, precision: 1 }, onRest: setFinalTime, onFrame: setLiveTime } )
        }
        return temp    
    })

    

    const scaleText = (min,max) => {
        let text = ''
        for (let i=min;i<=max;i++) {
            text += i +"   "
        }
        return text
    }

    useEffect(() => {
        console.log("useEffect (livePosition) in TimeSelector: "+livePosition)
        if(active) setAppdate(livePosition)
    },[livePosition])

    useEffect(() => {
        if(!active) {
            let offset = ((min - appdate)/zoomfactor)+250
            //set({ xy: vertical?[0,offset]:[offset,0], config: { mass: 1, tension: 120 , friction: 14, precision: 1 } } )
            set({ xy: vertical?[0,offset]:[offset,0], config: { tension: 1200, friction: 40 }, onFrame: null }  )
        }
    },[appdate])

    useEffect(() => {
        //console.log("useEffect (finalPosition) in TimeSelector: "+finalPosition)
        setAppdate(finalPosition)
    },[finalPosition])

    useEffect(() => {
        //console.log("Active changed to: "+active)   
    },[active]);

    return (
    <div className="TimeContainer" >
        <animated.div className="TimeScale" {...bind()} style={{ width: wid,height: wid, transform: xy.interpolate((x, y) => `translate3d(${x}px,${y}px,0)`) }}>
            {scaleText(2000,2200)}
        </animated.div>
    </div>
    )
}

export default TimeSelector