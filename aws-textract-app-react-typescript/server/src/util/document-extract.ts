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
    region: process.env["AWS_REGION"],
    credentials: {
      accessKeyId: process.env["AWS_ACCESS_KEY"]!,
      secretAccessKey: process.env["AWS_SECRET_KEY"]!,
    },
  });
  const command = new AnalyzeDocumentCommand({
    Document: {
      S3Object: {
        Bucket: process.env["AWS_BUCKET"],
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

export default documentExtract;
