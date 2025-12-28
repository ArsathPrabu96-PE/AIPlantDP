# Deployment Steps

## For GitHub Pages

1. Create a GitHub repository for your project.

2. Upload all files except `train_model.py` and `convert_model.sh` to the repository.

3. Ensure the `tfjs_model` folder is included (this contains the converted model).

4. Go to repository Settings > Pages.

5. Set Source to "Deploy from a branch".

6. Select "main" branch and "/ (root)" folder.

7. Save and wait for deployment. The URL will be `https://yourusername.github.io/repositoryname/`.

## For Netlify

1. Go to netlify.com and sign up/login.

2. Click "New site from Git".

3. Connect your GitHub repository.

4. Set build command to none (static site).

5. Publish directory: leave as root (/).

6. Deploy.

7. The app will be available at the generated Netlify URL.

## Important Notes

- The model files in `tfjs_model` are large; ensure your hosting supports large files.
- For offline functionality, the model must be cached or the app will require internet for first load.
- Test on mobile devices to ensure camera access works.
- Icons (icon-192.png, icon-512.png) need to be created and added for PWA.