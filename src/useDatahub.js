import { useState, useEffect } from "react";
import dhusToGeojson from "./dhusToGeojson";
import { useGlobal } from 'reactn';
import dateFormat from "dateformat"
import { ModuleResolutionKind } from "typescript";



export default function useDatahub() {

    let searchURLs = []
    //http://131.176.236.55/dhus/
    //https://scihub.copernicus.eu/apihub/search?
    searchURLs["S1"] = 'https://131.176.236.55/dhus/search?q=(%20beginposition:[{start}%20TO%20{end}]%20AND%20platformname:Sentinel-1%20AND%20producttype:GRD)&start={startindex}&rows=100&sortedby=ingestiondate&order=desc&format=json'
    searchURLs["S2"] = 'https://131.176.236.55/dhus/search?q=(%20beginposition:[{start}%20TO%20{end}]%20AND%20platformname:Sentinel-2%20AND%20producttype:S2MSI1C)&start={startindex}&rows=100&sortedby=ingestiondate&order=desc&format=json'
    searchURLs["S3"] = 'https://131.176.236.55/dhus/search?q=(%20beginposition:[{start}%20TO%20{end}]%20AND%20platformname:Sentinel-3%20AND%20(producttype:OL_1_ERR___%20OR%20producttype:SL_1_RBT___%20OR%20producttype:SR_1_SRA___))&start={startindex}&rows=100&sortedby=ingestiondate&order=desc&format=json'
    searchURLs["S5P"] = 'https://s5phub.copernicus.eu/search?q=(%20beginposition:[{start}%20TO%20{end}]%20AND%20platformname:Sentinel-5 precursor%20AND%20(producttype:L1B_RA_BD1%20OR%20(producttype:L2__NO2___%20AND%20processingmode:Near real time)))&start={startindex}&rows=100&sortedby=ingestiondate&order=desc&format=json'
    searchURLs["ENVISAT"] = 'https://eocat.esa.int/ngeo/catalogue/FEDEO-ENVISAT.ASA.IMP_1P/search?start={start}&stop={end}&format=json&count=50&startIndex={startindex}'
    
    // search time window size in ms
    const windowSize = 1000 * 60 * 60 * 3

    const [geojsonResults, setGeojsonResults] = useState({})
    const [loading, setLoading] = useState(false)
    
    const [ searchdate,  ] = useGlobal('searchdate');
    const [ mission,  ] = useGlobal('mission');
    const [ searchUrl, setSearchurl  ] = useState('');

    const [ pagination, setPagination ] = useState({totalresults:0 ,startindex:0, itemsperpage:0});

//{totalresults,startindex}
    useEffect(() => {
        const fetchURL = async () => {
            setLoading(true)
            console.log('Search: '+ searchUrl)
            try {
                const response = await fetch(searchUrl, {mode: 'cors', credentials: 'include'})
                const json = await response.json()
                const geoJson = (mission === 'ENVISAT')? json : dhusToGeojson(json)
                console.log('totalResults: ' + geoJson.properties.totalResults)
                setPagination( 
                    {
                    totalresults: Number(geoJson.properties.totalResults) ,
                    startindex:  Number(geoJson.properties.startIndex), 
                    itemsperpage:  Number(geoJson.properties.itemsPerPage), 
                    })
                if(Number(geoJson.properties.totalResults>0)) setGeojsonResults(geoJson) 
                setLoading(false);   
            } catch {
                console.log("Didn't recieve a json !")
                //console.log(response)
                setLoading(false);
            }
            
        }
        fetchURL(searchUrl);
    }, [searchUrl]);
    
    useEffect(() => {
        console.log(pagination)
        if(pagination.startindex + pagination.itemsperpage < pagination.totalresults) {
            let url = searchURLs[mission]
            console.log("There's More...")
            try {
                url = url.replace("{start}", dateFormat(new Date(searchdate - windowSize/2),'isoUtcDateTime'));
                url = url.replace("{end}", dateFormat(new Date(searchdate + windowSize/2),'isoUtcDateTime'));
                url = url.replace("{startindex}", pagination.startindex + pagination.itemsperpage);
                //console.log("Next URL: " + url)
                setSearchurl(url)
        
            } catch {
                console.log('Not a JULIAN date !')
            }
        }
    }, [pagination]);

    useEffect(() => {
        console.log('DataHub ready. '+mission)
    }, []);

    useEffect(() => {
        
        if(mission && searchdate) {
            
            let url = searchURLs[mission]
            //if(mission in ["S1","S2","S3"]) url = searchURLs[mission]
            try {
                url = url.replace("{start}", dateFormat(new Date(searchdate - windowSize/2),'isoUtcDateTime'));
                url = url.replace("{end}", dateFormat(new Date(searchdate + windowSize/2),'isoUtcDateTime'));
                url = url.replace("{startindex}", 0);
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

    return {geojsonResults, loading}
}
