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
        // setDebug('toggle to: '+visible)
        setVisible(state => !state)
    }

    useEffect(() => {
        setDebug('visible: '+visible)
        set({ xy: visible?[slidePanel.current.offsetWidth,0]:[0,0], immediate: false})
    },[visible])

    const bind = useGesture({
        onDrag: ({  local, down,  delta, vxvy, temp={xy: xy.getValue()}}) => {

            if(down) {
                set({ xy: add(temp.xy,delta), immediate: true })
                return temp

                // set({ xy: newxy })
            } else {
                if(vxvy[0] > 0.2) {
                    setVisible(state => !state)
                } else {
                    set({ xy: temp.xy, immediate: false })
                }
            }



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
        })


    return (
        <div>
            <img className='Logo' src={props.imageSrc} alt=''  onClick={toggle} />

            <animated.div {...bind()} ref={slidePanel} className='ControlPanel' style={{ transform: xy.interpolate((x, y) => `translate3d(${x}px,0,0)`) }}>
                {props.children}
            </animated.div>
        </div>

    )
}