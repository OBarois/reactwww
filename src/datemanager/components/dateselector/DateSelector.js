import React, {useState, useEffect, useLayoutEffect, useRef} from 'react'
import {useSpring, animated, config} from 'react-spring'
import { useGesture } from 'react-use-gesture'
import { add, sub, scale } from 'vec-la'
import DateSelectorScale from './DateSelectorScale'

import './DateSelector.css';
// import { start } from 'repl';

function DateSelector({startdate, onDateChange, onFinalDateChange}) {
    const STEPS = [ 1000*60*60 , 1000*60*10, 1000*60*1.8, 1000*27, 1000*60*60*24]

    const selector = useRef()
    const offset = useRef()
    if(!offset.current) offset.current = [0, 0 ]
    // offset.current = [0, 0 ]
    const reflastscaledate = useRef()
    const refscaledate = useRef()
    // refscaledate.current = startdate
    // offset.current=[0,0]
    
    const [scaledate, setScaledate ] = useState(startdate)
    const [lastStartdate, setlLastStartdate ] = useState(startdate)
    
    const [newstart, setNewstart ] = useState(startdate)
    // const [offset, setOffset ] = useState([0,0])
    // const [step, setStep ] = useState(1)
    const [active, setActive ] = useState(false)

    // zoomfactor: how long is a pixel in ms
    const [zoomfactor, setZoomfactor ] = useState(STEPS[0])
    const [scalezoom, setScalezoom ] = useState(zoomfactor)
    const [immediate, setImmediate ] = useState(false)


    const [{ xy }, set] = useSpring(() => ({ xy: [0,0] }))
    // console.log('just defined spring: '+ offset.current)
    if(!refscaledate.current) {
        console.log('reset refscaledate')
        refscaledate.current = startdate

    }

    const bind = useGesture({

        onDrag: ({  event, first, down, delta, velocity, direction, temp = {
            xy: xy.getValue(),
            laststeparea: 0,
            deltaoffset: [0,0]
            }
        }) => {
            let Xoffset = selector.current.parentElement.offsetWidth - (event.pageX?event.pageX:selector.current.parentElement.offsetWidth)
            // console.log(selector.current.parentElement.offsetWidth +'    '+event.pageX)
            let steparea = Math.min(STEPS.length-1,Math.floor((Xoffset-selector.current.offsetWidth)/100+1))
            // if (!steparea) { steparea = 0}

            steparea = (steparea > STEPS.length-1)?STEPS.length:steparea
            steparea = (steparea < 0)?0:steparea
            // console.log(steparea)
            let step = 1
            // console.log(offset.current)
            // if (Xoffset > selector.current.offsetWidth) steparea = 1
            // if (Xoffset > selector.current.offsetWidth + 100) steparea = 2
            
            for ( let i = 0 ; i < STEPS.length ; i++ ) {

            }
            
            if (steparea !== temp.laststeparea) {
                
                setZoomfactor(STEPS[steparea])
                setNewstart(scaledate)
                temp.laststeparea = steparea
                temp.xy = [0,0]
                temp.deltaoffset = delta
                
            } 

            if (first) setActive(true)

            velocity = (Math.abs(velocity)<.2)?0:velocity  
            // console.log('velocity '+velocity) 
            
            set({ 
                // xy: add(scale(sub(delta,temp.deltaoffset),step), temp.xy), 
                xy: add(scale(add(sub(delta,temp.deltaoffset),offset.current),step), temp.xy), 
                immediate: down, 
                config: { velocity: scale(direction, velocity*step), decay: true},
                // config: { mass: 10, tension: 20 , friction: 40, precision: 1 },
                // onFrame: ()=>{console.log('xy: '+xy.getValue())},
                // config: config.gentle,
                // config: {},
                onFrame: ()=>{
                    let newdate = new Date(newstart.getTime() - xy.getValue()[1] * zoomfactor)
                    onDateChange(newdate)
                    setScaledate(newdate)
                    setlLastStartdate(newdate)
                    refscaledate.current = newdate
                    // offset.current = [0,0]
                },
                // onFrame: ()=>{onDateChange( olddate => new Date(olddate.getTime() + xy.getValue()[1] * 1000))},
                // onFrame: setLiveDate(),
                onRest: ()=>{
                    if (!down) {
                        // setTimeout(()=>setActive(false),1)
                        setActive(false)
                        let newdate = new Date(newstart.getTime() - xy.getValue()[1] * zoomfactor)
                        onFinalDateChange(newdate)
                        offset.current = [0,0]

                    }
                }
            })
            return temp
        }
    })


    useEffect(() => {
        // if(!active) onFinalDateChange(scaledate)  
        
        if(!active) {
            offset.current[1] -= (startdate.getTime() - lastStartdate.getTime())  / zoomfactor
            // console.log(offset.current[1]+ ' /  '+ (startdate.getTime() - lastStartdate.getTime()))
            setScaledate(startdate)
            setlLastStartdate(startdate)
            onDateChange(startdate)
        }
    },[startdate])


    return (
        <animated.div {...bind()} className='DateSelector' ref={selector} >
            <div className="Mask"  >

                <DateSelectorScale className='scale' date={scaledate} zoomfactor={zoomfactor} immediate={active}></DateSelectorScale>
                
                <div className="TriangleContainer" >
                    <svg height="40" width="20" className="Triangle">
                        <polygon points="20,5 20,35 12,20" />   
                    </svg> 
                </div>        
            </div>

        </animated.div>
                                  )
}
export default DateSelector
