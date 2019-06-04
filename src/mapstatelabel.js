import React, { useEffect, useState, useLayoutEffect, useGlobal } from "reactn";
// import { useGlobal } from 'reactn';
import "./mapstatelabel.css"
import { useHotkeys } from 'react-hotkeys-hook';



function MapStateLabel() {

    const [ appaltitude,  ] = useGlobal('appaltitude')
    const [ apppickeditems, setApppickeditems ] = useGlobal('apppickeditems')
    // let item = 'toto'
    const [items, setItems] = useState([])
    const [showQL, setShowQL] = useState(false)

    useHotkeys("q",()=>{setShowQL(showQL => !showQL)}) 

    useEffect(() => {
        // console.log(apppickeditems)
        // if (apppickeditems.length != 0) {
        //     if (apppickeditems.length > 1) {
        //         setItem(apppickeditems.length + ' items selected')
        //     } else {
        //         setItem(apppickeditems[0].userProperties.name)
        //     }
        //     // console.log(apppickeditems.length + ' items picked')
        // } else {
        //     setItem([])
        // }
        setItems(apppickeditems)
      },[apppickeditems])
    
    // const [altitude, setAltitude] = useState()


    // useLayoutEffect(() => {    
    //     console.log('Altitude changed') 
    //     setAltitude(Math.ceil(appaltitude / 1000))
    // },[appaltitude])

    return (
        <div className='MapStateLabel' >
            <div style={{fontSize: 10}}>
                {items.map( item => <div className='metadata' key={item.userProperties.name}>{item.userProperties.name}<img className='Quicklook' style={{display: showQL?'inline':'none'}} src={item.userProperties.quicklookUrl} alt=''/></div>)} 
            </div>
            <div >{Math.ceil(appaltitude / 1000)+ ' Km'}</div>
        </div>
    )
    // <div className='MonthLabel' key='month' style={highlight=='month'?{color: 'rgba(120,0,0,1)'}:{}} >{month}</div>


    
}

export default MapStateLabel;
