const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");

let masterData = [];

const scrapePage = async (url) => {
  try {
    console.log("Scraping URL: " + url);
    let scrapedData = [];
    const results = new Promise((resolve, reject) => {
      try {
        request(url, (error, response, html) => {
          if (!error && response.statusCode === 200) {
            const $ = cheerio.load(html);

            // select targets for scraping
            // const targets = $("table[width=600]");
            const targets = $('table[cellpadding="3cellspacing=0"]');
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

              //get artist data
              let artist = $(el).find(".bigger[align='right'] > b").html();
              artist = artist.replace(/ &#x2014; Giclees/, "");

              //get age data
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
      } catch (error) {
        return error;
      }
    });
    return results;
  } catch (error) {
    return error;
  }
};

const getTotalPages = async (url) => {
  const pageNumPromise = new Promise((resolve, reject) => {
    request(url, (error, response, html) => {
      let responseData = {
        pages: null,
        url: url,
      };
      const $ = cheerio.load(html);

      // discover total pages, update variables
      const pageLinks = $("p a[class='tanondark']");
      responseData.pages = pageLinks.length + 1;
      resolve(responseData);
    });
  });
  return await pageNumPromise;
};

getTotalPages(
  "http://rockymountainpublishing.net/RMP/artlist.cfm?Chunk=30&Table=Artists"
).then((responseData) => {

  let pageNum = 1;
  let totalPages = responseData.pages;
  do {
    let url = responseData.url + "&PageNum=" + pageNum

    scrapePage(url).then((singleScrape) => {
      masterData = [...masterData, ...singleScrape];
    });
    pageNum++;
  } while (pageNum <= totalPages);

  setTimeout(() => {
    // console.log(masterData);
    try{
      fs.appendFileSync("./json/RMP-SCRAPES.json", JSON.stringify(masterData))
      console.log("SCRAPE COMPLETE")
    } catch (err) {
      console.log(err)
    }
  }, 5000);
});
