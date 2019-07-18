import fs from "fs";
import path from "path";
import sharp from "sharp";
import util from "util";

import { Telegram } from "telegraf";

import cnsl from "./cnsl";
import download from "./download";

const { MEDIA_BASE_URL, TG_BOT_TOKEN } = process.env;

const accessPromise = util.promisify(fs.access);
const unlinkPromise = util.promisify(fs.unlink);
const telegram = new Telegram(TG_BOT_TOKEN);

type FileType = "stickers" | "photos" | "animations";

const processFile = (fileId: string, type: FileType): Promise<string> =>
  new Promise(async (resolve, reject) => {
    const destPath = {
      animations: path.resolve(process.cwd(), "./media/animations"),
      photos: path.resolve(process.cwd(), "./media/photos"),
      stickers: path.resolve(process.cwd(), "./media/stickers")
    }[type];
    const tmpPath = {
      animations: destPath,
      photos: destPath,
      stickers: path.resolve(process.cwd(), "./.tmp/stickers")
    }[type];
    const destExtention = {
      animations: "mp4",
      photos: "jpg",
      stickers: "png"
    }[type];
    const tmpExtention = {
      animations: destExtention,
      photos: destExtention,
      stickers: "webp"
    }[type];
    const webPath = {
      animations: `${MEDIA_BASE_URL}animations/${fileId}.${destExtention}`,
      photos: `${MEDIA_BASE_URL}photos/${fileId}.${destExtention}`,
      stickers: `${MEDIA_BASE_URL}stickers/${fileId}.${destExtention}`
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

        cnsl.log(
          `File is not exists, downloading it.\nLink: ${link};\nTempDest: ${tempDest}`
        );
        await download(link, tempDest);
        cnsl.log("Downloaded");

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
