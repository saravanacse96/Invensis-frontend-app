import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost/Invesis/public/api', 
});

export default instance;