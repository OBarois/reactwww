import { useState, useEffect, useRef } from "react";


export function useClock({ autoStart, duration }) {
    //console.log('useClock renders')
    //const { autoStart, duration } = settings || {};
  
    let initDate = (new Date()).getTime()
    const [date, setDate] = useState(initDate)
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
        if (!intervalRef.current) {
            console.log('will start with step: '+step.current)
            intervalRef.current = setInterval(() => incrementDate(step.current), refreshRate);
        }
        timeoutRef.current = setTimeout(() => {
            togglePause()
            //start()
          }, duration);
    }

    function togglePause() {
        console.log('toggle')
        if(timeoutRef.current) clearTimeout(timeoutRef.current)
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = undefined;
        } else start()
    }

    function reset() {
        console.log('reset')
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = undefined;
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
        console.log('date after setting: '+date)
        ldate.current = date
        console.log('init date to: '+ldate.current)
        if (autoStart) {
            console.log("starting Timer... ("+duration/1000+" sec)")
            start();
        }
        //return reset;
    }, []);
    useEffect(() => {
        //console.log('ldate changed to: '+ldate.current)
    }, [ldate.current]);

  
  return { date, togglePause, reset, increaseSpeed, decreaseSpeed, forceDate };
}
