import axios from 'axios';
import {AUTH} from './authService';

const API = import.meta.env.VITE_ADMIN_API;

const user = AUTH.getUser();
if (user) axios.defaults.headers.common.Authorization = `Bearer ${user.token}`;

async function getStats () {
    try {
        const response = await axios.get(`${API}/dashboard/stats`);
        return response;
    } catch (error) {
        console.error(error);
        return error.response;
    }
}

const ADMIN = {
    STATS: getStats
};

export default ADMIN;
