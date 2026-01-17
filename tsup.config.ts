 import {defineConfig} from 'tsup'
 export default defineConfig({
    entry: ['src/index.ts'],
    format:['cjs','esm'],

    splitting:false,
    sourcemap:true,
     noExternal:['@tensorflow/tfjs','sream'],
     platform:'browser',
   
     clean:true,
   





 });