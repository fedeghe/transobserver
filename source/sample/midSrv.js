const http = require('http'),
    port = 4000,
    route = '/transObserver';

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
            Object.keys(requests).reduce((acc, topic) => {
                acc = acc.concat(requests.topic)
                return acc
            }, [])
            var t = {
                "cars": {
                    "http://127.0.0.1:3001/cars": {
                        "writeCars": true
                    }
                },
                "stations": {
                    "http://127.0.0.1:3001/stations": {
                        "writeStations": true
                    }
                }
            };



            return reply(requests)
        },
        reply = data => res.end(data);

    if (method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
    }
    else if (method === 'POST' && url === route) {
        let body = '';
        req.on('data', data => body += data);
        // body already has the stringified version
        req.on('end', () => startRequests(body));
    } else {
        res.statusCode = 400;
        res.end('400: Bad Request');
    }
}).listen(port, () => {
    console.log(`Mitm server started on port ${port}`);
});