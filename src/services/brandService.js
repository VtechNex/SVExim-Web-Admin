import axios from 'axios';
import { AUTH } from './authService';

const API_BASE_URL = import.meta.env.VITE_BRANDS_API;
const user = AUTH.getUser();
if (user) axios.defaults.headers.common.Authorization = `Bearer ${user.token}`

const getBrands = async () => {
  try {
    const response = await axios.get(API_BASE_URL);
    return response;
  } catch (error) {
    console.error('Error fetching brands:', error);
    return error?.response || { data: [] };
  }
};

const createBrand = async (brandData) => {
  const response = await axios.post(API_BASE_URL, brandData);
  return response.data;
};

const updateBrand = async (id, brandData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${id}`, brandData);
    return response;
  } catch (error) {
    console.error('Error updating brand:', error);
    return error.response;
  }
};

const deleteBrand = async (id) => {
  const response = await axios.delete(`${API_BASE_URL}/${id}`);
  return response.data;
};

const BRANDS = {
  GET: getBrands,
  ADD: createBrand,
  UPDATE: updateBrand,
  DELETE: deleteBrand,
};

export default BRANDS;
