const fs = require("fs");
const request = require("request");

const file = fs.readFileSync("C:/Users/Sales/Desktop/RMP-SCRAPES.json");
const json = JSON.parse(file);

// const getImgPromise = new Promise((resolve, reject) => {
//   download(url, path, () => {
//     console.log("✅ Done!");
//     resolve("done");
//   });
// });

const download = (url, path, callback) => {
  request.get(url, {forever: true, timeout: 3600000, time: true}, (err, res, body) => {
    request(url).pipe(fs.createWriteStream(path)).on("close", callback);
  });
};

const promises = [];

json.forEach((item) => {
  const url = item.src;
  const imgTitle = item.title;
  const path = `./images/${imgTitle}.jpg`;
  promises.push(
    new Promise((resolve, reject) => {
      download(url, path, () => {
        console.log("✅ Done!");
        resolve("done");
      });
    })
  );
});

Promise.all(promises).then(() => {
    console.log("all images downloaded")
})
