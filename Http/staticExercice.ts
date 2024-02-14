/*
* Version exercice
*/

/*
import { readFile } from 'fs/promises';
import http from 'http';

const server = http.createServer(async (req, res) => {
    const extensionContentType: Record<string, string> = {
        html: 'text/html',
        jpg: 'image/jpg',
        jpeg: 'image/jpeg',
        css: 'text/css',
        js: 'application/javascript'
    };

    const extension = req.url?.split('.').pop()!;

    try {
        if (extension === 'html') {
            const fileStream = await readFile('./public/index.html', 'utf-8');
            
            res.writeHead(200, { "content-type": extensionContentType[extension] });
            res.end(fileStream);
        } else if (Object.keys(extensionContentType).includes(extension)) {
            const fileStream = await readFile(`./public${req.url}`)
            
            res.writeHead(200, { "content-type": extensionContentType[extension] });
            res.end(fileStream);
        } else {
            throw new Error('Unsupported file type');
        }
    } catch (error: any) {
        console.error(`Error: ${error.message}`);
        // Error No ENTry
        if (error.code === 'ENOENT') {
            res.writeHead(404, { "content-type": "text/html" });
            res.end(`
                <html>
                    <head>
                        <title>Page 404</title>
                    </head>
                    <body>
                        Not Found
                    </body>
                </html>
            `);
        } else {
            res.writeHead(500, { "content-type": "text/html" });
            res.end(`
                <html>
                    <head>
                        <title>Internal Server Error</title>
                    </head>
                    <body>
                        Internal Server Error
                    </body>
                </html>
            `);
        }
    }
});

const PORT = 8001;
server.listen(PORT, () => {
    console.log(`Le serveur est à l'écoute sur le port ${PORT}`);
});
*/

/*
* Version corrigé
*/

/*
import { readFile } from 'fs/promises';
import http from 'http';

const imageTypes = ['jpg', 'jpeg', 'png', 'bmp'];

const extensionContentType: Record<string, string> = {
    css: 'text/css',
    js: 'application/ javascript',
}

const server = http.createServer(async (req, res) => {
    let contentType;
    let output;
    let statusCode = 200;

    const extension = req.url?.split('.').pop()!;
    try {
    if (req.url === '/') {
        output = await readFile('./index.html');
        contentType = 'text/html';
    } else if (imageTypes.includes(extension)) {
        output = await readFile(`.${req.url}`);
        contentType = 'image/*'
    } else if (extensionContentType[extension] !== undefined) {
        output = await readFile(`.${req.url}`);
        contentType = extensionContentType[extension];
    } else {
        output = 'NOT FOUND';
        contentType = "text/plain";
        statusCode = 404
    }
    } catch(error) {
        statusCode = 500,
        contentType = "text/plain",
        output = 'internal server Error'
    }

    res.writeHead(statusCode, {
        "content-type": contentType,
    })

    res.end(output)
})

server.listen(8001, () => {
    console.log('You are connect on the port 8001');
})
*/