import axios, { AxiosInstance } from "axios";

const instance: AxiosInstance = axios.create({
  baseURL: "https://peerprep-questions.as.r.appspot.com",
});

export default instance;
