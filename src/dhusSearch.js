import React from "react";

import { useState, useEffect, useRef } from "react";
import useDatahub from "./useDatahub";
import { useGlobal } from 'reactn';




export default function dhusSearch() {

    const searchURL = 'https://scihub.copernicus.eu/apihub/search?q=(%20%20platformname:Sentinel-1)&start=0&rows=50&sortedby=ingestiondate&order=desc&format=json'

    const [ searchdate, setSearchdate ] = useGlobal('searchdate');
    const [ response, loading] = useDatahub(searchURL)
    //console.log("Render TimerLabel (appdate): "+appdate)

    useEffect(() => {
        fetchUrl();
    }, [searchdate]);


    return (
        <div>
            {(new Date(appdate) ).toUTCString()} 
        </div>
    );
}

