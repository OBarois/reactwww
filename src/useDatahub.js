import { useState, useEffect, useRef } from "react";
import dhusToGeojson from "./dhusToGeojson";
import { useGlobal } from 'reactn';



export default function useDatahub(url) {

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
        fetchUrl();
    }, [searchdate]);
    
/*
    useEffect(() => {
        fetchUrl();
    }, []);
    */

    return {data, loading}
}
