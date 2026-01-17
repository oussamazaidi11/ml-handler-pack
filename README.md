# ml-axios

A promise-based Machine Learning inference library for the browser, inspired by the simplicity of Axios. Built on top of [TensorFlow.js](https://www.tensorflow.org/js).

## Features

- 🚀 **Promise-based API**: Familiar syntax for developers used to Axios.
- 🔄 **Interceptors**: Powerful request and response interceptors for pre-processing inputs and post-processing predictions.
- 🧠 **Smart Model Loading**: Automatically detects and loads both Graph and Layers models (including support for TFHub).
- 🖼️ **Automatic Input Handling**: seamless conversion from HTML images/video elements to Tensors.
- 🧹 **Memory Management**: Automatic tensor disposal to prevent memory leaks.
- ⏱️ **Performance Metrics**: Returns inference latency and backend device information.

## Installation

```bash
npm install ml-axios @tensorflow/tfjs
```

## Usage

### Basic Inference

```javascript
import ml from 'ml-axios';

async function runInference() {
  // 1. Load a model (e.g., MobileNet from TFHub)
  const modelUrl = 'https://tfhub.dev/google/tfjs-model/imagenet/mobilenet_v2_100_224/classification/3/default/1';
  const model = await ml.load(modelUrl);

  // 2. Get your input (e.g., an image element)
  const imgElement = document.getElementById('my-image');

  // 3. Predict
  const response = await ml.predict(model, imgElement);

  console.log('Prediction Data:', response.data);
  console.log('Latency:', response.latency, 'ms');
  console.log('Device:', response.device);
}

runInference();
```

### Creating Custom Instances

You can create independent instances with their own configuration and interceptors.

```javascript
import { create } from 'ml-axios';

const customMl = create({
  // custom config
});

customMl.interceptors.request.push(...);
```

### Using Interceptors

You can use interceptors to transform data before it reaches the model (Request Interceptors) or after the model returns a prediction (Response Interceptors).

```javascript
import ml from 'ml-axios';

// Request Interceptor: Pre-process input
ml.interceptors.request.push(async (input) => {
  console.log('Pre-processing input...');
  // Perform operations like resizing, normalization, etc.
  return input;
});

// Response Interceptor: Post-process prediction
ml.interceptors.response.push(async (prediction) => {
  console.log('Post-processing prediction...');
  // Convert tensor to array, filter results, etc.
  const values = await prediction.data();
  return values;
});
```

## API

### `ml.load(modelUrl: string)`

Loads a TensorFlow.js model. It attempts to load as a GraphModel first (common for TFHub), and falls back to a LayersModel.

- **modelUrl**: The URL of the model.
- **Returns**: A Promise that resolves to the loaded model.

### `ml.predict(model: any, input: any)`

Runs inference on the provided input using the loaded model.

- **model**: The loaded TensorFlow.js model.
- **input**: The input data (HTMLImageElement, HTMLVideoElement, Tensor, etc.).
- **Returns**: A Promise resolving to an object containing:
  - `data`: The prediction result (Tensor or processed data).
  - `latency`: Time taken for inference in milliseconds.
  - `device`: The active TensorFlow backend (e.g., 'webgl', 'cpu').

### `ml.interceptors`

- `request`: Array of functions to transform input before inference.
- `response`: Array of functions to transform output after inference.

## Development

1.  **Clone the repository**
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Start development server**:
    ```bash
    npm run dev
    ```
4.  **Build for production**:
    ```bash
    npm run build
    ```

## License

MIT
