# Cloudinary Image Upload Setup

## ✅ Configuration Complete

Your Cloudinary credentials have been configured:

- **Cloud Name**: `dqwm8wgg8`
- **API Key**: `948834256639532`
- **API Secret**: `eYOGYj9M6PQpXFqfKt-uPb0cSXk`
- **Upload Preset**: `admin_uploads`

## ⚠️ REQUIRED: Create Upload Preset

**You MUST create the upload preset before uploads will work!**

### Step 1: Create Upload Preset
1. Go to https://cloudinary.com/console
2. Login with your account (cloud name: `dqwm8wgg8`)
3. Navigate to **Settings** (⚙️ icon) → **Upload** → **Upload Presets** tab
4. Click **"Add Upload Preset"** button
5. Configure the preset:
   - **Preset name**: `admin_uploads` (exactly this name, lowercase, underscore)
   - **Signing mode**: `Unsigned` ⚠️ **CRITICAL: Must be "Unsigned" for frontend uploads to work**
   - **Folder**: `website_uploads`
   - **Allowed formats**: Select `jpg`, `jpeg`, `png`, `webp`
   - **Max file size**: `5 MB`
   - **Auto format**: `ON` (recommended)
   - **Auto quality**: `ON` (recommended)
6. Click **"Save"** button
7. Verify the preset appears in your list with "Unsigned" signing mode

**If you see "Upload preset not found" error, this preset doesn't exist yet - create it now!**

## Step 2: Frontend Configuration
The Cloudinary configuration is already set up in `frontend/src/utils/cloudinary.js` with your cloud name as the default.

**Optional**: Create `.env` file in `frontend/` directory for environment-specific overrides:
```env
VITE_CLOUDINARY_CLOUD_NAME=dqwm8wgg8
VITE_CLOUDINARY_UPLOAD_PRESET=admin_uploads
```

**Note**: If you don't create a `.env` file, the code will use the default values already configured.

3. Restart your frontend dev server after creating `.env` file (if created)

## Step 4: Test Upload
1. Go to Admin Panel → Products
2. Click "Add Product" or "Edit Product"
3. Click "Upload from Device"
4. Select an image
5. Image will upload directly to Cloudinary
6. URL will appear in the images field automatically

## Benefits
✅ Images upload directly from browser to Cloudinary
✅ No backend storage needed
✅ Automatic compression and optimization
✅ Fast CDN delivery
✅ Mobile optimized
✅ No MongoDB size limits




