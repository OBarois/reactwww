import { setGlobal } from 'reactn';


export  function initGlobalStates() {
    console.log("init global: "+(new Date()).getTime())

    // Set current time as global state
    // setGlobal({appdate: ((new Date()).getTime())})
    // setGlobal({searchepoch: ((new Date()).getTime())})
    // setGlobal({mission: 'S1'})
    // setGlobal({searching: false})
    // setGlobal({apppolygon: ''})
    // setGlobal({replace: true})
    // setGlobal({startend: {start:0, end:0}})
    // setGlobal({setApppickeditems: []})


    setGlobal({
        appdate: (new Date()).getTime(),
        searchepoch: (new Date()).getTime(),
        mission: 'S1',
        searching: false,
        apppolygon: '',
        replace: true,
        startend: {start:0, end:0},
        apppickeditems: []
    })
    
}