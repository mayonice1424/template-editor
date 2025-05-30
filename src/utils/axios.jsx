import axios from "axios";
import { Base_URL } from "./api";

export const ApiServices = axios.create({
  baseURL: Base_URL,
  headers: {
    "Content-Type": "Application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

ApiServices.defaults.timeout = 30000;
