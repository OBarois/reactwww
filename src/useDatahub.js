import { useState, useEffect } from "react";
import dhusToGeojson from "./dhusToGeojson";
import { useGlobal } from 'reactn';
import dateFormat from "dateformat"



export default function useDatahub() {

    let searchURLs = []
    //http://131.176.236.55/dhus/
    //https://scihub.copernicus.eu/apihub/search?

    const buildUrl = ({code, polygon, start, end, startindex}) => {

        // console.log('Search param: '+code+','+polygon+','+start+','+end+','+startindex)

        let collections = [
            {
                code: 'S1',
                templateUrl: 'https://131.176.236.55/dhus/search?q=( footprint:"Intersects({polygon})" AND beginposition:[{start} TO {end}] AND platformname:Sentinel-1 AND producttype:GRD)&start={startindex}&rows=100&sortedby=ingestiondate&order=desc&format=json',
                name: 'Sentinel-1 A/B GRD' ,
                dateOff: ' beginposition:[{start} TO {end}] AND',
                areaOff:  ' footprint:"Intersects({polygon})" AND'
            },
            {
                code: 'S2',
                templateUrl: 'https://131.176.236.55/dhus/search?q=( footprint:"Intersects({polygon})" AND beginposition:[{start} TO {end}] AND platformname:Sentinel-2 AND producttype:S2MSI1C)&start={startindex}&rows=100&sortedby=ingestiondate&order=desc&format=json',
                name: 'Sentinel-2 A/B Level 1C',
                dateOff: ' beginposition:[{start} TO {end}] AND',
                areaOff:  ' footprint:"Intersects({polygon})" AND'
            },
            {
                code: 'S3',
                templateUrl: 'https://131.176.236.55/dhus/search?q=( footprint:"Intersects({polygon})" AND beginposition:[{start} TO {end}] AND platformname:Sentinel-3 AND (producttype:OL_1_ERR___ OR producttype:SL_1_RBT___ OR producttype:SR_1_SRA___))&start={startindex}&rows=100&sortedby=ingestiondate&order=desc&format=json',
                name: 'Sentinel-3 A/B, OLCI/SLSTR/SRAL' ,
                dateOff: ' beginposition:[{start} TO {end}] AND',
                areaOff:  ' footprint:"Intersects({polygon})" AND'
            },
            {
                code: 'S5P',
                templateUrl: 'https://131.176.236.55/dhus/search?q=( footprint:"Intersects({polygon})" AND beginposition:[{start} TO {end}] AND platformname:Sentinel-5 precursor AND (producttype:L1B_RA_BD1 OR (producttype:L2__NO2___ AND processingmode:Near real time)))&start={startindex}&rows=100&sortedby=ingestiondate&order=desc&format=json',
                name: 'Sentinel-1 A/B',
                dateOff: ' beginposition:[{start} TO {end}] AND',
                areaOff:  ' footprint:"Intersects({polygon})" AND'
            },
            {
                code: 'ENVISAT',
                templateUrl: 'https://eocat.esa.int/ngeo/catalogue/FEDEO-ENVISAT.ASA.IMP_1P/search?start={start}&stop={end}&format=json&count=50&startIndex={startindex}',
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
        console.log(target.areaOff)
        

        if(polygon.length > 0) {
            console.log('|'+polygon.length+'|')
            newurl = newurl.replace("{polygon}", polygon)
            newurl = newurl.replace(target.dateOff, '')
        } else {
            newurl = newurl.replace(target.areaOff, '')
            newurl = newurl.replace("{start}", start)
            newurl = newurl.replace("{end}", end)
        }
        
        newurl = newurl.replace("{startindex}",startindex)


        return newurl



        
        // url = url.replace("{polygon}", (apppolygon !== '') ? ' footprint:"Intersects('+ apppolygon + ')"' : '')
        // url = url.replace("{start}", dateFormat(new Date(searchdate - windowSize/2),'isoUtcDateTime'));
        // url = url.replace("{end}", dateFormat(new Date(searchdate + windowSize/2),'isoUtcDateTime'));
        // url = url.replace("{startindex}", pagination.startindex + pagination.itemsperpage);

    }

    searchURLs["S1"] = 'https://131.176.236.55/dhus/search?q=({polygon} beginposition:[{start} TO {end}] AND platformname:Sentinel-1 AND producttype:GRD)&start={startindex}&rows=100&sortedby=ingestiondate&order=desc&format=json'
    searchURLs["S2"] = 'https://131.176.236.55/dhus/search?q=({polygon} beginposition:[{start} TO {end}] AND platformname:Sentinel-2 AND producttype:S2MSI1C)&start={startindex}&rows=100&sortedby=ingestiondate&order=desc&format=json'
    searchURLs["S3"] = 'https://131.176.236.55/dhus/search?q=({polygon} beginposition:[{start} TO {end}] AND platformname:Sentinel-3 AND (producttype:OL_1_ERR___ OR producttype:SL_1_RBT___ OR producttype:SR_1_SRA___))&start={startindex}&rows=100&sortedby=ingestiondate&order=desc&format=json'
    searchURLs["S5P"] = 'https://s5phub.copernicus.eu/search?q=({polygon} beginposition:[{start} TO {end}] AND platformname:Sentinel-5 precursor AND (producttype:L1B_RA_BD1 OR (producttype:L2__NO2___ AND processingmode:Near real time)))&start={startindex}&rows=100&sortedby=ingestiondate&order=desc&format=json'
    searchURLs["ENVISAT"] = 'https://eocat.esa.int/ngeo/catalogue/FEDEO-ENVISAT.ASA.IMP_1P/search?start={start}&stop={end}&format=json&count=50&startIndex={startindex}'
    
    // search time window size in ms
    const windowSize = 1000 * 60 * 60 * 3
    const MAX_ITEMS = 2200

    const [geojsonResults, setGeojsonResults] = useState(null)
    const [loading, setLoading] = useState(false)
    const [isfirstpage, setIsfirstPage] = useState(true)
    
    const [ searchdate,  ] = useGlobal('searchdate');
    const [ mission,  ] = useGlobal('mission');
    const [ apppolygon,  ] = useGlobal('apppolygon');

    const [ searchUrl, setSearchurl  ] = useState(null);
    // const [ polygon, setPolygon  ] = useState('');

    const [ pagination, setPagination ] = useState(null);

//{totalresults,startindex}
    useEffect(() => {
        const fetchURL = async (url) => {
            // setLoading(true)
            console.log('Search: '+ url)
            try {
                const response = await fetch(url, {mode: 'cors', credentials: 'include'})
                const json = await response.json()
                const geoJson = (mission === 'ENVISAT')? json : dhusToGeojson(json)
                // console.log('totalResults: ' + geoJson.properties.totalResults)
                console.log(geoJson.properties)
                setPagination( 
                    {
                    totalresults: Number(geoJson.properties.totalResults) ,
                    startindex:  Number(geoJson.properties.startIndex), 
                    itemsperpage:  Number(geoJson.properties.itemsPerPage), 
                    })
                if(Number(geoJson.properties.totalResults>0)) setGeojsonResults(geoJson) 
                setIsfirstPage((pagination.startindex + pagination.itemsperpage < pagination.totalresults)?true:false)
                console.log('first?: ' + (pagination.startindex + pagination.itemsperpage < pagination.totalresults)?'true':'false')
                // setLoading(false);   
            } catch {
                console.log("Didn't recieve a json !")
                //console.log(response)
                setLoading(false);
            }
            
        }
        if(searchUrl) fetchURL(searchUrl)
    }, [searchUrl]);
    
    useEffect(() => {
        if(pagination) {
            if(pagination.startindex + pagination.itemsperpage < Math.min(pagination.totalresults,MAX_ITEMS) ) {
                let url = searchURLs[mission]
                console.log("There's More...")
                // setIsfirstPage(false)
                try {
                    let url = buildUrl({
                        code: mission,
                        polygon: apppolygon, 
                        start: dateFormat(new Date(searchdate - windowSize/2),'isoUtcDateTime'), 
                        end: dateFormat(new Date(searchdate + windowSize/2),'isoUtcDateTime'), 
                        startindex: pagination.startindex + pagination.itemsperpage
                    })

                    // url = url.replace("{polygon}", (apppolygon !== '') ? ' footprint:"Intersects('+ apppolygon + ')" AND ' : '')
                    // url = url.replace("{start}", dateFormat(new Date(searchdate - windowSize/2),'isoUtcDateTime'));
                    // url = url.replace("{end}", dateFormat(new Date(searchdate + windowSize/2),'isoUtcDateTime'));
                    // url = url.replace("{startindex}", pagination.startindex + pagination.itemsperpage);
                    //console.log("Next URL: " + url)
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

    useEffect(() => {
        console.log('apppolygon: '+apppolygon)
    }, [apppolygon]);

    useEffect(() => {
        console.log('mission '+mission)
        console.log('searchdate '+searchdate)

        if(mission && searchdate) {
            
            let url = searchURLs[mission]
            //if(mission in ["S1","S2","S3"]) url = searchURLs[mission]
            try {
                console.log(apppolygon?true:false)

                let url = buildUrl({
                    code: mission,
                    polygon: apppolygon, 
                    start: dateFormat(new Date(searchdate - windowSize/2),'isoUtcDateTime'), 
                    end: dateFormat(new Date(searchdate + windowSize/2),'isoUtcDateTime'), 
                    startindex: 0
                })
                // console.log('url2: '+url2)


                // url = url.replace("{polygon}", (apppolygon !== '') ? ' footprint:"Intersects('+ apppolygon + ')" AND ' : '')
                // url = url.replace("{start}", dateFormat(new Date(searchdate - windowSize/2),'isoUtcDateTime'));
                // url = url.replace("{end}", dateFormat(new Date(searchdate + windowSize/2),'isoUtcDateTime'));
                // url = url.replace("{startindex}", 0);
                setLoading(true)
                // setIsfirstPage(true)
                setSearchurl(url)
        
            } catch {
                console.log('Not a JULIAN date !')
            }
        }
        
    }, [searchdate, mission]);
/*    
    const [ mission, setMission ] = useGlobal('mission');
    useEffect(() => {
        if(mission in ["S1","S2","S3"]) setUrl(searchURLs[mission])
    }, [mission]);
    */

    return {geojsonResults, loading, isfirstpage}
}
