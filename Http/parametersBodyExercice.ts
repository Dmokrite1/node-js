/*
* version corrigé du formateur
*/

import { readFile, writeFile } from 'fs/promises';
import http from 'http';

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
    const urlObject = new URL(req.url!, "http://localhost:8001");

    if (urlObject.pathname === "/users") {
        const usersData = await readFile('./users.json', "utf-8");
        const users: Array<{
            id: number,
            firstName: string,
            lastName: string,
            password: string
        }> = JSON.parse(usersData);

        if (req.method === "GET") {
            res.writeHead(200, {
                "content-type": "application/json",
            });
            const id = urlObject.searchParams.get("id");
            if (id) {
                const filteredUsers = users.filter(user => user.id === Number(id));
                return res.end(JSON.stringify(filteredUsers))
            }
                res.end(JSON.stringify(users));
        }

        if (req.method === "POST") {
            const body = await readBodyAndParse(req) as {
                firstName: string,
                lastName: string,
                password: string,
            };
            const newUser = {
                id: users.length + 1,
                ...body
            };
            users.push(newUser);
            await writeFile('./users.json', JSON.stringify(users));

            res.writeHead(200, {
                "content-type": "application/json"
            })
            res.end(JSON.stringify(newUser))
        }
    }
});

server.listen(8001, () => {
    console.log("Je t'écoute sur le port 8001");
});
