import { AxiosRequestConfig } from "axios";
import axios from "@/utils/axios.config";

export default async function request(options: AxiosRequestConfig) {
    try {
        const result = await axios.request(options);
        return result;
    } catch (error) {
        return Promise.reject(error);
    }
}
