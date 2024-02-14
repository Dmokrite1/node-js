/*
import { mkdir, rmdir, rename } from "fs/promises";

const sleep = (ms: number) => new Promise((res, rej) => setTimeout(res, ms));

async function main () {
    await mkdir("StorageTest");
    console.log("Dossier créé !");

    await sleep(2000);

    await rename("StorageTest", "Storage-Test");
    console.log("Dossier renommé !");
    
    await sleep(2000);

    await rename("Storage-Test", "../Storage-Test");
    console.log("Dossier déplacé !");

    await sleep(2000);

    await rmdir("../Storage-Test");
    console.log("Dossier supprimé");
}

main();
*/

import { log, removeTodayLogs } from "./logger";

function sleep (ms: number) {
    return new Promise((res, rej) => setTimeout(res, ms));
}
async function main() {
    await log(process.argv.slice(2).join(' '));
    await sleep(2000);
    await removeTodayLogs();
}

main();