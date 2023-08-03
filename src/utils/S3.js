const AWS = require('aws-sdk');
require('dotenv').config({ path: './.env' });

const { AWS_ACCESS_KEY, AWS_SECRET_KEY, AWS_BUCKET_REGION} = process.env

AWS.config.update({
    credentials: {
        accessKeyId: AWS_ACCESS_KEY,
        secretAccessKey: AWS_SECRET_KEY,
    },
    region: AWS_BUCKET_REGION,
});

const s3 = new AWS.S3({ params: { Bucket: 'profile-pic-docappoint-bucket' } });

module.exports = aws_upload = (params) => {
    return new Promise((resolve, reject) => {
        const { filename, file } = params;        
        
        const buf = Buffer.from(file.split(',')[1], "base64");

        const currentTime = new Date().getTime();

        const data = {
            Key: `${currentTime}_${filename}`,
            Body: buf,
            ContentEncoding: "base64",
            ContentType: "image/jpeg",
        }

        s3.putObject(data, (err, data) => {
            if (err) {
                console.log(`Error uploading file: ${err}`)
                reject(err);
            } else {
                const url = `https://profile-pic-docappoint-bucket.s3.amazonaws.com/${currentTime}_${filename}`;          
                resolve({ url });
            }
        })
    })
}