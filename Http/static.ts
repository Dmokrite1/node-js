import { readFile } from 'fs/promises';
import http from 'http';

const server = http.createServer(async (req, res) => {
    const extensionContentType: Record<string, string> = {
        html: 'text/html',
        jpg: 'image/jpg',
        css: 'text/css',
    };

    const extension = req.url?.split('.').pop()!;

    if (Object.keys(extensionContentType).includes(extension) === false) {
        res.writeHead(404, {
            "content-type": "text/html"
        })
        return res.end(`
            <html>
                <head>
                    <title>Page 404</title>
                </head>
                <body>
                    Not Found
                </body>
            </html>    
        `);
    }

    res.writeHead(200, {
        "content-type": extensionContentType[extension],
    });

    // Ici on commence avec un point parce que le request.url commence par un "/"
    const fileStream = await readFile(`.${req.url}`);
    
    res.end(fileStream);
});

server.listen(8001, () => {
    console.log("Je suis à l'écoute sur le port 8001");
});
