import { setGlobal } from 'reactn';


export  function initGlobalStates() {
    console.log("init global: "+(new Date()).getTime())

    // Set current time as global state
    setGlobal({appdate: ((new Date()).getTime())})
    setGlobal({searchdate: ((new Date()).getTime())})
    setGlobal({mission: 'S1'})
    setGlobal({searching: false})
    setGlobal({apppolygon: ''})
    
}