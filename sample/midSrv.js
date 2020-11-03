const { promises } = require('fs');

const http = require('http'),
    port = 4000,
    route = '/transObserver';

const request = (url, resolve, reject) => {
    console.log(`requesting ${url}`)
    http.get(url, (res) => {
        const { statusCode } = res;
        const contentType = res.headers['content-type'];
        let error;
        if (statusCode !== 200) {
            error = new Error(`Request Failed.\nStatus Code: ${statusCode}`);
        } else if (!/^application\/json/.test(contentType)) {
            error = new Error(`Invalid content-type.\nExpected application/json but received ${contentType}`);
        }
        if (error) {
            reject(error.message);
            // Consume response data to free up memory
            res.resume();
            return;
        }
        res.setEncoding('utf8');
        let rawData = '';
        res.on('data', (chunk) => { rawData += chunk.toString(); });
        res.on('end', () => {
            try {
                const parsedData = JSON.parse(rawData);
                resolve({data: parsedData, url});
            } catch (e) {
                reject(e.message);
            }
        });
    }).on('error', (e) => {
        reject(`Got error: ${e.message}`);
    });
};

http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Request-Method', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, POST');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Content-Type', 'application/json');
    const url = req.url,
        method = req.method,
        startRequests = requests => {
            console.log('requests', requests)
            return Promise.all(
                Object.keys(requests).reduce((acc, endpoint) => {
                    console.log(endpoint)
                    acc.push(new Promise((resolve, reject) => request(endpoint, resolve, reject)))
                    return acc
                }, [])
            ).then(reply)
        },
        reply = data => res.end(JSON.stringify(data));

    if (method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
    }
    else if (method === 'POST' && url === route) {
        let body = '';
        req.on('data', data => body += data);
        // body already has the stringified version
        req.on('end', () => {
            const json = JSON.parse(body)
            startRequests(json)
        });
    } else {
        res.statusCode = 400;
        res.end('400: Bad Request');
    }
}).listen(port, () => {
    console.log(`Mitm server started on port ${port}`);
});