const formidable = require("formidable");
const fs = require("fs");

const s3Upload = require("../util/s3Upload");
const documentExtract = require("../util/documentExtract");

exports.getIndex = (req, res, next) => {
  res.render("index", { title: "AWS Textract Uploader", data: "" });
};

exports.canvasUpload = (req, res, next) => {
  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error(err);
    }
    const fileContent = fs.readFileSync(files.canvasImage.path);
    const s3Params = {
      Bucket: process.env.AWS_BUCKET,
      Key: `${new Date().toISOString().replace(/:/g, "_")}-${
        files.canvasImage.name
      }`,
      Body: fileContent,
      ContentType: files.canvasImage.type,
    };
    const s3Content = await s3Upload(s3Params);
    const textractData = await documentExtract(s3Content.Key);
    console.log(textractData);
    let data = "";
    for (const words of textractData.Blocks) {
      if (words.BlockType === "WORD") {
        data += words.Text.toString() + " ";
      }
    }
    res.status(200).json({ data });
  });
};

exports.fileUpload = (req, res, next) => {
  // Upload logic
  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error(err);
    }
    const fileContent = fs.readFileSync(files.fileUpload.path);
    const s3Params = {
      Bucket: process.env.AWS_BUCKET,
      Key: `${new Date().toISOString().replace(/:/g, "_")}-${
        files.fileUpload.name
      }`,
      Body: fileContent,
      ContentType: files.fileUpload.type,
    };
    const s3Content = await s3Upload(s3Params);
    const textractData = await documentExtract(s3Content.Key);
    console.log(textractData);
    let data = "";
    for (const words of textractData.Blocks) {
      if (words.BlockType === "WORD") {
        data += words.Text.toString() + " ";
      }
    }
    res.render("index", { title: "AWS Textract Uploader", data });
  });
};
