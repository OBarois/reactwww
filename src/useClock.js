import { useState, useEffect, useRef } from "react";


export function useClock({ autoStart, duration, startdate }) {
    //console.log('useClock renders')
    //const { autoStart, duration } = settings || {};
  
    let initDate = startdate
    const [date, setDate] = useState(initDate)
    const [playing, setPlaying] = useState(false)
    const ldate = useRef();

    // refresh rate in msec
    const refreshRate = 50

    function incrementDate(step) {
        //setDate(prevDate => { return prevDate + step  });
        ldate.current += step 
        //setDate((new Date(ldate.current)).getTime());
        setDate(ldate.current);
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
        console.log("starting Timer... (will stop in "+duration/1000+" sec)")
        if (!intervalRef.current) {
            intervalRef.current = setInterval(() => incrementDate(step.current), refreshRate);
            setPlaying(true)
        }
        timeoutRef.current = setTimeout(() => {
            togglePause()
            //start()
          }, duration);
    }

    function togglePause() {
        console.log('toggle clock')
        if(timeoutRef.current) clearTimeout(timeoutRef.current)
        if (intervalRef.current) {
            setPlaying(false)
            clearInterval(intervalRef.current)
            intervalRef.current = undefined
        } else start()
    }

    function reset() {
        console.log('reset')
        if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = undefined
            setPlaying(false)
        }
        let initDate = (new Date()).getTime()
        step.current = refreshRate
        setDate(initDate)
        ldate.current = initDate
    }

     
    function forceDate(newdate) {
        ldate.current = newdate
    }


    // didMount effect
    useEffect(() => {
        setDate((new Date()).getTime())
        ldate.current = date
        if (autoStart) {
            start();
        }
        //return reset;
    }, []);

  
  return { date, playing, togglePause, reset, increaseSpeed, decreaseSpeed, forceDate };
}
