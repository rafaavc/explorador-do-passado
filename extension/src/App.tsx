import { useEffect, useState } from 'react';
import Axios, { AxiosResponse } from 'axios'

function App() {
    const [data, setData] = useState(-1);

    useEffect(() => {
        Axios.get("http://arquivo.pt/textsearch", { 
            params: {
                type: 'html',
                fields: 'title, originalURL, tstamp, linkToScreenshot, linkToNoFrame, collection, snippet',
                q: 'António Costa',
                maxItems: 50
            }
        }).then((response: AxiosResponse) => {
                setData(response.data.estimated_nr_results);
                console.log(response);
            }).catch(error => {
                console.log(error); // send error to content script
            });
    }, []);

    return (
        <>
            <h1>Hello Extensions</h1>
            <p>
                {data}
            </p>
        </>
    );
}

export default App;
