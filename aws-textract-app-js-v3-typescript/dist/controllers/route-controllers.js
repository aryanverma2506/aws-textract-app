import formidable from "formidable";
import fs from "fs/promises";
import s3Upload from "../util/s3-upload.js";
import documentExtract from "../util/document-extract.js";
export const getIndex = (req, res, next) => {
    res.render("index.ejs", { title: "AWS Textract Uploader JS V3", data: "" });
};
// JS V3
export const canvasUpload = async (req, res, next) => {
    const form = new formidable.IncomingForm();
    return form.parse(req, async (err, fields, files) => {
        if (err) {
            console.error(err);
            res.sendStatus(500);
            return;
        }
        try {
            const uploadedFile = Array.isArray(files.canvasImage)
                ? files.canvasImage[0]
                : files.canvasImage;
            if (!uploadedFile) {
                return res.sendStatus(400);
            }
            const fileContent = await fs.readFile(uploadedFile.filepath);
            const s3Params = {
                Bucket: process.env.AWS_BUCKET || "",
                Key: `${new Date().toISOString().replace(/:/g, "_")}-${uploadedFile.originalFilename}`,
                Body: fileContent,
                ContentType: uploadedFile.mimetype,
            };
            await s3Upload(s3Params);
            const textractData = await documentExtract(s3Params.Key);
            console.log(textractData);
            let data = "";
            if (textractData.Blocks) {
                for (const words of textractData.Blocks) {
                    if (words.Text && words.BlockType === "WORD") {
                        data += words.Text.toString() + " ";
                    }
                }
            }
            return res.status(200).json({ data });
        }
        catch (error) {
            console.error(error);
            return res.sendStatus(500);
        }
    });
};
// JS V2
// export const canvasUpload: RequestHandler = async (req, res, next) => {
//   const form = new formidable.IncomingForm();
//   form.parse(req, async (err, fields, files) => {
//     if (err) {
//       console.error(err);
//       res.sendStatus(500);
//       return;
//     }
//     try {
//       const uploadedFile = Array.isArray(files.canvasImage)
//         ? files.canvasImage[0]
//         : files.canvasImage;
//       const fileContent = await fs.readFile(uploadedFile.filepath);
//       const s3Params: AWS.S3.PutObjectRequest = {
//         Bucket: process.env.AWS_BUCKET || "",
//         Key: `${new Date().toISOString().replace(/:/g, "_")}-${
//           uploadedFile.originalFilename
//         }`,
//         Body: fileContent,
//         ContentType: uploadedFile.mimetype!,
//       };
//       const s3Content = await s3Upload(s3Params);
//       const textractData = await documentExtract(s3Content.Key);
//       console.log(textractData);
//       let data = "";
//       for (const words of textractData.Blocks) {
//         if (words.BlockType === "WORD") {
//           data += words.Text.toString() + " ";
//         }
//       }
//       res.status(200).json({ data });
//     } catch (error) {
//       console.error(error);
//       res.sendStatus(500);
//     }
//   });
// };
//# sourceMappingURL=../../maps/controllers/route-controllers.js.map