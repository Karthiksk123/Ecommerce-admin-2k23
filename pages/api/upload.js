import multiparty from "multiparty";
const cloudinary = require("cloudinary").v2;

export default async function handler(req, res) {
  const form = new multiparty.Form();
  form.parse(req, (err, fields, files) => {
    const links = [];
    for (const file of files.file) {
      const fileName = file.originalFilename.split(".").shift();
      // Configuration
      cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.API_KEY,
        api_secret: process.env.API_SECRET,
      });
      // Upload

      const result = cloudinary.uploader.upload(file.path, {
        public_id: fileName,
      });

      result
        .then((data) => {
          return data.secure_url;
        })
        .catch((err) => {
          console.log(err);
        });
      // Generate
      const url = cloudinary.url(fileName);

      links.push(url);
    }
    res.json({ links });
  });
}

export const config = {
  api: {
    bodyParser: false,
  },
};
