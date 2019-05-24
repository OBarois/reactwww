import React, {useState, useLayoutEffect, useEffect, useRef } from "react";
import {useSpring, animated} from 'react-spring';
import {Spring} from 'react-spring/renderprops'
import { useGesture } from 'react-use-gesture'
import { useGlobal } from 'reactn'
import { add, sub, scale } from 'vec-la'
import "./controlpanel.css"

 


function ControlPanel(props) {
    const [ , setDebug ] = useGlobal('debug')

    const [panelon, setPanelon] = useState(props.active)
    const [{ xy }, set] = useSpring(() => ({ xy: [0, 0] }))

    const slidePanel = useRef()
    // const bind = useGesture({ onDrag: ({ local }) => set({ local }) })

    useEffect(() => {    
        console.log('slidePanel: ' + panelon) 
        
        let panelWidth = slidePanel.current.offsetWidth
        set({ xy: panelon?[panelWidth,0]:[0,0]})
        // setPanelon((panelon) => !panelon)
    },[panelon])

    // useLayoutEffect(() => {     
    //     console.log('slidePanel set to: '+panelon)
    //     // let panelWidth = slidePanel.current.offsetWidth
    //     // set({ xy: panelon?[0,0]:[panelWidth,0]})
    // },[panelon])

    const bind = useGesture({
        onDrag: ({  local, down,  delta, vxvy, temp={xy: xy.getValue()}}) => {
            setDebug(local[0] + ' / ' + local[1] + ' /vx: ' + vxvy[0] + ' /xy: ' + temp.xy[0])

            let swipped = false
            let newxy = [0,0]
            if(down) {
                newxy = add(temp.xy,delta)
                // set({ xy: newxy })
            } else {
                if(vxvy[0] > 0.1) {
                    // newxy = [slidePanel.current.offsetWidth,0]
                    setPanelon((panelon) => !panelon)
                    // swipped = true
                } else {
                    newxy = temp.xy 
                }
            }
            
            set({ xy: newxy, immediate: down })
            // temp.xy = newxy
            return temp
            // set({ local: down?local:[0,0] })

            }
        })



    return (
        <div>
            <img className='Logo' src={props.imageSrc} alt='' style={{display: panelon?'inline':'none'}} onClick={()=>setPanelon(state => !state)} />

            <animated.div {...bind()} ref={slidePanel} className='ControlPanel' style={{ transform: xy.interpolate((x, y) => `translate3d(${x}px,0,0)`) }}>
                {/* <MissionSelector></MissionSelector>
                <MapSelector></MapSelector> */}
                {props.children}
            </animated.div>
        </div>

    )

    
}

export default ControlPanel
