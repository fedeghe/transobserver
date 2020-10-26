const http = require('http'),
    port = 4000,
    route = '/transObserver';

http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    const url = req.url,
        method = req.method,
        startRequests = body => {
            
        },
        aggregateResponses = () => {

        },
        reply = data => {
            res.write(Json.stringify(data));
            res.end();
        };

    if (method === 'POST' && url === route) {
        let body = '';
        req.on('data', data => body += data);
        // body is ready
        req.on('end',  () => startRequests(body));
    } else {
        res.statusCode = 400;
        res.end('400: Bad Request');
    }
}).listen(port, () => {
    console.log(`mid server start at port ${port}`);
});