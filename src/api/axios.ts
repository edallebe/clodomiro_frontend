import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


// variable de la app local
const baseURL = API_BASE_URL;

export const api = axios.create({
    baseURL,
    // headers: {
    //     'Content-Type': 'application/json',
    // },
});

export default api;