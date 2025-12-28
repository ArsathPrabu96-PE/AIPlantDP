try:
    import tensorflow as tf
    import tensorflowjs as tfjs
except ImportError as e:
    print("Error: TensorFlow or TensorFlow.js is not installed.")
    print("Please install the required packages using: pip install tensorflow tensorflowjs")
    print(f"ImportError: {e}")
    exit(1)