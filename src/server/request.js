import axios from "axios";

const request = axios.create({
    baseURL: 'https://64b2f06c38e74e386d55bed8.mockapi.io',
    timeout: 10000
})

export default request;