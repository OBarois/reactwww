import { useState, useEffect, useRef } from "react";


export function useClock(settings) {
    const { autoStart, count } = settings || {};
  
    const [date, setDate] = useState((new Date()).getTime());

    const step = 60000

    function incrementDate(step) {
        setDate(prevDate => { return prevDate + step  });
        //let newdate = date+120000
        //setDate(date)
    }
      

      // Control functions
    const intervalRef = useRef();

    function start() {
        if (!intervalRef.current) {
            intervalRef.current = setInterval(() => incrementDate(step), 10);
        }
    }

    function pause() {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = undefined;
        }
    }

    function reset() {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = undefined;
        }
        let initDate = new Date()
        setDate(initDate.getTime())
    }

    // didMount effect
    useEffect(() => {
        setDate((new Date()).getTime())
        if (autoStart) {
            console.log("starting Timer...")
            start();
        }
        return reset;
    }, []);

  
  return { date, start, pause, reset };
}
