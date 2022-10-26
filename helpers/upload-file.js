import { fileURLToPath } from "url";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadFileHelper = (
    { file },
    validExtensions = ["png", "jpg", "jpeg", "gif"],
    folder = ""
) => {
    return new Promise((resolve, reject) => {
        const nameSliced = file.name.split(".");
        const extension = nameSliced[nameSliced.length - 1];

        if (!validExtensions.includes(extension)) {
            return reject(
                `Not a valid extension: ${extension}. Valid extensions: ${validExtensions.join(
                    ", "
                )}`
            );
        }

        const tempFileName = uuidv4() + "." + extension;
        const uploadPath = path.join(
            __dirname,
            "../uploads/",
            folder,
            tempFileName
        );

        file.mv(uploadPath, (err) => {
            if (err) {
                reject(err);
            }

            resolve(tempFileName);
        });
    });
};

export { uploadFileHelper };
