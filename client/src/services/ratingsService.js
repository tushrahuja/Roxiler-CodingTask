import api from '../lib/axios.js';

export const submitRating = (storeId, rating) => api.post(`/ratings/${storeId}`, { rating }).then(r=>r.data);
export const getUserRating = (storeId) => api.get(`/ratings/${storeId}/user`).then(r=>r.data);
export default { submitRating, getUserRating };
