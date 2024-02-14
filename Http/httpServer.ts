import http from 'http';

const server = http.createServer((request, response) => {
    const html = `
    <html>
        <head>
            <title>My first server node</title>
            <meta charset="utf-8">
        </head>
        <body>
            <h1>Lorem Ipsum</h1>
            <p>
            Aenean dapibus tristique tellus vitae consectetur. Fusce molestie, dolor placerat gravida finibus, dui felis sodales mauris, sed efficitur dui dolor non tortor. In convallis ante justo, nec viverra lacus scelerisque id.
            </p>
        </body>
    </html>
    `;

    response.writeHead(200, {
        "content-type": "text/html"
    })
    response.end(html);
})

server.listen(8001, () => {
    console.log('Le serveur est prêt à écouter, Il écoute sur le port 8001');
})