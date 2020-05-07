const request = require("request");
const cheerio = require("cheerio");

request(
  "http://rockymountainpublishing.net/RMP/artlist.cfm?Chunk=116&Table=Artists",
  (error, response, html) => {
    if (!error && response.statusCode === 200) {
      const myData = [];

      const $ = cheerio.load(html);

      const getUrls = async () => {
        // console.log("URLS:");
        const images = $("img");
        const target = $(".bigger");

        const newImages = images.map((i, el) => {
          const img = $(el);
          if (img.attr("src").includes("photos/") === true) {
            return img;
          }
        });
        newImages.each((i, el) => {
          const img = $(el).attr("src");
          myData.push({
            src: "http://rockymountainpublishing.net/RMP/" + img,
            info: target.children().text(),
          });
          //   console.log(img);
        });
        // return true
      };
      getUrls().then(() => {
        // console.log("INFO:");
        console.log(myData);
      });
    }
  }
);
