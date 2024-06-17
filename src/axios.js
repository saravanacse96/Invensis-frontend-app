import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost/Invesis/public/api', // replace with your backend URL
});

export default instance;