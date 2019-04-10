import React from "react";
import { useSwipeable, Swipeable } from 'react-swipeable'

function Swiper() {

    function TimeSwipe() {
        console.log("swipe")
    }

    //const [ appdate, setAppdate ] = useGlobal('appdate');
    const config = {
        delta: 10,                             // min distance(px) before a swipe starts
        preventDefaultTouchmoveEvent: false,   // preventDefault on touchmove, *See Details*
        trackTouch: true,                      // track touch input
        trackMouse: true,                     // track mouse input
        rotationAngle: 0,    
    }


    const handlers = useSwipeable({ onSwiped: (eventData) => TimeSwipe, ...config })
    return (
       <Swipeable config={...config } onSwiped={(eventData) => TimeSwipe} >
          <div className="TimeSwipe">timeswipe</div>
        </Swipeable>    );
}

export default Swiper;
