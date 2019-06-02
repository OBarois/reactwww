import { useState, useEffect } from "react";
import dhusToGeojson from "./dhusToGeojson";
import { useGlobal } from 'reactn';
import dateFormat from "dateformat"
import SearchManager from './searchmanager'




export default function useDatahub() {


    const buildUrl = ({code, polygon, start, end, startindex}) => {


        
        let collections = [
            {
                code: 'S1',
                templateUrl: 'https://131.176.236.55/dhus/search?q=( footprint:"Intersects({polygon})" AND beginposition:[{start} TO {end}] AND platformname:Sentinel-1 AND producttype:GRD)&start={startindex}&rows=100&sortedby=beginposition&order=desc&format=json',
                name: 'Sentinel-1 A/B GRD' ,
                startIndexOrigin: 0,
                dateOff: ' beginposition:[{start} TO {end}] AND',
                areaOff:  ' footprint:"Intersects({polygon})" AND'
            },
            {
                code: 'S2',
                templateUrl: 'https://131.176.236.55/dhus/search?q=( footprint:"Intersects({polygon})" AND beginposition:[{start} TO {end}] AND platformname:Sentinel-2 AND producttype:S2MSI1C)&start={startindex}&rows=100&sortedby=beginposition&order=desc&format=json',
                name: 'Sentinel-2 A/B Level 1C',
                startIndexOrigin: 0,
                dateOff: ' beginposition:[{start} TO {end}] AND',
                areaOff:  ' footprint:"Intersects({polygon})" AND'
            },
            {
                code: 'S3',
                templateUrl: 'https://131.176.236.55/dhus/search?q=( footprint:"Intersects({polygon})" AND beginposition:[{start} TO {end}] AND platformname:Sentinel-3 AND (producttype:OL_1_ERR___ OR producttype:SL_1_RBT___ OR producttype:SR_1_SRA___))&start={startindex}&rows=100&sortedby=beginposition&order=desc&format=json',
                name: 'Sentinel-3 A/B, OLCI/SLSTR/SRAL' ,
                startIndexOrigin: 0,
                dateOff: ' beginposition:[{start} TO {end}] AND',
                areaOff:  ' footprint:"Intersects({polygon})" AND'
            },
            {
                code: 'S5P',
                templateUrl: 'https://s5phub.copernicus.eu/dhus/search?q=( footprint:"Intersects({polygon})" AND beginposition:[{start} TO {end}] AND platformname:Sentinel-5 precursor AND (producttype:L1B_RA_BD1 OR (producttype:L2__NO2___ AND processingmode:Near real time)))&start={startindex}&rows=100&sortedby=beginposition&order=desc&format=json',
                name: 'Sentinel-1 A/B',
                startIndexOrigin: 0,
                dateOff: ' beginposition:[{start} TO {end}] AND',
                areaOff:  ' footprint:"Intersects({polygon})" AND'
            },
            {
                code: 'ENVISAT',
                templateUrl: 'https://eocat.esa.int/ngeo/catalogue/FEDEO-ENVISAT.ASA.IMP_1P/search?start={start}&stop={end}&format=json&count=50&startIndex={startindex}',
                startIndexOrigin: 1,
                name: 'Sentinel-1 A/B',
                dateOff: ' beginposition:[{start} TO {end}]',
                areaOff:  ' footprint:"Intersects({polygon})"'
            }

        ]

        const getTargetCollection= (mission) => {
            return collections.find( (collection) => {return collection.code == mission} )
        }
        // console.log(getTargetCollection(mission))
        let target = getTargetCollection(code)
        let newurl = target.templateUrl
        //let start, end, 
        // let windowSize
        

        if(polygon.length > 0) {
            // windowSize = 1000 * 60 * 60 * 24 * 30 // 1 month time window
            // start = dateFormat(new Date(date - windowSize/2),'isoUtcDateTime').replace('Z','.000Z')
            // end =  dateFormat(new Date(date + windowSize/2),'isoUtcDateTime').replace('Z','.000Z')
            console.log('|'+polygon.length+'|')
            newurl = newurl.replace("{polygon}", polygon)
            newurl = newurl.replace(target.dateOff, '')
            // newurl = newurl.replace("{start}", start)
            // newurl = newurl.replace("{end}", end)

        } else {
            // windowSize = 1000 * 60 * 60 * 24  // 3 hours time window
            // windowSize = 1000 * 60 * 60 * 24 * 30 // 1 month time window

            // start = dateFormat(new Date(date - windowSize/2),'isoUtcDateTime').replace('Z','.000Z')
            // end =  dateFormat(new Date(date + windowSize/2),'isoUtcDateTime').replace('Z','.000Z')

            newurl = newurl.replace(target.areaOff, '')
            newurl = newurl.replace("{start}", start)
            newurl = newurl.replace("{end}", end)
        }
        
        startindex = target.startIndexOrigin = 0 ? startindex : startindex + target.startIndexOrigin
        // newurl = newurl.replace("{startindex}",startindex)


        return newurl
    }

    
    // search time window size in ms
    const [windowSize, setWindowSize] = useState(1000 * 60 * 60 * 24)
    const MAX_ITEMS = 5000

    const [geojsonResults, setGeojsonResults] = useState(null)
    const [loading, setLoading] = useState(false)
    const [isfirstpage, setIsfirstPage] = useState(true)
    
    const [ searchepoch,  ] = useGlobal('searchepoch');
    // const [ startend, setStartend ] = useState({start:0, end:0});
    const [ startend,  ] = useGlobal('startend');
    const [ mission,  ] = useGlobal('mission');
    const [ apppolygon,  ] = useGlobal('apppolygon');
    const [gosearch, setGosearch] = useGlobal('gosearch')


    const [se] = SearchManager();

    const [ searchUrl, setSearchurl  ] = useState(null);
    // const [ polygon, setPolygon  ] = useState('');

    const [ pagination, setPagination ] = useState(null);
    const [ searchtimeout, setSearchtimeout ] = useState(null);

//{totalresults,startindex}

// fetch('https://...')
//   .then(response => response.json())
//   .then(data => console.log('data is', data))
//   .catch(error => console.log('error is', error));
    useEffect(() => {
        const fetchURL = async (url,index) => {
            // setLoading(true)
            let newurl = url
            newurl = newurl.replace("{startindex}",index)
            console.log('Search: '+newurl)
            let paging = {totalresults:0, startindex:0, itemsperpage:0}
            try {
                
                const response = await fetch(newurl, {mode: 'cors', credentials: 'include'})
                // console.log( response.text())
                try {
                    const json = await response.json()
                    const geoJson = (mission === 'ENVISAT')? json : dhusToGeojson(json)
                    // console.log('totalResults: ' + geoJson.properties.totalResults)
                    paging = {
                        totalresults: geoJson.properties.totalResults == null ? 0 : Number(geoJson.properties.totalResults) ,
                        startindex:  Number(geoJson.properties.startIndex), 
                        itemsperpage:  Number(geoJson.properties.itemsPerPage)
                    }
                    console.log(paging)

                    // setPagination(paging)
                    if(paging.totalresults>0) setGeojsonResults(geoJson) 
                    // setIsfirstPage((pagination.startindex + pagination.itemsperpage < pagination.totalresults)?true:false)
                    if (paging.startindex + paging.itemsperpage < Math.min(paging.totalresults,MAX_ITEMS) ) {
                        console.log("There's More...")  
                        console.log(url + '/' + (paging.startindex + paging.itemsperpage))
                        fetchURL(url,(paging.startindex + paging.itemsperpage))
                    }
                    // setLoading(false);   
                } catch (err) {
                    console.log("Didn't recieve a json !")
                    console.log(err)
                    setLoading(false);
                }
            } catch(err) {
                console.log("Error contacting server...")
                console.log(err)
                setLoading(false)
                
            }
            return paging
            
        }

        if(searchUrl) {
            let url = searchUrl
            // url = url.replace("{startindex}",0)
            let page = fetchURL(url,0)
            // page.then((result)=>{
            //     console.log(result)
            //     if(result.startindex + result.itemsperpage < Math.min(result.totalresults,MAX_ITEMS) ) {

                // }
            // })
            

        }
    }, [searchUrl]);
    
    useEffect(() => {
        if(pagination) {
            if(pagination.startindex + pagination.itemsperpage < Math.min(pagination.totalresults,MAX_ITEMS) ) {
                // let url = searchURLs[mission]
                // console.log("There's More...")
                // setIsfirstPage(false)
                try {
                    let url = buildUrl({
                        code: mission,
                        polygon: apppolygon, 
                        start: startend.start,
                        end: startend.end,
                        // start: dateFormat(new Date(searchepoch - windowSize/2),'isoUtcDateTime'), 
                        // end: dateFormat(new Date(searchepoch + windowSize/2),'isoUtcDateTime'), 
                        startindex: pagination.startindex + pagination.itemsperpage
                    })

                    setSearchurl(url)

                
            
                } catch {
                    console.log('Not a JULIAN date !')
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
    
        }
    }, [pagination]);

    useEffect(() => {
        console.log('DataHub ready. '+mission)
    }, []);

    // useEffect(() => {
    //     console.log('apppolygon: '+apppolygon)
    //     if(apppolygon == '') {
    //         setWindowSize(1000 * 60 * 60 * 24)
    //     } else {
    //         setWindowSize(1000 * 60 * 60 * 24 * 7)
    //     }
    // }, [apppolygon]);

    // useEffect(() => {
    //     console.log('searchepoch: '+searchepoch)
    //     setStartend({
    //         start: dateFormat(new Date(searchepoch - windowSize/2),'isoUtcDateTime').replace('Z','.000Z'),
    //         end: dateFormat(new Date(searchepoch + windowSize/2),'isoUtcDateTime').replace('Z','.000Z')
    //     })

    // }, [searchepoch, windowSize]);



    useEffect(() => {
        console.log('mission: '+mission+ ' start/end: '+ startend.start+'/' + startend.end + ' apppolygon: '+apppolygon)

        if(mission && searchepoch) {
            // clearTimeout(searchtimeout)
            // let timeout = setTimeout(() => {
                try {
                    let url = buildUrl({
                        code: mission,
                        polygon: apppolygon, 
                        start: startend.start,
                        end: startend.end,
                        // start: dateFormat(new Date(searchepoch - windowSize/2),'isoUtcDateTime'), 
                        // end: dateFormat(new Date(searchepoch + windowSize/2),'isoUtcDateTime'), 
                        startindex: 0
                    })
                    // url = url.replace("{startindex}",0)

                    setLoading(true)
                    // setIsfirstPage(true)
                    setSearchurl(url)
            
                } catch(e) {
                    console.log('Not a JULIAN date !')
                    console.log(e)
                }

            // },500)
            // setSearchtimeout(timeout)
            
        }
        
    }, [gosearch, mission, apppolygon, startend.start]);

    return {geojsonResults, loading}
}
