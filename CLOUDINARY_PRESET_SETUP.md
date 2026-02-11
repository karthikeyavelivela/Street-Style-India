# ⚠️ URGENT: Create Cloudinary Upload Preset

## Error Fix Required

You're getting the error: **"Upload preset not found"**

This means the upload preset `admin_uploads` doesn't exist in your Cloudinary account yet.

## Quick Fix - Create the Preset Now

### Step-by-Step Instructions:

1. **Login to Cloudinary Dashboard**
   - Go to: https://cloudinary.com/console
   - Login with your account (cloud name: `dqwm8wgg8`)

2. **Navigate to Upload Presets**
   - Click on **"Settings"** (gear icon) in the top menu
   - Click on **"Upload"** in the left sidebar
   - Click on **"Upload presets"** tab

3. **Create New Preset**
   - Click the **"Add upload preset"** button
   - Fill in the following:

   **Basic Settings:**
   - **Preset name**: `admin_uploads` (exactly this name, no spaces)
   - **Signing mode**: Select **"Unsigned"** ⚠️ (This is CRITICAL - must be unsigned for frontend uploads)

   **Upload Settings:**
   - **Folder**: `website_uploads`
   - **Allowed formats**: Select `jpg`, `jpeg`, `png`, `webp`
   - **Max file size**: `5 MB`

   **Transformation Settings (Optional but Recommended):**
   - **Auto format**: `ON`
   - **Auto quality**: `ON`
   - **Eager transformations**: Leave default

4. **Save the Preset**
   - Click **"Save"** button at the bottom
   - You should see `admin_uploads` in your list of presets

5. **Verify the Preset**
   - Make sure the preset shows as **"Unsigned"** in the signing mode column
   - If it shows "Signed", click on it and change to "Unsigned"

## After Creating the Preset

1. **Refresh your browser** (or restart your dev server if needed)
2. **Try uploading again** in the Admin Panel → Products
3. The upload should now work!

## Visual Guide

```
Cloudinary Dashboard
├── Settings (⚙️)
    ├── Upload
        ├── Upload presets ← Click here
            └── Add upload preset ← Click this button
```

## Common Issues

### Issue: "Preset still not found after creating"
- **Solution**: Make sure the preset name is exactly `admin_uploads` (lowercase, underscore, no spaces)
- **Solution**: Verify it's set to "Unsigned" mode
- **Solution**: Wait a few seconds and refresh - sometimes there's a slight delay

### Issue: "Still getting errors"
- **Solution**: Check that you're logged into the correct Cloudinary account (cloud name: `dqwm8wgg8`)
- **Solution**: Clear browser cache and try again

## Alternative: Use a Different Preset Name

If you want to use a different preset name, you can:

1. Create the preset with your preferred name in Cloudinary
2. Update the code in `frontend/src/utils/cloudinary.js`:
   ```javascript
   const UPLOAD_PRESET = 'your_preset_name_here';
   ```
3. Or create a `.env` file in `frontend/`:
   ```env
   VITE_CLOUDINARY_UPLOAD_PRESET=your_preset_name_here
   ```

## Need Help?

If you're still having issues:
1. Check the Cloudinary console for any error messages
2. Verify your cloud name is correct: `dqwm8wgg8`
3. Make sure you have the correct permissions in your Cloudinary account

