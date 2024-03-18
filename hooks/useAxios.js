import axios from "axios";
// import * as SecureStore from 'expo-secure-store';

// const accessToken = SecureStore.getItem("ACCESS_TOKEN");

const axiosPrivate = axios.create({
    baseURL: 'http://192.168.1.10:8080/',
    // headers: { 'Authorization': `Bearer ${accessToken}` }
});

export default axiosPrivate;

