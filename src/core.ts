import * as tf from '@tensorflow/tfjs';

export class MLAxiosInstance {
    defaults: any;
    interceptors: {
        request: any[];
        response: any[];
    };

    constructor(config = {}) {
        this.defaults = config;
        this.interceptors = {
            request: [],
            response: [],
        };
    }

    /**
     * Loads a model. Automatically detects if it's a Graph or Layers model.
     */
    async load(modelUrl: string) {
        try {
            // Most TFHub models are Graph Models. 
            // We try loadGraphModel first as it's the modern standard for inference.
            return await tf.loadGraphModel(modelUrl, { fromTFHub: true });
        } catch (e) {
            // Fallback to LayersModel if GraphModel loading fails
            return await tf.loadLayersModel(modelUrl);
        }
    }

    async predict(model: any, input: any) {
        // 1. Pre-processing (Request Interceptors)
        let processedInput = input;
        for (const interceptor of this.interceptors.request) {
            processedInput = await interceptor(processedInput);
        }

        // 2. Inference
        const startTime = performance.now();
        
        // Manual Memory Management because tidy() doesn't support async
     
        let prediction: tf.Tensor | tf.Tensor[];
        let tensorInput: tf.Tensor | undefined = undefined; 

        try {
            // Convert input to Tensor if it isn't one already
            tensorInput = processedInput instanceof tf.Tensor 
                ? processedInput 
                : tf.browser.fromPixels(processedInput)
                    .resizeBilinear([224, 224]) // Standard size for MobileNet
                    .toFloat()
                    .expandDims(0);

            // Execute the model
            prediction = await model.predict(tensorInput);
            
        } finally {
            // Clean up input tensor immediately to free GPU memory
            if (processedInput !== input && tensorInput) {
                tensorInput.dispose();
            }
        }

        const endTime = performance.now();

        // 3. Post-processing (Response Interceptors)
        let finalData = prediction;
        for (const interceptor of this.interceptors.response) {
            finalData = await interceptor(finalData);
        }

        // Final cleanup of the raw prediction tensor if it was transformed
        if (finalData !== prediction) {
            if (Array.isArray(prediction)) {
                prediction.forEach(t => t.dispose());
            } else {
                prediction.dispose();
            }
        }

        return {
            data: finalData,
            latency: endTime - startTime,
            device: tf.getBackend()
        };
    }
}