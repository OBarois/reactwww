import React, { useState, useLayoutEffect, useRef } from "react"
export default function useDimensions() {

    const ref = useRef();
    
    const [dimensions, setDimensions] = useState({})
    
    useLayoutEffect(() => {
    
    //setDimensions(ref.current.getBoundingClientRect());
    console.log("dim")
    console.log(ref.current)
    
    }, [ref.current])
    
    return { ref, ...dimensions }
    
    }