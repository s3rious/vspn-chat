import fs from "fs";
import path from "path";
import sharp from "sharp";
import util from "util";

import { Telegram } from "telegraf";

import cnsl from "./cnsl";
import download from "./download";

const accessPromise = util.promisify(fs.access);
const unlinkPromise = util.promisify(fs.unlink);

type FileType = "animations" | "avatars" | "photos" | "stickers";

const processFile = (telegram: Telegram, fileId: string, type: FileType): Promise<string> =>
  new Promise(async (resolve, reject) => {
    const destPath = {
      animations: path.resolve(process.cwd(), "./media/animations"),
      avatars: path.resolve(process.cwd(), "./media/avatars"),
      photos: path.resolve(process.cwd(), "./media/photos"),
      stickers: path.resolve(process.cwd(), "./media/stickers")
    }[type];
    const tmpPath = {
      animations: destPath,
      avatars: path.resolve(process.cwd(), "./.tmp/avatars"),
      photos: destPath,
      stickers: path.resolve(process.cwd(), "./.tmp/stickers")
    }[type];
    const destExtention = {
      animations: "mp4",
      avatars: "png",
      photos: "jpg",
      stickers: "png"
    }[type];
    const tmpExtention = {
      animations: destExtention,
      avatars: destExtention,
      photos: destExtention,
      stickers: "webp"
    }[type];
    const webPath = {
      animations: `animations/${fileId}.${destExtention}`,
      avatars: `avatars/${fileId}.${destExtention}`,
      photos: `photos/${fileId}.${destExtention}`,
      stickers: `stickers/${fileId}.${destExtention}`
    }[type];

    const dest = `${destPath}/${fileId}.${destExtention}`;

    try {
      await accessPromise(dest);
      cnsl.log(`File exits.\nDest: ${dest}`);

      resolve(webPath);
    } catch (error) {
      if (error.code === "ENOENT") {
        const link = await telegram.getFileLink(fileId);
        const tempDest = `${tmpPath}/${fileId}.${tmpExtention}`;

        cnsl.log(`File is not exists, downloading it.\nLink: ${link};\nTempDest: ${tempDest}`);
        await download(link, tempDest);
        cnsl.log("Downloaded");

        if (type === "avatars") {
          await sharp(tempDest).resize(256, 256, { withoutEnlargement: true }).toFile(dest);
          cnsl.log("Converted");
          unlinkPromise(tempDest);
        }

        if (type === "stickers") {
          await sharp(tempDest).toFile(dest);
          cnsl.log("Converted");
          unlinkPromise(tempDest);
        }

        resolve(webPath);
      }

      reject(error);
    }
  });

export default processFile;
