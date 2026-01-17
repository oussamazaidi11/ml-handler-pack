import * as tf from '@tensorflow/tfjs'
// function for clean up math things tensors
//and clear model cache
export const smartRun=async(fn:()=>Promise<any>)=>{
    // we must use a custom wrapper  cuz itf.tidy is sync fn 
    const startTensor=tf.memory().numTensors;
    const result=await fn();
    return result;
}
export function Dispose(obj:any){
    if(obj &&  obj.Dispose) obj.Dispose();
    
}