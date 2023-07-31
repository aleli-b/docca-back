require('dotenv').config();
const cloudinary = require('cloudinary').v2;

const {
    CLOUD_NAME,
    CLOUD_API_KEY,
    CLOUD_SECRET,
} = process.env;

cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: CLOUD_API_KEY,
    api_secret: CLOUD_SECRET,
});

const opts =  {
    overwrite: true,
    invalidate: true,
    resource_type: "auto",
};

module.exports = (image) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(image, opts, (error, result) => {
            if(result && result.secure_url) {
                console.log(result.secure_url);
                return resolve(result.secure_url);
            }
            console.log(error.message);
            return reject({ message: error.message})
        })
    })
}