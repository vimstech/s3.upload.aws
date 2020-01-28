const multer = require('multer');

const storage = multer.diskStorage({
  destination: (request, file, callback) => {
    callback(null, 'public/uploads')
  },
  filename: (request, file, callback) => {
    let timeStamp = new Date().getTime();
    var file_name = file.originalname.replace(/\s/g, '_');
    callback(null, `${file.fieldname}-${timeStamp}-${file_name}`)
  }
})

module.exports.upload = multer({ storage: storage });
