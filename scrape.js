const request = require("request");
const cheerio = require("cheerio");

let pageNum = 1;
let totalPages = 17;
let masterData = [];

let url = `http://rockymountainpublishing.net/RMP/artlist.cfm?Chunk=98&Table=Artists&PageNum=${pageNum};`;

const scrapePage = async () => {
  console.log("Scraping Page: " + pageNum);
  let scrapedData = [];
  const results = new Promise((resolve, reject) => {
    request(url, (error, response, html) => {
      if (!error && response.statusCode === 200) {
        const $ = cheerio.load(html);

        // discover total pages, update variables
        const pageLinks = $("p a[class='tanondark']");
        totalPages = pageLinks.length + 1;

        // select targets for scraping
        const targets = $("table[width=600]");
        targets.each((i, el) => {
          //scrape each target
          const src = $(el).find("img").attr("src");

          const biggerLeft = $(el).find(".bigger[align='left'] b");
          const title = biggerLeft.html().split("<br>")[0];
          let sku = biggerLeft.html().split("<br>")[1];

          sku = sku.split(", ");
          const skuObj = sku.map((item) => {
            const newArr = item.split(" ");
            return {
              code: newArr[0],
              size: newArr[1],
              price: newArr[2],
            };
          });

          const artist = $(el).find(".bigger[align='right'] > b").html();
          let age;

          const bColl = $(el).find(".bigger[align='right'] b");
          bColl.each((i, el2) => {
            if (i === 1) {
              age = $(el2).text();
            }
          });

          scrapedData.push({
            title: title,
            artist: artist,
            src: "http://rockymountainpublishing.net/RMP/" + src,
            sku: skuObj,
            // sku: JSON.stringify(skuObj),
            age: age,
          });
          // console.log(finalData)
        });
        resolve(scrapedData);
      } else if (error) {
        reject(error);
      }
    });
  });
  pageNum++;
  return results;
};

do {
  scrapePage().then((singleScrape) => {
    masterData = [...masterData, ...singleScrape];
    // console.log('NEXT PAGE:')
    console.log(singleScrape);
  });
} while (pageNum <= totalPages);
