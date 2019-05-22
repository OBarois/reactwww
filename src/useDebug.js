import { useState, useEffect, useRef } from "react";

export function useDebug() {

    /// debug snippet
    const [debugdata, setDebugdata] = useState()    
    useEffect(() => {
        console.log('debug: ' + debug)
    },[debug])

    const setDebugdata = (data) =>{

    }

return [ debugdata, setDebugdata ]

}
