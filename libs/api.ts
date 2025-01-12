import axios from "axios";
import { toast } from "react-hot-toast";
import { signIn } from "next-auth/react";
import config from "@/config";

// use this to interact with our API endpoints from the frontend
// See https://chatsa.co/docs/tutorials/api-call
const apiClient = axios.create({
  baseURL: "/api",
});

apiClient.interceptors.response.use(
  function (response) {
    return response.data;
  },
  function (error) {
    let message = "";

    if (error.response?.status === 401) {
      // User not authenticated
      toast.error("Please login to access your chatbot settings");
      return signIn(undefined, { callbackUrl: config.auth.callbackUrl });
    } else if (error.response?.status === 403) {
      // User not authorized - needs subscription
      message = "Please upgrade your plan to access this chatbot feature";
    } else {
      message =
        error?.response?.data?.error || error.message || error.toString();
    }

    error.message =
      typeof message === "string" ? message : JSON.stringify(message);

    console.error(error.message);

    // Display user-friendly error messages
    if (error.message) {
      toast.error(error.message);
    } else {
      toast.error("Something went wrong with your chatbot request");
    }
    return Promise.reject(error);
  }
);

export default apiClient;
