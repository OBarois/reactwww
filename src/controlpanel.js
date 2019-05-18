import React from "react";
import {useSpring, animated} from 'react-spring';
import {Spring} from 'react-spring/renderprops'
import "./controlpanel.css"





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


    return (

        <Spring
            from={ active ? styleOff : styleOn}
            to={ active ? styleOn : styleOff}>
            {props => 
                <div className='ControlPanel' style={props} >hello
                </div>}
        </Spring>
    )
    
}

export default ControlPanel
