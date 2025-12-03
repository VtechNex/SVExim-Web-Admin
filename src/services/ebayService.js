import axios from 'axios';
import { AUTH } from './authService';

const EBAY_API = import.meta.env.VITE_EBAY_API;

const user = AUTH.getUser();
if (user) axios.defaults.headers.common.Authorization = `Bearer ${user.token}`

async function syncProducts (page = 1, totalPages = 1) {
    try {
        const response = await axios.get(`${EBAY_API}/products?email=${user.email}&page=${page}&totalPages=${totalPages}`);
        return response;
    } catch (error) {
        console.error('Error while sync products', error.response);
    }
}

const EBAY = {
    syncProducts
}

export default EBAY;
