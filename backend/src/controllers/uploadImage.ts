const path = require("path");
const multer = require("multer");

//@ts-ignore
const ImageType = function (originalUrl) {
  const imageType = originalUrl.split("/")[3];
  return imageType;
};

//@ts-ignore
const destination = function (originalUrl) {
  const imageType = ImageType(originalUrl);
  return `../../public/images/${imageType}`;
};

const storage = multer.diskStorage({
    //@ts-ignore
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    //@ts-ignore
    filename: function (req, file, cb) {
        cb(null, new Date().getTime() + '-' + file.originalname);
      }
    });
const uploadImage = multer({
  storage,
  limits: {fileSize: 1024 * 1024 * 5},
});


const multiUpload = uploadImage.array('files',10);
const singleUpload = uploadImage.single("image");

const uploads = {
    singleUpload,
    multiUpload   
}

export default uploads;