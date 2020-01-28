const express = require('express');
const router = express.Router();
const awsS3 = require('../helpers/s3_helper');
const {upload} = require('../helpers/storage');

router.get('/', (request, response, next) => {
  response.render("aws/index")
})

router.get('/objects', (request, response, next) => {
  awsS3.getObjects((error, objects) => {
    response.json(objects)
  })
})

router.get('/:fileName', (request, response, next) => {
  awsS3.getPublicUrl('filename', (data) => {
    response.json(data)
  })
})

router.post('/', upload.single('file'), (request, response, next) => {
  awsS3.uploadFile(request, response, request.file, (attachement, error) => {
    if (error) {
      console.log(error)
      response.json(error)
    } else {
      response.json(attachement)
    }
  });
});

module.exports = router;
