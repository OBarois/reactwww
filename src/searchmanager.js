import { useState, useEffect } from "react"
import { useGlobal } from 'reactn'
import { useHotkeys } from 'react-hotkeys-hook'



export default function SearchManager() {

    const [ searchepoch,  ] = useGlobal('searchepoch');
    const [ startend,  setStartend] = useGlobal('startend');
    const [ apppolygon,  ] = useGlobal('apppolygon');
    const [ mission,  ] = useGlobal('mission');
    const [ replace, setReplace ] = useGlobal('replace')
    const [gosearch, setGosearch] = useGlobal('gosearch')


    // const { geojsonResults, loading} = useDatahub();


    const [windowSize, setWindowSize] = useState(1000 * 60 * 60 * 24)
    const [searchList, setSearchList] = useState([])
    const [replacemode, setReplacemode] = useState(0)
    

    // const [replacemode, toggleReplacemode] = useToggle(false)

    // const [ startend, setStartend ] = useState({start:0, end:0});

    // const toggleReplace = () => {
    //     console.log('toggle replace from: '+replacemode)
    //     if(replacemode == true) {
    //         setReplacemode(false)
    //     } else {
    //         setReplacemode(true)
    //     }

    // }
    // // replace => { setReplace(!replace); return !replace }
    // useHotkeys('ctrl+k', () => setCount(prevCount => prevCount + 1));
    // useHotkeys("z",() => setReplacemode(state => !state))
    useHotkeys("z",() => setReplacemode(count => count+=1))

    useEffect(() => {
        console.log('apppolygon: '+apppolygon)
        setReplacemode(count => count+=1)
        // if(apppolygon == '') {
        //     setWindowSize(1000 * 60 * 60 * 24)
        //     // setStartend({
        //     //     start: null,
        //     //     end: null
        //     // })    
            

        // } else {
        //     setWindowSize(1000 * 60 * 60 * 24 * 7)
        // }
        // // setGosearch(Math.random)
    }, [apppolygon, mission]);

    useEffect(() => {
        console.log("cleaning searches: " + replacemode)
        // setReplace(replacemode)
        if(replacemode) {
            setReplace(true)
            setSearchList([])
            setGosearch(Math.random)
        }
    }, [replacemode]);


    useEffect(() => {
        // console.log('searchepoch: '+(new Date(searchepoch)).toJSON())
        let SearchDate = new Date(searchepoch)
        console.log('searchepoch: '+ SearchDate.toJSON())
        let startepoch = (new Date(Date.UTC(SearchDate.getUTCFullYear(), SearchDate.getUTCMonth(), SearchDate.getUTCDate())))

        // Catalogue search time window is discreet, set from 00:00:00 to 23:59:59 of the selected day 
        let _startdate = (new Date(startepoch.getTime())).toJSON()
        let _enddate = (new Date(startepoch.getTime() + windowSize - 1000)).toJSON()

        console.log('new start/end: '+_startdate + '/ ' + _enddate)

        let newSearchList = searchList

        if (newSearchList.indexOf(_startdate) < 0 || true) {
            newSearchList.push(_startdate)
            if (newSearchList.length > 5) {
                // newSearchList.shift()
                console.log('should now remove geojson layer')
            }
            setSearchList(newSearchList)
            setStartend({
                start: _startdate,
                end: _enddate
            })    
            setGosearch(Math.random)
        } else {
            console.log('Search already done !')
            
        }
    }, [searchepoch]);




return [ startend ]

}
