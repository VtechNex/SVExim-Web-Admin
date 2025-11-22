
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_AUTH_API;
const EBAY_API = import.meta.env.VITE_EBAY_API;

function getUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
}

async function login(email, password) {
    try {
        const response = await axios.post(`${BASE_URL}/login`, { email, password },
            { headers: { 'Content-Type': 'application/json' } }
        );
        if (response.status !== 200) {
            return response.status;
        }
        const user = {
            id: response.data.admin.id,
            name: response.data.admin.name,
            email,
            token:response.data.token
        }
        localStorage.setItem("user", JSON.stringify(user));
        return response.status;
    } catch (error) {
        console.error("Error while login: ", error);
        return -1;
    }
}

async function oauth(code) {
    try {
        const user = getUser();
        if (user) {
            let url = `${EBAY_API}/oauth?email=${encodeURIComponent(user.email)}`;
            console.log("Code:", code);
            if (code!==null) {
                url += `&success=True&code=${encodeURIComponent(code)}`
            }
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            });
            return response;
        }
    } catch (error) {
        console.error(error);
        return null;
    }
}

export const AUTH = {
    getUser,
    login,
    oauth
};

