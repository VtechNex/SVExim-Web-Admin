import axios from 'axios';
import { AUTH } from "./authService";

const API_URL = import.meta.env.VITE_USERS_API;
const user = AUTH.getUser();
if (user) axios.defaults.headers.common.Authorization = `Bearer ${user.token}`
// Function to fetch all users
const fetchUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}`);
    return response;
  } catch (error) {
    console.error('Error fetching users:', error);
    return error.response;
  }
};

// Function to create a new user
const createUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}`, userData);
    return response;
  } catch (error) {
    console.error('Error creating user:', error);
    return error.response;
  }
};

// Function to update an existing user
const updateUser = async (userId, userData) => {
  try {
    const response = await axios.put(`${API_URL}/${userId}`, userData);
    return response;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

// Function to delete a user
const deleteUser = async (userId) => {
  try {
    const response = await axios.delete(`${API_URL}/${userId}`);
    return response;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

const USERS = {
  GET: fetchUsers,
  ADD: createUser,
  UPDATE: updateUser,
  DELETE: deleteUser,
};

export default USERS;
