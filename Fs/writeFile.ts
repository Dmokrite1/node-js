/*
import { appendFile, writeFile } from "fs/promises";

const names = ["Amand", "Denis", "Maxime"];
writeFile("agenda.txt", names.join('\n')).then(() => {
    console.log('write done !');
    appendFile('agenda.txt', "\nMon texte").then(() => {
        console.log('append done');
    })   
});
*/

/*
// Importe les fonctions `readFile` et `writeFile` du module 'fs/promises'
import { readFile, writeFile } from 'fs/promises';

// Fonction asynchrone qui fusionne le contenu de plusieurs fichiers en un seul
async function mergeFiles(...fileNames: string[]): Promise<void> {
    // Vérifie s'il y a moins de deux noms de fichier fournis, lance une erreur dans ce cas
    if (fileNames.length < 2) {
        throw new Error('Vous devez fournir au moins deux noms de fichier.');
    }

    // Tableau pour stocker le contenu de chaque fichier
    const contents: string[] = [];

    // Boucle à travers chaque nom de fichier
    for (const fileName of fileNames) {
        // Lit le contenu du fichier en tant qu'UTF-8 et l'ajoute au tableau
        const fileContent = await readFile(fileName, 'utf-8');
        contents.push(fileContent);
    }

    // Fusionne le contenu en une seule chaîne avec un saut de ligne entre chaque fichier
    const mergedContent = contents.join('\n');

    // Génère un nom de fichier fusionné en remplaçant les points par des underscores
    const mergedFileName = fileNames.join('+').replace(/\./g, '_') + '.txt';

    // Écrit le contenu fusionné dans un nouveau fichier
    await writeFile(mergedFileName, mergedContent, 'utf-8');

    // Affiche un message indiquant que la fusion est terminée avec le nom du fichier résultant
    console.log(`Fusion terminée. Le résultat est enregistré dans ${mergedFileName}`);
}

// Récupère les arguments en ligne de commande, excluant les deux premiers (nom du script et exécutable Node.js)
const args = process.argv.slice(2);

// Vérifie s'il y a moins de deux arguments (noms de fichier) fournis en ligne de commande, affiche une erreur dans ce cas
if (args.length < 2) {
    console.error('Vous devez fournir au moins deux noms de fichier en tant qu\'arguments.');
} else {
    // Appelle la fonction mergeFiles avec les noms de fichiers fournis en ligne de commande
    mergeFiles(...args);
}
*/

/*
* Version formateur
*/

import { readFile, writeFile } from "fs/promises";

function getFileNamesMerged(fileNames: string[]) {
    const fileNamesWhitoutExtension = fileNames.map(filename => {
        const splittedName = filename.split('.');
        splittedName.pop();
        return splittedName.join('.');
    }).join('+');

    const fileExtensions = fileNames.map(filename => filename.split('.').pop());
    const shouldBeFinalExtension = fileExtensions[0];

    for (const extension of fileExtensions.slice(0)) {
        if(extension !== shouldBeFinalExtension) {
            throw new Error('Filetypes are imcompatibles');
        }
    }

    return `${fileNamesWhitoutExtension}.${shouldBeFinalExtension}`;
}

async function mergeFiles(...fileNames: string[]) {
    const mergedNames = getFileNamesMerged(fileNames);
    const mergedContent = await Promise.all(fileNames.map(filename => readFile(filename, 'utf8')));
    await writeFile(mergedNames, mergedContent.join('\n'));
}

mergeFiles(...process.argv.slice(2));
