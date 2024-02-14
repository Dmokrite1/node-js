/*
* Version avec objet dans le code
*/

/*
import http from 'http';

const postsData = {
    "posts": [
        {
            "title": "Covid-19 : précision suisse et prévisions globales",
            "content": "Un consortium émanant de hautes écoles suisses a mis en place un tableau de bord fournissant quotidiennement des prévisions épidémiologiques à 7 jours pour 209 pays et territoires dans le monde. Relayées sur les réseaux sociaux, les médias internationaux et les sites des grandes agences de sécurité sanitaire, ces prévisions peuvent aider au guidage des politiques publiques."
        },
        {
            "title": "Vers de nouvelles mesures \"Covid\"? Le Premier ministre accélère l’agenda des réunions prévues ",
            "content": "Le Premier ministre a également décidé d'avancer la réunion du Conseil des ministres à ce soir, 20 heures, afin de discuter de la situation avec les vice-premiers ministres fédéraux.Le Comité de concertation pourrait également être avancé, éventuellement, à mercredi matin.Le dernier Comité de concertation avait eu lieu vendredi dernier, et avait abouti essentiellement à un léger tour de vis dans l’enseignement, ainsi qu’à un report du \"plan plein air\". Rapidement, il était apparu qu’un nouveau Comité de concertation pourrait être convoqué sous peu, pour édicter éventuellement des mesures plus restrictives."
        },
        {
            "title": "Hétéro, homo, bi, lesbienne, gay : ces jeunes qui refusent les étiquettes ",
            "content": "Camille, Sophie, Mélanie, Ariane et Jolyn ont accepté de nous parler de leur cheminement. Ce sont des esprits libres, qui étoufferaient dans le carcan étriqué des étiquettes. Elles n’ont pas trouvé de mots qui leur conviennent, alors elles ont décidé de ne pas choisir.Elles ont toutes fait des hautes études, ou sont encore en train d’étudier. Ce genre de réflexion sur l’orientation sexuelle apparaît principalement dans des milieux à la fois plus éduqués, et plus ouverts. Ailleurs, l’homophobie est encore (trop) régulièrement présente dans les discours."
        }
    ]
};

const server = http.createServer((request, response) => {
    const html = `
    <html>
        <head>
            <title>Posts</title>
            <meta charset="utf-8">
        </head>
        <body>
            <h1>Posts</h1>
            <ul>
                ${postsData.posts.map(post => `
                <li>
                    <h2>${post.title}</h2>
                    <p>${post.content}</p>
                </li>
                `).join('')}
            </ul>
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
*/

/*
* Version avec fs pour aller chercher le fichier
*/

/*
import http from 'http';
import fs from 'fs';

const server = http.createServer((request, response) => {

    fs.readFile('./posts.json', 'utf-8', (err, data) => {
        if (err) {
            console.error('Erreur de lecture du fichier :', err);
            response.writeHead(500, { 'Content-Type': 'text/error' });
            response.end('Erreur interne du serveur');
            return;
        }

        try {
            const postsData = JSON.parse(data);

            const html = `
                <html>
                    <head>
                        <title>Posts</title>
                        <meta charset="utf-8">
                    </head>
                    <body>
                        <h1>Posts</h1>
                        <ul>
                            ${postsData.posts.map((post: { 
                            title: string, 
                            content: string }) => 
                            `
                            <li>
                                <h2>${post.title}</h2>
                                <p>${post.content}</p>
                            </li>
                            `).join('')}
                        </ul>
                    </body>
                </html>
            `;

        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.end(html);
        } catch (parseError) {
            console.error('Erreur de parsage du JSON :', parseError);
            response.writeHead(500, { 'Content-Type': 'text/error' });
            response.end('Erreur interne du serveur');
        }
    });
});

server.listen(8001, () => {
    console.log('Le serveur est prêt à écouter. Il écoute sur le port 8001');
});
*/

/*
* Version du formateur
*/

import { readFile } from 'fs/promises';
import http from 'http';

const server = http.createServer(async (req, res) => {
    const { posts }: {
        posts: Array<{
            title: string,
            content: string,
        }>
    } = JSON.parse(await readFile('./posts.json', 'utf-8'))


const html = `
    <html>
        <head> 
            <title> Le titre </title>
            <meta charset="utf-8">
        </head>
        <body>
            <h1>Articles</h1>
            ${posts.map(post => `<h3>${post.title}</h3><p>${post.content}</p>`).join('')}
        </body>
    </html>
`;

res.writeHead(200, {
    "content-type": "text/html",
})

res.end(html)
});

server.listen(8001, () => {
    console.log("Port à l'écoute sur le port 8001");
})