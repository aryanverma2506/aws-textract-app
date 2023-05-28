import { S3Client, PutObjectCommand, } from "@aws-sdk/client-s3";
// JS V3
async function s3Upload(params) {
    const s3Client = new S3Client({
        region: process.env.AWS_REGION,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY,
            secretAccessKey: process.env.AWS_SECRET_KEY,
        },
    });
    const command = new PutObjectCommand(params);
    try {
        const response = await s3Client.send(command);
        return response;
    }
    catch (err) {
        console.error(err);
        throw err;
    }
}
// JS V2
// import AWS, { S3 } from "aws-sdk";
// async function s3Upload(params: S3.Types.PutObjectRequest): Promise<S3.ManagedUpload.SendData> {
//   const s3 = new AWS.S3({
//     accessKeyId: process.env.AWS_ACCESS_KEY,
//     secretAccessKey: process.env.AWS_SECRET_KEY,
//   });
//   return new Promise<S3.ManagedUpload.SendData>((resolve, reject) => {
//     s3.upload(params, (err: Error, data: S3.ManagedUpload.SendData) => {
//       if (err) {
//         console.error(err);
//         reject(err);
//       } else {
//         resolve(data);
//       }
//     });
//   });
// }
export default s3Upload;
//# sourceMappingURL=../../maps/util/s3-upload.js.map