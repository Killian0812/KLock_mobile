import axios from "axios";
// import * as SecureStore from 'expo-secure-store';

// const accessToken = SecureStore.getItem("ACCESS_TOKEN");

const axiosPrivate = axios.create({
    baseURL: 'http://13.237.151.178'
});

export default axiosPrivate;

