# Cloudinary Configuration

## Current Configuration

Your Cloudinary credentials are configured in the codebase:

- **Cloud Name**: `dqwm8wgg8`
- **API Key**: `948834256639532`
- **API Secret**: `eYOGYj9M6PQpXFqfKt-uPb0cSXk`
- **Upload Preset**: `admin_uploads`

## Implementation Details

### Frontend Configuration
- **File**: `frontend/src/utils/cloudinary.js`
- **Default Cloud Name**: `dqwm8wgg8` (hardcoded as fallback)
- **Upload Preset**: `admin_uploads`

The frontend uses **unsigned uploads**, which means:
- Only Cloud Name and Upload Preset are needed
- API Key and API Secret are not required for frontend uploads
- Uploads happen directly from browser to Cloudinary

### Environment Variables (Optional)
You can override defaults by creating a `.env` file in the `frontend/` directory:
```env
VITE_CLOUDINARY_CLOUD_NAME=dqwm8wgg8
VITE_CLOUDINARY_UPLOAD_PRESET=admin_uploads
```

### Backend Configuration (If Needed)
If you need server-side uploads in the future, create a `.env` file in the `backend/` directory:
```env
CLOUDINARY_CLOUD_NAME=dqwm8wgg8
CLOUDINARY_API_KEY=948834256639532
CLOUDINARY_API_SECRET=eYOGYj9M6PQpXFqfKt-uPb0cSXk
```

## Important Notes

1. **Upload Preset Must Be Unsigned**: The `admin_uploads` preset must be configured as "Unsigned" in your Cloudinary dashboard for frontend uploads to work.

2. **Security**: API Secret should never be exposed in frontend code. It's only needed for server-side operations.

3. **Current Setup**: The frontend is configured to work immediately with the provided cloud name. No additional setup required unless you want to use environment variables.

