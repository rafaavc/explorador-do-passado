import { useEffect, useState } from 'react';
import { Message } from './utils/Message';

interface Data {
    article: {
        title: string,
        authors: Array<string>,
        text: string
    }
}

function App() {
    const [data, setData] = useState<Data|null>(null);

    useEffect(() => {
        const message: Message = { type: "get_ui_data" }
        chrome.runtime.sendMessage(message, (data) => {
            setData(data)
        })
    }, []);

    return (
        <>
            <h1>Hello Extensions</h1>
            <p>
                {data === null ? "nothing" : data.article.title}
            </p>
        </>
    );
}

export default App;
