import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import multer from 'multer';
import config from '../config';

export const sendImageToCloudinary = async (
  imageTitle: string,
  path: string,
) => {
  // Configuration
  cloudinary.config({
    cloud_name: config.cloudinary_cloud_name,
    api_key: config.cloudinary_api_key,
    api_secret: config.cloudinary_api_secret,
  });

  // Upload an image
  const uploadResult = await cloudinary.uploader
    .upload(path, {
      public_id: imageTitle,
    })
    .catch((error) => {
      throw new Error(error);
    });

  //delete a file asynchronously
  fs.unlink(path, (err) => {
    if (err) {
      throw new Error(err.message);
    } else {
      //console.log('File deleted successfully');
    }
  });

  //console.log(uploadResult);
  return uploadResult.url;
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.cwd() + '/uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  },
});

export const upload = multer({ storage: storage });
