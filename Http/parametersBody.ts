import http from 'http'

function readBodyAndParse (req: http.IncomingMessage) {
    return new Promise((resolve, reject) => {
        let output = "";

        req.once('error', (err) => {
             reject(err);
        })
        req.on('data', (data) => {
            output += data.toString();
        })

        req.once('end', ()=> {
            const body = JSON.parse(output);
            resolve(body)
        })
    })
}

const server = http.createServer(async (req, res) => {
    console.log(`${req.method}: request for ${req.url}`);
    const urlObject = new URL(req.url!, "http://localhost:8001")
    console.log(urlObject);
    console.log(urlObject.searchParams.get('banane'));
    console.log(urlObject.searchParams.getAll('cerise'));
    
    if(req.method === "POST"){
        const body = await readBodyAndParse(req);
        console.log(body);
        
    }
    res.end();
})

server.listen(8001, () => {
    console.log("I listen you on port 8001");
}) 