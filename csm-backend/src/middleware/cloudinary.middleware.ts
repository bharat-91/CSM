import { v2 as cloudinary } from 'cloudinary';
import config from 'config';

cloudinary.config({
  cloud_name: config.get('cloudName'),
  api_key: config.get('API_KEY'),
  api_secret: config.get('API_SECRET')
});

export async function handleCloudinaryUpload(file: any) {
  try {
    const res = await cloudinary.uploader.upload(file.path, {
      resource_type: 'auto'
    });
    return res.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
}

