import React from "react";
import {useSpring, animated} from 'react-spring';
import {Spring} from 'react-spring/renderprops'
import "./controlpanel.css"

import MissionSelector from "./missionselector";
import MapSelector from "./mapselector";





function ControlPanel({active}) {


    /*
    //const props = useSpring({from: { opacity: 0, marginLeft: 0 }, to: { opacity: 1, marginLeft: 100 }})
    const props = useSpring({opacity: 0, to: { opacity: 1}})
    return (
        <animated.div className='ControlPanel' style={props}>I will fade in</animated.div>
    )
*/
    let styleOn = { opacity: 1, marginRight: 0 }
    let styleOff = { opacity: 0, marginRight: -500 }

    // const bind = useGesture({ onDrag: ({ local }) => set({ local }) })

    // const [props] = useSpring({
    //     to: { opacity: 1, marginRight: 0 }
    //     from: { opacity: 0, marginRight: -500 },
    //     delay: '2000'
    // })

    return (

        <Spring
            from={ active ? styleOff : styleOn}
            to={ active ? styleOn : styleOff}>
                
            {props => 
                <div className='ControlPanel' style={props} >
                    <MissionSelector></MissionSelector>
                    <MapSelector></MapSelector>
                
                </div>}
        </Spring>
    )
    
}

export default ControlPanel
