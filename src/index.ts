import { MLAxiosInstance } from './core';
const ml = new MLAxiosInstance();
// Allow users to create custom instances

export const create = (config: any) => new MLAxiosInstance(config);
export default ml;
export {MLAxiosInstance}