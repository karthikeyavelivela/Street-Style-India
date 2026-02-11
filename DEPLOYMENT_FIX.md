# Deployment Fix Guide

## Issues Fixed

### 1. ✅ SPA Routing (404 on Reload)
**Problem**: After deployment, reloading pages like `/admin/products` shows "Page Not Found"

**Solution**: Created routing configuration files for different hosting platforms:
- `frontend/vercel.json` - For Vercel deployment
- `frontend/public/_redirects` - For Netlify deployment  
- `frontend/public/.htaccess` - For Apache servers

These files ensure all routes redirect to `index.html` so React Router can handle routing.

### 2. ✅ API BaseURL Configuration
**Problem**: Frontend was hardcoded to `localhost:5000` which doesn't work in production

**Solution**: Updated `frontend/src/utils/api.js` to:
- Use environment variables for API URL
- Automatically detect production vs development
- Fallback to deployed backend URL in production

### 3. ✅ CORS Configuration
**Problem**: Backend CORS might block production frontend requests

**Solution**: Updated `backend/server.js` to:
- Use environment variable for allowed frontend URL
- Allow all origins in development
- Configure properly for production

## Setup Instructions

### Frontend Deployment

1. **Set Environment Variables** (in your hosting platform):
   ```
   VITE_API_URL=https://your-backend-url.com/api
   VITE_CLOUDINARY_CLOUD_NAME=dqwm8wgg8
   VITE_CLOUDINARY_UPLOAD_PRESET=admin_uploads
   ```

2. **For Vercel**:
   - The `vercel.json` file is already configured
   - Just deploy and it will work

3. **For Netlify**:
   - The `_redirects` file in `public/` folder will be automatically used
   - Make sure it's included in your build

4. **For Other Platforms**:
   - Use the `.htaccess` file for Apache servers
   - For other platforms, configure to serve `index.html` for all routes

### Backend Deployment

1. **Set Environment Variables**:
   ```
   FRONTEND_URL=https://your-frontend-url.com
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

2. **CORS Configuration**:
   - Set `FRONTEND_URL` to your deployed frontend URL
   - This ensures only your frontend can make requests

## Testing After Deployment

1. **Test SPA Routing**:
   - Navigate to `/admin/products`
   - Reload the page (F5 or Ctrl+R)
   - Should NOT show 404 error

2. **Test Product Save**:
   - Go to Admin Panel → Products
   - Try to create or edit a product
   - Should save successfully

3. **Test API Connection**:
   - Open browser console (F12)
   - Check Network tab for API calls
   - Should connect to your production backend URL

## Troubleshooting

### Still Getting 404 on Reload?
- **Vercel**: Check that `vercel.json` is in the root of your frontend folder
- **Netlify**: Ensure `_redirects` is in the `public/` folder and gets copied to build output
- **Other**: Verify your hosting platform is configured to serve `index.html` for all routes

### Product Save Still Not Working?
1. Check browser console for errors
2. Verify `VITE_API_URL` environment variable is set correctly
3. Check backend logs for CORS errors
4. Verify backend `FRONTEND_URL` matches your frontend domain
5. Check that authentication tokens are being sent correctly

### API Connection Issues?
1. Verify backend is deployed and running
2. Check `VITE_API_URL` matches your backend URL exactly
3. Ensure backend CORS allows your frontend domain
4. Check network tab in browser DevTools for error details

## Environment Variables Summary

### Frontend (.env or hosting platform):
```env
VITE_API_URL=https://your-backend-url.com/api
VITE_CLOUDINARY_CLOUD_NAME=dqwm8wgg8
VITE_CLOUDINARY_UPLOAD_PRESET=admin_uploads
```

### Backend (.env or hosting platform):
```env
FRONTEND_URL=https://your-frontend-url.com
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=production
```

