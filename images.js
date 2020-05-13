const fs = require("fs");
const request = require("request");

const file = fs.readFileSync("./json/RMP-SCRAPES.json");
const json = JSON.parse(file);

const download = (url, path, callback) => {
  return new Promise((resolve) => {
    request.get(
      url,
      { forever: true, timeout: 3600000, time: true },
      (err, res, body) => {
        request(url)
          .pipe(fs.createWriteStream(path))
          .on("close", () => {
            callback();
            resolve();
          });
      }
    );
  });
};

const downloadImages = async () => {
  for (const item of json) {
    const url = item.src;
    const imgTitle = item.title;
    const path = `./images/${imgTitle}.jpg`;
    const finalImg = await download(url, path, () => {
      console.log(`✅ ${imgTitle} downloaded`);
    });
  }
};

downloadImages();
