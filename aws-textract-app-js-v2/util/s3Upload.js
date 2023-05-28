const AWS = require("aws-sdk");

async function s3Upload(params) {
  const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  });
  return new Promise((resolve) => {
    // S3 ManagedUpload with callbacks are not supported in AWS SDK for JavaScript (v3).
    // Please convert to `await client.upload(params, options).promise()`, and re-run aws-sdk-js-codemod.
    s3.upload(params, (err, data) => {
      if (err) {
        console.error(err);
        resolve(err);
      } else {
        resolve(data);
      }
    });
  });
}

module.exports = s3Upload;
