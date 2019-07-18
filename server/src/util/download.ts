import fs from "fs";
import https from "https";

const download = (link: string, dest: string) =>
  new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(link, response => {
      response.pipe(file);

      file
        .on("finish", () => {
          file.close();
          resolve();
        })
        .on("error", error => {
          fs.unlink(dest, unlinkError => {
            reject(unlinkError || error);
          });
        });
    });
  });

export default download;
