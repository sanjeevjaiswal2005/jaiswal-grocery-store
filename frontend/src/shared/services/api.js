import axios from 'axios';
export const api=axios.create({baseURL:import.meta.env.VITE_API_URL||'http://localhost:5000/api/v1',withCredentials:true});
api.interceptors.response.use(r=>r.data,e=>Promise.reject(new Error(e.response?.data?.message||'Could not reach the store. Check your connection and try again.')));
