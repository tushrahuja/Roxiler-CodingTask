import api from '../lib/axios.js';

export const signup = (payload) => api.post('/auth/signup', payload).then(r=>r.data);
export const login = (payload) => api.post('/auth/login', payload).then(r=>r.data);
export default { signup, login, me };
