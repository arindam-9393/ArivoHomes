import axios from 'axios';

// This automatically detects if you are on Vercel or localhost
const baseURL = import.meta.env.PROD 
  ? "https://arivohomes.onrender.com" // Your Render link
  : "http://localhost:3000";         // Your local backend port

const API = axios.create({
  baseURL,
  withCredentials: true, 
});

export default API;