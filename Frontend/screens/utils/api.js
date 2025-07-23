const BASE_URL = 'http://192.168.0.2:5000/api/auth';
await axios.post(`${BASE_URL}/register`, data);


export default BASE_URL;
