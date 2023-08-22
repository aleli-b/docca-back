const AWS = require('aws-sdk');
require('dotenv').config({ path: './.env' });

const { AWS_ACCESS_KEY, AWS_SECRET_KEY, AWS_BUCKET_REGION, AWS_PIC_BUCKET, AWS_PDF_BUCKET, AWS_CEDULA_BUCKET } = process.env

AWS.config.update({
    credentials: {
        accessKeyId: AWS_ACCESS_KEY,
        secretAccessKey: AWS_SECRET_KEY,
    },
    region: AWS_BUCKET_REGION,
});

const s3 = new AWS.S3({ params: { Bucket: 'profile-pic-docappoint-bucket' } });

const aws_upload_img = (params) => {
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
                const url = `${AWS_PIC_BUCKET}/${currentTime}_${filename}`;
                resolve({ url });
            }
        })
    })
}

const s3_pdf = new AWS.S3({ params: { Bucket: 'lab-test-docappoint-bucket' } });

const aws_upload_pdf = (params) => {
    return new Promise((resolve, reject) => {
        
        const { filename, file } = params;
        const currentTime = new Date().getTime();
        const buf = Buffer.from(file.split(',')[1], "base64");

        const data = {
            Key: `${currentTime}_${filename}`,
            Body: buf,
            ContentEncoding: "base64",
            ContentType: "application/pdf",
        }

        s3_pdf.putObject(data, (err, data) => {
            if (err) {
                console.log(`Error uploading file: ${err}`)
                reject(err);
            } else {
                const url = `${AWS_PDF_BUCKET}/${currentTime}_${filename}`;
                resolve({ url });
            }
        })
    })
}

const s3_ced = new AWS.S3({ params: { Bucket: 'cedula-docappoint-bucket' } });

const aws_upload_ced = (params) => {
    return new Promise((resolve, reject) => {
        
        const { filename, file } = params;
        const currentTime = new Date().getTime();
        const buf = Buffer.from(file.split(',')[1], "base64");

        const data = {
            Key: `${currentTime}_${filename}`,
            Body: buf,
            ContentEncoding: "base64",
            // ContentType: "application/pdf",
        }

        s3_ced.putObject(data, (err, data) => {
            if (err) {
                console.log(`Error uploading file: ${err}`)
                reject(err);
            } else {
                const url = `${AWS_CEDULA_BUCKET}/${currentTime}_${filename}`;
                resolve({ url });
            }
        })
    })
}

module.exports = {
    aws_upload_img,
    aws_upload_pdf,
    aws_upload_ced,
}