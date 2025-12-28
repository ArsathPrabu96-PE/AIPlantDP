# AI Plant Disease Detection - Folder Structure

```
AiDiseasePredection/
├── index.html              # Main HTML file
├── style.css               # CSS styles
├── js.js                   # JavaScript logic
├── manifest.json           # PWA manifest
├── sw.js                   # Service worker for offline
├── train_model.py          # Python script to train the model
├── convert_model.sh        # Script to convert model to TF.js
├── tfjs_model/             # Converted TensorFlow.js model files
│   ├── model.json          # Model architecture
│   └── group1-shard1ofX.bin # Model weights (multiple files)
├── icon-192.png            # PWA icon 192x192
├── icon-512.png            # PWA icon 512x512
└── README.md               # Project documentation
```

## Notes
- The `tfjs_model` folder contains the converted model and must be uploaded to the web server.
- Icons are required for PWA installation.
- All files except `train_model.py` and `convert_model.sh` are needed for the web app.