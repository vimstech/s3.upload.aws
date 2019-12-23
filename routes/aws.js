const express = require('express');
const router = express.Router();
const awsS3 = require('../helpers/s3_helper');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (request, file, callback) => {
    callback(null, 'public/uploads')
  },
  filename: (request, file, callback) => {
    let timeStamp = new Date().getTime();
    var file_name = file.originalname.replace(/\s/g,'_');
    callback(null, `${file.fieldname}-${timeStamp}-${file_name}`)
  }
})
 
const upload = multer({ storage: storage });

router.get('/', (request, response, next) => {
  response.render("aws/index")
})

router.post('/', upload.single('file'), (request, response, next) => {
  awsS3.uploadFile(request, response, request.file, (attachement, error) => {
    if(error){
      console.log(error)
      response.json(error)
    } else {
      response.json(attachement)
    }
  });
});
module.exports = router;