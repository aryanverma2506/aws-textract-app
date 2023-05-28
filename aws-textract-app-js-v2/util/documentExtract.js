const AWS = require("aws-sdk");

async function documentExtract(key) {
  return new Promise((resolve) => {
    const textract = new AWS.Textract({
      region: process.env.AWS_REGION,
      endpoint: `https://textract.${process.env.AWS_REGION}.amazonaws.com/`,
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_KEY,
    });
    const params = {
      Document: {
        S3Object: {
          Bucket: process.env.AWS_BUCKET,
          Name: key,
        },
      },
      FeatureTypes: ["FORMS"],
    };

    textract.analyzeDocument(params, (err, data) => {
      if (err) {
        return resolve(err);
      } else {
        resolve(data);
      }
    });
  });
}

module.exports = documentExtract;
