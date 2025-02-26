import axios from "axios";

const axiosInstance =axios.create({
    baseURL: import.meta.env.MODE=="development"? "http://localhost:5001/api":"/api",//The import.meta.env.MODE property in your code is used to determine the mode in which your Vite project is running.
    withCredentials:true
})

export default axiosInstance