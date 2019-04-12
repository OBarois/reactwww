import { useState, useEffect, useRef } from "react";
import Easing from "easing"


export function useClock(settings) {
    const { autoStart, duration } = settings || {};
  
    const [date, setDate] = useState((new Date()).getTime());

    // refresh rate in msec
    const refreshRate = 10

    function incrementDate(step) {
        setDate(prevDate => { return prevDate + step  });
        //let newdate = date+120000
        //setDate(date)
    }
      

      // Control functions
    const intervalRef = useRef();
    const step = useRef(refreshRate);
    const timeoutRef = useRef();

    function increaseSpeed() {
        step.current = (step.current > 0)? step.current *= 2:step.current /= 2
        if(Math.abs(step.current) < refreshRate) step.current = refreshRate
    }
    function decreaseSpeed() {
        step.current = (step.current > 0)? step.current /= 2:step.current *= 2
        if(Math.abs(step.current) < refreshRate) step.current = -1 * refreshRate
     }

    function start() {
        if (!intervalRef.current) {
            intervalRef.current = setInterval(() => incrementDate(step.current), refreshRate);
        }
        timeoutRef.current = setTimeout(() => {
            reset()
            //start()
          }, duration);
    }

    function togglePause() {
        if(timeoutRef.current) clearTimeout(timeoutRef.current)
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = undefined;
        } else start()
    }

    function reset() {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = undefined;
        }
        let initDate = new Date()
        step.current = refreshRate
        setDate(initDate.getTime())
    }

    function swipe(velocity,direction) {
        const x = Easing.event(Math.round(velocity*20),'sinusoidal',{endToEnd:true,duration:Math.round(velocity*1000)})
        x.on('data', (data) => { 
            //console.log(step.current*10*data )
            incrementDate(1000000*data*direction)
        })
    }


    // didMount effect
    useEffect(() => {
        setDate((new Date()).getTime())
        if (autoStart) {
            console.log("starting Timer... ("+duration/1000+" sec)")
            start();
        }
        return reset;
    }, []);

  
  return { date, togglePause, reset, increaseSpeed, decreaseSpeed, swipe };
}
