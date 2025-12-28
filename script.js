// TensorFlow.js model
let model;
let classNames = [
    "Pepper,_bell___Bacterial_spot",
    "Pepper,_bell___healthy",
    "Tomato___Spider_mites Two-spotted_spider_mite",
    "Tomato___Septoria_leaf_spot",
    "Tomato___Leaf_Mold",
    "Tomato___Late_blight",
    "Tomato___Early_blight"
]; // 7 classes

// Knowledge base for remedies
const remedies = {
    "Apple___Apple_scab": {
        disease: "Apple Scab",
        organic_remedy: "Apply neem oil spray or baking soda solution (1 tsp baking soda, 1 tsp dish soap in 1 gallon water). Remove infected leaves.",
        chemical_remedy: "Use fungicides like captan or myclobutanil.",
        prevention: "Plant resistant varieties. Improve air circulation. Avoid overhead watering."
    },
    "Apple___Black_rot": {
        disease: "Black Rot",
        organic_remedy: "Remove and destroy infected fruit and leaves. Apply copper fungicide organically.",
        chemical_remedy: "Use fungicides containing thiophanate-methyl.",
        prevention: "Prune trees to improve air flow. Avoid wounding trees."
    },
    "Apple___Cedar_apple_rust": {
        disease: "Cedar Apple Rust",
        organic_remedy: "Remove nearby cedar trees if possible. Apply sulfur spray.",
        chemical_remedy: "Use fungicides like myclobutanil.",
        prevention: "Plant rust-resistant apple varieties."
    },
    "Apple___healthy": {
        disease: "Healthy",
        organic_remedy: "No action needed.",
        chemical_remedy: "No action needed.",
        prevention: "Continue good practices."
    },
    // Add more for other classes... For brevity, I'll add a few more and default for others
    "Tomato___Late_blight": {
        disease: "Late Blight",
        organic_remedy: "Remove infected plants. Apply copper fungicide.",
        chemical_remedy: "Use fungicides like chlorothalonil.",
        prevention: "Avoid wet conditions. Plant resistant varieties."
    },
    "Tomato___Early_blight": {
        disease: "Early Blight",
        organic_remedy: "Mulch around plants. Apply compost tea.",
        chemical_remedy: "Use fungicides like mancozeb.",
        prevention: "Rotate crops. Avoid overhead watering."
    },
    "Potato___Late_blight": {
        disease: "Late Blight",
        organic_remedy: "Remove infected plants immediately. Apply copper spray.",
        chemical_remedy: "Use fungicides like chlorothalonil.",
        prevention: "Plant certified seed potatoes. Avoid wet foliage."
    },
    "Corn_(maize)___Common_rust_": {
        disease: "Common Rust",
        organic_remedy: "Remove infected leaves. Apply neem oil.",
        chemical_remedy: "Use fungicides like propiconazole.",
        prevention: "Plant resistant varieties. Improve air circulation."
    },
    "Grape___Black_rot": {
        disease: "Black Rot",
        organic_remedy: "Remove infected parts. Apply sulfur spray.",
        chemical_remedy: "Use fungicides like myclobutanil.",
        prevention: "Prune for air flow. Avoid overhead watering."
    },
    "Pepper,_bell___Bacterial_spot": {
        disease: "Bacterial Spot",
        organic_remedy: "Remove infected leaves. Apply copper fungicide spray.",
        chemical_remedy: "Use bactericides like streptomycin.",
        prevention: "Avoid overhead watering. Plant resistant varieties."
    },
    "Pepper,_bell___healthy": {
        disease: "Healthy",
        organic_remedy: "No action needed.",
        chemical_remedy: "No action needed.",
        prevention: "Continue good practices."
    },
    "Tomato___Spider_mites Two-spotted_spider_mite": {
        disease: "Spider Mites (Two-Spotted)",
        organic_remedy: "Spray with water to dislodge mites. Apply neem oil.",
        chemical_remedy: "Use miticides like abamectin.",
        prevention: "Keep plants well-watered. Introduce beneficial insects."
    },
    "Tomato___Septoria_leaf_spot": {
        disease: "Septoria Leaf Spot",
        organic_remedy: "Remove infected leaves. Apply compost tea.",
        chemical_remedy: "Use fungicides like chlorothalonil.",
        prevention: "Avoid wet foliage. Rotate crops."
    },
    "Tomato___Leaf_Mold": {
        disease: "Leaf Mold",
        organic_remedy: "Improve air circulation. Apply baking soda spray.",
        chemical_remedy: "Use fungicides like chlorothalonil.",
        prevention: "Water at soil level. Avoid overhead watering."
    },
    // Default for unknown
    "default": {
        disease: "Unknown Disease",
        organic_remedy: "Consult local agricultural extension service.",
        chemical_remedy: "Consult local agricultural extension service.",
        prevention: "Practice good plant hygiene and monitoring."
    }
};

