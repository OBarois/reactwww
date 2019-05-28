import React, {useState, useLayoutEffect, useEffect, useRef } from "react";
import {useSpring, animated} from 'react-spring';
import { useGesture } from 'react-use-gesture'
import { useGlobal } from 'reactn'
import { add, sub, scale } from 'vec-la'
import "./controlpanel.css"

export default function SlidePanel(props) {

    const [ , setDebug ] = useGlobal('debug')

    const [visible, setVisible] = useState(true)
    const [{ xy }, set] = useSpring(() => ({ xy: [0, 0] }))

    const slidePanel = useRef()

    const toggle = () =>  {
        setDebug(['toggle from: '+visible+' '+slidePanel.current.offsetWidth,2])
        set({ xy: !visible?[0,0]:[slidePanel.current.offsetWidth,0], immediate: false})
        setVisible(visible => !visible)
    }

    useEffect(() => {
        setDebug(['visible: '+visible,1])
        // set({ xy: visible?[0,0]:[slidePanel.current.offsetWidth,0], immediate: false})
    },[visible])

    useEffect(() => {
        setTimeout(toggle,1000)
        // set({ xy: visible?[0,0]:[slidePanel.current.offsetWidth,0], immediate: false})
    },[])

    const bind = useGesture({
        onDrag: ({  event, direction, velocity, down,  delta, vxvy, temp={xy: xy.getValue()}}) => {
            // setDebug('tempX: '+add(temp.xy,delta)[0],1)
            // setDebug('down: '+down,2)
            event.stopPropagation()
            if(down) {
                
                set({ xy: add(temp.xy,delta), immediate: true })


                // set({ xy: newxy })
            } else {
                if(vxvy[0] > 0.2) {
                    let config = {  velocity: scale(direction, velocity), decay: true, precision: 1 }
                    setDebug(['visible: '+visible,1])
                    set({ xy: [slidePanel.current.offsetWidth,0], immediate: false})
                    setVisible(false)
                } else {
                    set({ xy: temp.xy, immediate: false })
                }
            }
            return temp


            // if(!down && vxvy[0] > 0.2) {
            //     setVisible(state => !state)
            // } else {

            //     let newxy = add(temp.xy,delta)
            //     setDebug('offsetWidth: '+slidePanel.current.offsetWidth)
            //     // if(!down && vxvy[0] > 0.2) {
            //     //     newxy = [slidePanel.current.offsetWidth,0]
            //     // }
                
            //     set({ xy: newxy, immediate: down })
            //     return temp

            // }
        }
        },
        { event: { passive: false } })


    return (
        <div>
            <img className='Logo' draggable="false" src={props.imageSrc} alt=''  onClick={toggle} />

            <animated.div {...bind()} ref={slidePanel} className='ControlPanel' style={{ userSelect: 'none', transform: xy.interpolate((x, y) => `translate3d(${x}px,0,0)`) }}>
                <div>
                    {props.children}
                </div>
            </animated.div>
        </div>

    )
}