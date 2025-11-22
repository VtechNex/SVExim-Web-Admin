import axios from 'axios';
import { AUTH } from './authService';

const BASE_API = import.meta.env.VITE_QUOTES_API;

const user = AUTH.getUser();
if (user) axios.defaults.headers.common.Authorization = `Bearer ${user.token}`

async function getQuotes () {
    try {
        const response = await axios.get(BASE_API);
        return response;
    } catch (error) {
        console.error('Error while getting quotes', error);
        return error.response;
    }
}

const QUOTES = {
    GET: getQuotes
}

export default QUOTES;
