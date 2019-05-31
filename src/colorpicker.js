import React, { useEffect } from "react";
import { useGlobal } from 'reactn';

import { HuePicker, AlphaPicker } from 'react-color';
import './colorpicker.css'


// should use a prop

function ColorPicker() {


    const [ appcolor, setAppcolor ] = useGlobal('appcolor');

    // useEffect(() => {
    //     console.log('Mission changed to: '+ mission)
    // }, [mission]);
    
    const handleChangeComplete = (color) => {
        document.documentElement.style.setProperty('--color', color.hex);
        //setAppcolor(color.hex );
      };
    
    //console.log('mission rendering')
    return (
        <div className='ColorSelector'>
            <HuePicker color={appcolor} onChangeComplete={handleChangeComplete }/>
            
            
        </div>
    )
    // <AlphaPicker />  
}

export default ColorPicker;