// config/s3Config.js

const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

require('dotenv').config();

aws.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new aws.S3();

// Multer upload instance for item images
const itemUpload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET_NAME,
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      const fileName = `items/${Date.now().toString()}-${file.originalname}`;
      cb(null, fileName);
    },
  }),
});

// Multer upload instance for profile pictures
const profilePicUpload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET_NAME,
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      const fileName = `profile_pics/${req.user.user_id}-${Date.now().toString()}-${file.originalname}`;
      cb(null, fileName);
    },
  }),
});

module.exports = {
  itemUpload,
  profilePicUpload,
};
