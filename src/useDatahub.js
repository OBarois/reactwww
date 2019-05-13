import { useState, useEffect, useRef } from "react";
import dhusToGeojson from "./dhusToGeojson";
import { useGlobal } from 'reactn';
import dateFormat from "dateformat"



export default function useDatahub() {

    let searchURLs = []
    //http://131.176.236.55/dhus/
    searchURLs["S1"] = 'https://scihub.copernicus.eu/apihub/search?q=(%20beginposition:[{start}%20TO%20{end}]%20AND%20platformname:Sentinel-1%20AND%20producttype:GRD)&start=0&rows=100&sortedby=ingestiondate&order=desc&format=json'
    searchURLs["S2"] = 'https://scihub.copernicus.eu/apihub/search?q=(%20beginposition:[{start}%20TO%20{end}]%20AND%20platformname:Sentinel-2%20AND%20producttype:S2MSI1C)&start=0&rows=100&sortedby=ingestiondate&order=desc&format=json'
    searchURLs["S3"] = 'https://scihub.copernicus.eu/apihub/search?q=(%20beginposition:[{start}%20TO%20{end}]%20AND%20platformname:Sentinel-3%20AND%20(producttype:OL_1_ERR___%20OR%20producttype:SL_1_RBT___%20OR%20producttype:SR_1_SRA___))&start=0&rows=100&sortedby=ingestiondate&order=desc&format=json'
    searchURLs["S5P"] = 'https://s5phub.copernicus.eu/search?q=(%20beginposition:[{start}%20TO%20{end}]%20AND%20platformname:Sentinel-5 precursor%20AND%20(producttype:L1B_RA_BD1%20OR%20(producttype:L2__NO2___%20AND%20processingmode:Near real time)))&start=0&rows=100&sortedby=ingestiondate&order=desc&format=json'

    
    // search time window size in ms
    const windowSize = 1000 * 60 * 60 * 3

    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);

    async function fetchUrl(url) {
        console.log('Search: '+ url)
        const response = await fetch(url);
        const json = await response.json();
        const geoJson = dhusToGeojson(json)
        setData(geoJson);
        setLoading(false);
        }

    const [ searchdate,  ] = useGlobal('searchdate');
    const [ mission,  ] = useGlobal('mission');

    useEffect(() => {
        console.log('mission for dhus: '+mission)
        let url = searchURLs[mission]
        if(mission in ["S1","S2","S3"]) url = searchURLs[mission]
        url = url.replace("{start}", dateFormat(new Date(searchdate - windowSize/2),'isoUtcDateTime'));
        url = url.replace("{end}", dateFormat(new Date(searchdate + windowSize/2),'isoUtcDateTime'));
        fetchUrl(url);
    }, [searchdate, mission]);
/*    
    const [ mission, setMission ] = useGlobal('mission');
    useEffect(() => {
        if(mission in ["S1","S2","S3"]) setUrl(searchURLs[mission])
    }, [mission]);
    */

    return {data, loading}
}
