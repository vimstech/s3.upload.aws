const fs = require('fs');
const aws = require('aws-sdk');
const _ = require('lodash');
const s3Config = require('../config/s3');

const s3 = new aws.S3({
  accessKeyId: s3Config.S3_ACCESS_KEY_ID,
  secretAccessKey: s3Config.S3_SECRET_ACCESS_KEY
});

var S3_BUCKET = 'apidevelopment';

var getUrl = (key) => {
  return "https://"+S3_BUCKET+".s3.amazonaws.com/"+key;
}

module.exports.getPublicUrl = (fileName, callback) => {
  var key = s3Config.S3_FOLDER+fileName;
  var options = {
    Bucket: S3_BUCKET,
    Key: key,
    Expires: 3600
  }
  s3.getSignedUrl('getObject', options, (error, url) => {
    callback({error: error, url: url});
  });
}

module.exports.getObjects = (callback) => {
  var params = {
    Bucket: S3_BUCKET,
    Prefix: s3Config.S3_FOLDER
  };
  s3.listObjects(params,(err, objects) => {
    if(!err) {
      var images = _.filter(objects.Contents, (file) => {
        return file.Size > 0;
      });
    }
    callback(err, images);
  });
}
module.exports.uploadFile = (request, response, file, callback) => {
  var key = s3Config.S3_FOLDER+file.filename;
  var options = {
    Bucket: S3_BUCKET,
    Key: key,
    ContentType: file.mimetype,
    ACL: 'public-read',
    Body: fs.readFileSync(file.path)
  }

  s3.upload(options, (s3Err, data) => {

    fs.unlink(file.path, (err)=>{
      if(err){
        console.error(err)
      }else{
        console.log('file upload.')
      }
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
