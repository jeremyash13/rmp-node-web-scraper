require("dotenv").config();
const AWS = require("aws-sdk");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;
const fs = require("fs");
const request = require("request");

const file = fs.readFileSync("./json/RMP-SCRAPES.json");
const json = JSON.parse(file);

const BUCKET_NAME = process.env.BUCKET_NAME;
const IAM_USER_KEY = process.env.IAM_USER_KEY;
const IAM_USER_SECRET = process.env.IAM_USER_SECRET;

// app.post("/s3", upload.single("file"), async (req, res) => {
//     console.log("POST request made at /s3");
//     console.log(req.file);
// try {

const uploadImages = () => {
    const file = json[0];
    const name = json[0].title;
  let s3bucket = new AWS.S3({
    accessKeyId: IAM_USER_KEY,
    secretAccessKey: IAM_USER_SECRET,
    Bucket: BUCKET_NAME,
  });
  const params = {
    Bucket: BUCKET_NAME,
    Body: file,
    Key: name,
    ContentType: "image/jpeg",
  };
  s3bucket.upload(params, function (err, data) {
    if (err) {
      console.log("error in callback");
      console.log(err);
    } else {
      console.log(data);
      console.log("image successfully uploaded to AWS S3");
      console.log("location: " + data.Location);
    }
  });
};

// } catch (err) {
//   res.json({ msg: err });
//   console.log(err);
// }
//   });
