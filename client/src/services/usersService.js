import api from '../lib/axios.js';

export const adminCreateUser = (payload) => api.post('/users', payload).then(r=>r.data);
export const adminListUsers = (params={}) => api.get('/users', { params }).then(r=>r.data);
export default { adminCreateUser, adminListUsers };
