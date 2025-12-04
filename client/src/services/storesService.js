import api from '../lib/axios.js';

export const listStores = (params={}) => api.get('/stores', { params }).then(r=>r.data);
export const createStore = (payload) => api.post('/stores', payload).then(r=>r.data);
export default { listStores, createStore };