// Load model
async function loadModel() {
    console.log('Attempting to load model from Teachable Machine URL');
    try {
        model = await tf.loadLayersModel('https://teachablemachine.withgoogle.com/models/mOhEJIazq/model.json');
        document.getElementById('loadingStatus').style.display = 'none';
        document.getElementById('predictBtn').disabled = false;
        console.log('Model loaded successfully');
    } catch (error) {
        console.error('Error loading model:', error);
        document.getElementById('loadingStatus').innerText = 'Failed to load model. Please check console.';
    }
}

loadModel();

// Image upload preview
document.getElementById('imageUpload').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.id = 'previewImg';
            img.style.width = '200px';
            img.style.height = 'auto';
            img.style.borderRadius = '10px';
            img.style.border = '2px solid #4caf50';
            const container = document.getElementById('previewContainer');
            container.innerHTML = '';
            container.appendChild(img);
        };
        reader.readAsDataURL(file);
    }
});

// Camera button
document.getElementById('cameraBtn').addEventListener('click', function() {
    document.getElementById('imageUpload').click();
});

// Preprocess image
async function preprocessImage(imgElement) {
    return tf.tidy(() => {
        // Resize to 224x224
        let tensor = tf.browser.fromPixels(imgElement)
            .resizeNearestNeighbor([224, 224])
            .toFloat();

        // Normalize to [0,1]
        tensor = tensor.div(tf.scalar(255));

        // Add batch dimension
        return tensor.expandDims(0);
    });
}

// Predict
async function predict() {
    const img = document.getElementById('previewImg');
    if (!img) {
        alert('Please upload an image first.');
        return;
    }

    if (!model) {
        alert('Model not loaded yet.');
        return;
    }

    document.getElementById('loadingStatus').innerText = 'Analyzing image...';
    document.getElementById('loadingStatus').style.display = 'block';

    try {
        const tensor = await preprocessImage(img);
        const predictions = await model.predict(tensor).data();

        // Get top prediction
        let maxIndex = 0;
        let maxProb = predictions[0];
        for (let i = 1; i < predictions.length; i++) {
            if (predictions[i] > maxProb) {
                maxProb = predictions[i];
                maxIndex = i;
            }
        }

        const diseaseClass = classNames[maxIndex];
        const confidence = (maxProb * 100).toFixed(2);

        const remedy = remedies[diseaseClass] || remedies['default'];

        const resultsDiv = document.getElementById('results');
        resultsDiv.innerHTML = `
            <div>
                <h3>Disease Detected: ${remedy.disease}</h3>
                <p><strong>Confidence:</strong> ${confidence}%</p>
                <p><strong>Organic Remedy:</strong> ${remedy.organic_remedy}</p>
                <p><strong>Chemical Remedy:</strong> ${remedy.chemical_remedy}</p>
                <p><strong>Prevention:</strong> ${remedy.prevention}</p>
            </div>
        `;

        document.getElementById('loadingStatus').style.display = 'none';
    } catch (error) {
        console.error('Prediction error:', error);
        document.getElementById('loadingStatus').innerText = 'Error during prediction.';
    }
}
