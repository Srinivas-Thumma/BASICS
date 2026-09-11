import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, //Automatically prefixes all your requests with your server's backend URL. the one stored in .env
  withCredentials: true,
  headers: { //Tells the backend server that the payload format you are sending in the body of POST, PUT, or PATCH requests is JSON.
    "Content-Type": "application/json",
  },
});

export default api;