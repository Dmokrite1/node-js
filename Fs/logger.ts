/*
* V1
*/

/*
import { mkdir, rmdir, writeFile, unlink, readdir } from "fs/promises";
import { join } from "path";

const sleep = (ms: number) => new Promise((res, rej) => setTimeout(res, ms));

async function log(message: string) {
  const currentDate = new Date();
  const year = currentDate.getFullYear().toString();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  const day = currentDate.getDate().toString().padStart(2, "0");

  const logPath = join("logs", year, month, day);
  const filePath = join(logPath, "09.log");

  try {
    await mkdir(logPath, { recursive: true });
    console.log("Arborescence créée !");

    await sleep(2000);

    await writeFile(filePath, message);
    console.log(`Message ajouté au fichier ! à ${currentDate.getHours()}H`);
  } catch (error) {
    console.error("Une erreur s'est produite :", error);
  }
}

async function removeTodayLogs() {
  const currentDate = new Date();
  const year = currentDate.getFullYear().toString();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  const day = currentDate.getDate().toString().padStart(2, "0");

  const logPath = join("logs", year, month, day);

  try {
    const entries = await readdir(logPath);
    for (const entry of entries) {
      const entryPath = join(logPath, entry);
      await unlink(entryPath);
    }

    await rmdir(logPath);
    console.log("Logs de la journée supprimés !");
  } catch (error) {
    console.error("Une erreur s'est produite :", error);
  }
}

async function main() {
  try {
    await log("Banane");

    await sleep(2000);

    await removeTodayLogs();
  } catch (error) {
    console.error("Une erreur s'est produite :", error);
  }
}

main();
*/

/*
* Version du formateur
*/

import { opendir, mkdir, appendFile, rm } from "fs/promises";

function getDirectoryStructureForDate (date: Date) {
    return `logs/${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
}

async function isDirectoryStructureExisting (structure: string): Promise<boolean> {
    try{
        opendir(structure);
        return true;
    }catch{
        return false;
    }
}

export async function log (message: string) {
    const today = new Date();
    const directoryStructure = getDirectoryStructureForDate(today);

    if(await isDirectoryStructureExisting(directoryStructure) === false) {
        await mkdir(directoryStructure, {
            recursive: true,
        })
    }

    await appendFile(`${directoryStructure}/${today.getHours()}.log`, `${message}\n`);
}

export async function removeTodayLogs() {
    const today = new Date;
    const directoryStructure = getDirectoryStructureForDate(today);

    await rm(directoryStructure, { recursive: true, force: true})
}
