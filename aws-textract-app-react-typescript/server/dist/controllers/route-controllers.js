import formidable from "formidable";
import fs from "fs/promises";
import s3Upload from "../util/s3-upload.js";
import documentExtract from "../util/document-extract.js";
// JS V3
export const canvasUpload = async (req, res, next) => {
    const form = new formidable.IncomingForm();
    return form.parse(req, async (err, fields, files) => {
        if (err) {
            console.error(err);
            return res.sendStatus(500);
        }
        try {
            const uploadedFile = Array.isArray(files["canvasImage"])
                ? files["canvasImage"][0]
                : files["canvasImage"];
            if (!uploadedFile) {
                return res.sendStatus(400);
            }
            const fileContent = await fs.readFile(uploadedFile.filepath);
            const s3Params = {
                Bucket: process.env["AWS_BUCKET"] || "",
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
