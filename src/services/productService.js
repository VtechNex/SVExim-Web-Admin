import axios from 'axios';
import { AUTH } from './authService';


const BASE_URL = import.meta.env.VITE_PRODUCTS_API;
const token = AUTH.getUser()?.token;

if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

async function fetchProducts() {
    try {
        const response = await axios.get(BASE_URL,
            { headers: { 'Content-Type': 'application/json' } }
        );
        return response;
    } catch (error) {
        console.error("Error while fetching products: ", error);
        return error.response;
    }
}

async function getById(id) {
    try {
        const response = await axios.get(`${BASE_URL}/${id}`);
        return response;
    } catch (error) {
        console.error('Error fetching product', error);
        return error.response;
    }
}

async function addProduct(product) {
    try {
        const response = await axios.post(`${BASE_URL}/add`, product);
        return response;
    } catch (error) {
        console.error("Error while adding product: ", error);
        return null;
    }
}

async function updateProduct(id, product) {
  try {
    // remove 'id' field before sending
    const { id: _, ...cleanProduct } = product;

    const response = await axios.put(`${BASE_URL}/${id}`, cleanProduct);
    return response;
  } catch (error) {
    console.error("Error while updating product: ", error);
    return null;
  }
}


async function deleteProduct(id) {
    try {
        const response = await axios.delete(`${BASE_URL}/${id}`);
        return response;
    } catch (error) {
        console.error("Error while deleting product: ", error);
        return null;
    }
}

export const PRODUCTS = {
    GET: fetchProducts,
    GET_ID: getById,
    ADD: addProduct,
    UPDATE: updateProduct,
    DELETE: deleteProduct,
};
