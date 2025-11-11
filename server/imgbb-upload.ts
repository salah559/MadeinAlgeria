
import FormData from 'form-data';
import fetch from 'node-fetch';

const IMGBB_API_KEY = process.env.IMGBB_API_KEY;

export interface ImgBBUploadResponse {
  success: boolean;
  data?: {
    url: string;
    display_url: string;
    delete_url: string;
  };
  error?: {
    message: string;
  };
}

export async function uploadImageToImgBB(
  imageBase64: string,
  name?: string
): Promise<string> {
  if (!IMGBB_API_KEY) {
    throw new Error('IMGBB_API_KEY is not configured');
  }

  try {
    const formData = new FormData();
    formData.append('image', imageBase64);
    if (name) {
      formData.append('name', name);
    }

    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const result = await response.json() as ImgBBUploadResponse;

    if (!result.success || !result.data) {
      throw new Error(result.error?.message || 'Failed to upload image to ImgBB');
    }

    return result.data.display_url;
  } catch (error) {
    console.error('ImgBB upload error:', error);
    throw new Error('Failed to upload image');
  }
}

export async function uploadImageBufferToImgBB(
  buffer: Buffer,
  name?: string
): Promise<string> {
  const base64 = buffer.toString('base64');
  return uploadImageToImgBB(base64, name);
}
