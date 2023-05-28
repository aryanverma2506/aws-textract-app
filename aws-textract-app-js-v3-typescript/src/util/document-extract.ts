import {
  TextractClient,
  AnalyzeDocumentCommand,
  AnalyzeDocumentCommandOutput,
} from "@aws-sdk/client-textract";

// JS V3
async function documentExtract(
  key: string
): Promise<AnalyzeDocumentCommandOutput> {
  const textractClient = new TextractClient({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY!,
      secretAccessKey: process.env.AWS_SECRET_KEY!,
    },
  });
  const command = new AnalyzeDocumentCommand({
    Document: {
      S3Object: {
        Bucket: process.env.AWS_BUCKET,
        Name: key,
      },
    },
    FeatureTypes: ["FORMS"],
  });

  try {
    const response = await textractClient.send(command);
    return response;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

// JS V2
// import AWS from 'aws-sdk';

// async function documentExtract(key: string): Promise<any> {
//   return new Promise<any>((resolve) => {
//     const textract = new AWS.Textract({
//       region: process.env.AWS_REGION,
//       endpoint: `https://textract.${process.env.AWS_REGION}.amazonaws.com/`,
//       accessKeyId: process.env.AWS_ACCESS_KEY,
//       secretAccessKey: process.env.AWS_SECRET_KEY,
//     });

//     const params: AWS.Textract.AnalyzeDocumentRequest = {
//       Document: {
//         S3Object: {
//           Bucket: process.env.AWS_BUCKET,
//           Name: key,
//         },
//       },
//       FeatureTypes: ["FORMS"],
//     };

//     textract.analyzeDocument(params, (err: AWS.AWSError, data: AWS.Textract.AnalyzeDocumentResponse) => {
//       if (err) {
//         return resolve(err);
//       } else {
//         resolve(data);
//       }
//     });
//   });
// }

export default documentExtract;
