import React from "react";
import { Swipeable, defineSwipe } from 'react-touch';


function Swiper() {

    function swipeLeft() {
        console.log("left")
    }

    //const [ appdate, setAppdate ] = useGlobal('appdate');


    const swipe = defineSwipe({swipeDistance: 50});
    return (
       <Swipeable config={swipe} onSwipeLeft={swipeLeft}>
          <div className="TimeSwipe">timeswipe</div>
        </Swipeable>    );
}

export default Swiper;
