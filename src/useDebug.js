import { useState, useEffect, useRef } from "react";

export default function useDebug(init) {

    /// debug snippet
    const [debugdata, setDebugdata] = useState(init)    
    useEffect(() => {
        console.log('debug: ' + debugdata)
    },[debugdata])


return [ debugdata, setDebugdata ]

}
