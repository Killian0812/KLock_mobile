import axios from "axios";
// import * as SecureStore from 'expo-secure-store';

// const accessToken = SecureStore.getItem("ACCESS_TOKEN");

const axiosPrivate = axios.create({
    baseURL: 'https://ngcuong0812.id.vn'
});

export default axiosPrivate;

