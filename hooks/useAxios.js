import axios from "axios";
// import * as SecureStore from 'expo-secure-store';

// const accessToken = SecureStore.getItem("ACCESS_TOKEN");

const axiosPrivate = axios.create({
    baseURL: 'http://192.168.5.245:8080'
});

export default axiosPrivate;

