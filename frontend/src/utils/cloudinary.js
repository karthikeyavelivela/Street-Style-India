import axios from 'axios';

// Cloudinary configuration
// Get from environment variables (Vite uses import.meta.env)
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dqwm8wgg8';
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'admin_uploads';

/**
 * Upload image directly to Cloudinary
 * @param {File} file - Image file from input
 * @returns {Promise<string>} - Secure URL of uploaded image
 */
export const uploadImageToCloudinary = async (file) => {
    try {
        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            throw new Error('Invalid file type. Please upload JPG, PNG, or WEBP images only.');
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            throw new Error('File size too large. Maximum size is 5MB.');
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', UPLOAD_PRESET);
        formData.append('folder', 'website_uploads');

        const response = await axios.post(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        if (response.data && response.data.secure_url) {
            return response.data.secure_url;
        } else {
            throw new Error('Upload failed: No URL returned');
        }
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        
        // Provide more helpful error messages
        const errorMessage = error.response?.data?.error?.message || error.message || 'Failed to upload image';
        
        if (errorMessage.includes('preset') || errorMessage.includes('Upload preset')) {
            throw new Error(
                `Upload preset "${UPLOAD_PRESET}" not found. Please create it in Cloudinary Dashboard:\n` +
                `1. Go to https://cloudinary.com/console\n` +
                `2. Settings → Upload → Upload Presets\n` +
                `3. Create preset named "${UPLOAD_PRESET}" with "Unsigned" signing mode`
            );
        }
        
        throw new Error(errorMessage);
    }
};

/**
 * Upload multiple images to Cloudinary
 * @param {File[]} files - Array of image files
 * @returns {Promise<string[]>} - Array of secure URLs
 */
export const uploadMultipleImages = async (files) => {
    try {
        const uploadPromises = Array.from(files).map(file => uploadImageToCloudinary(file));
        const urls = await Promise.all(uploadPromises);
        return urls;
    } catch (error) {
        console.error('Multiple image upload error:', error);
        throw error;
    }
};

