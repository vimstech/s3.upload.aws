const fs = require('fs');
const aws = require('aws-sdk');
const s3Config = require('../config/s3').s3;

const s3 = new aws.S3({
  accessKeyId: s3Config.S3_ACCESS_KEY_ID,
  secretAccessKey: s3Config.S3_SECRET_ACCESS_KEY
});

var S3_BUCKET = 'apidevelopment';
module.exports.uploadFile = (request, response, file, callback) => {
  var key = "sq/companies/uploads/"+file.filename;
  var options = {
    Bucket: S3_BUCKET,
    Key: key,
    ContentType: file.mimetype,
    ACL: 'public-read',
    Body: fs.readFileSync(file.path)
  }

  s3.upload(options, (s3Err, data) => {

    fs.unlink(file.path, (err)=>{
      if(err)
        console.error(err)
      else
        console.log('file upload.')
    });

    if(s3Err){
      callback(null, s3Err);
    }else{
      var attachment = {
        s3_bucket: S3_BUCKET,
        s3_key: key,
        content_type: file.mimetype,
        data: data
      };
      callback(attachment, null);
    }
  });
};
