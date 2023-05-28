import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandOutput,
  PutObjectCommandInput,
} from "@aws-sdk/client-s3";

// JS V3
async function s3Upload(
  params: PutObjectCommandInput
): Promise<PutObjectCommandOutput> {
  const s3Client = new S3Client({
    region: process.env["AWS_REGION"],
    credentials: {
      accessKeyId: process.env["AWS_ACCESS_KEY"]!,
      secretAccessKey: process.env["AWS_SECRET_KEY"]!,
    },
  });
  const command = new PutObjectCommand(params);

  try {
    const response = await s3Client.send(command);
    return response;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export default s3Upload;
