import https from "https";

/*
const request = https.request({
    hostname: 'www.triptyk.eu',
    path: '/',
    port: 443,  // port sécurisé en cas de http = port 80
    method: 'GET'
}, (response) => {
    let output = "";

    response.on ('data', (data) => {
        output += data;
    })

    response.on('end', () => {
        console.log(output);
    })
})

request.end(); // sans appellé la method end la requete ne démarre pas
*/

// Même chose qu'au dessus en plus simple avec le fetch
fetch("https://www.triptyk.eu", {
    method: 'GET',
}).then(response => {
    response.text().then(text => {
        console.log(text);
    });
})
