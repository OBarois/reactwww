import { useState, useEffect, useRef } from "react";
import dhusToGeojson from "./dhusToGeojson";
import { useGlobal } from 'reactn';
import dateFormat from "dateformat"



export default function useDatahub(baseurl) {

    const searchURL = 'https://scihub.copernicus.eu/apihub/search?q=(%20beginposition:[{start}%20TO%20{end}]%20AND%20platformname:Sentinel-1%20AND%20producttype:GRD)&start=0&rows=50&sortedby=ingestiondate&order=desc&format=json'
    let url = searchURL
    // search time window size in ms
    const windowSize = 1000 * 60 * 60 * 3

    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);

    async function fetchUrl() {
        console.log('Search: '+ url)
        const response = await fetch(url);
        const json = await response.json();
        const geoJson = dhusToGeojson(json)
        setData(geoJson);
        setLoading(false);
        }

    const [ searchdate, setSearchdate ] = useGlobal('searchdate');
    useEffect(() => {
        console.log(dateFormat(new Date(searchdate - windowSize/2),'isoUtcDateTime'))
        url = url.replace("{start}", dateFormat(new Date(searchdate - windowSize/2),'isoUtcDateTime'));
        url = url.replace("{end}", dateFormat(new Date(searchdate + windowSize/2),'isoUtcDateTime'));
        fetchUrl();
    }, [searchdate]);
    
/*
    useEffect(() => {
        fetchUrl();
    }, []);
    */

    return {data, loading}
}
