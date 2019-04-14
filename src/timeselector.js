import React, { useState, useEffect, useRef } from "react"
import {useSpring, animated, config} from 'react-spring'
import { useGesture } from 'react-with-gesture'
import './timeselector.css'
import { setGlobal, useGlobal } from 'reactn'
import ReactDOM from 'react-dom'
import useDimensions from './useDimensions'

// to be split in a controller and a useTouchScale hook () => {<TouchScale>, scaleRenderer, size}

function TimeSelector(props)  {
    const zoom = 100000
    const min = props.min
    const max = min +((props.max - props.min) / zoom)
    const factor = (props.max-props.min)/(max-min)
    const vertical = props.direction=="vertical"?true:false

    const wid = max - min
    const [finalPosition, setFinalposition] = useState(0)
    const [livePosition, setLiveposition] = useState(0)
    const [posscale, setPosscale] = useState(0);
    const [appdate, setAppdate] = useGlobal({appdate: new Date()})

    const component = useRef(null)
    const [{ xy,pos }, set] = useSpring(() => ({ xy: [0, 0], pos: 0 }))

    const bind = useGesture(({ down, delta, velocity, target , temp = xy.getValue()}) => {
        if(vertical) {    
            let pos = target.getBoundingClientRect().top
            let topOrigin = target.parentNode.getBoundingClientRect().top
            let height = target.parentNode.getBoundingClientRect().height
            let scaleheight = target.getBoundingClientRect().height
            let dest = (pos+delta[1]+temp[1]>=topOrigin+height)?Math.min(height/2,delta[1]+temp[1]):delta[1]+temp[1]
            //tbd: 400 is the height of widget
            dest = (pos+delta[1]+temp[1]<-scaleheight+height)?Math.max(-1*(max-min-height/2),delta[1]+temp[1]):dest
            const setLiveTime = ({ xy }) => {setLiveposition(min+(-xy[1]+height/2)*factor)}
            const setFinalTime = () => {setFinalposition(min+(-dest+height/2)*factor)}                
            set({ xy: down ? [0,delta[1]+temp[1]] : [0,dest], pos: pos, config: { mass: 1, tension: 120 , friction: 14, precision: 1 }, onRest: setFinalTime, onFrame: setLiveTime } )
        } else {    
            let pos = target.getBoundingClientRect().left
            let leftOrigin = target.parentNode.getBoundingClientRect().left
            let width = target.parentNode.getBoundingClientRect().width
            let scalewidth = target.getBoundingClientRect().width
            //console.log(leftOrigin+"/width: "+width+" /max-min: "+(max-min)+" /scalewidth: "+scalewidth+" /wid: "+wid)
            setPosscale(pos)
            let dest = (pos+delta[0]+temp[0]>=leftOrigin+width)?Math.min(width/2,delta[0]+temp[0]):delta[0]+temp[0]
            dest = (pos+delta[0]+temp[0]<-scalewidth-width/2)?Math.max(-1*(max-min-width/2),delta[0]+temp[0]):dest
            const setLiveTime = ({ xy }) => {setLiveposition(min+(-xy[0]+width/2)*factor)}
            const setFinalTime = () => {setFinalposition(min+(-dest+width/2)*factor)}                
            set({ xy: down ? [delta[0]+temp[0],0] : [dest,0], pos: pos, config: { mass: 1, tension: 120 , friction: 14, precision: 1 }, onRest: setFinalTime, onFrame: setLiveTime } )
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
        //console.log("init selector")
        setGlobal({appdate: new Date(livePosition)})
    },[livePosition]);

    return (
    <div className="TimeContainer" >
        <animated.div className="TimeScale" {...bind()} style={{ width: wid,height: wid, transform: xy.interpolate((x, y) => `translate3d(${x}px,${y}px,0)`) }}>
            {scaleText(2000,2200)}
        </animated.div>
    </div>
    )
}

export default TimeSelector