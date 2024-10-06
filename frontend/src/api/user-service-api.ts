import axios from "axios";
import { userServiceApi } from "./constants";

const userLogin = async (
  email: string,
  password: string
): Promise<any | undefined> => {
  try {
    const response = await axios.post(`${userServiceApi}/auth/login`, {
      email: email,
      password: password,
    });

    const token = response.data.token;

    console.log("Login successful:", response.data);
    return response;
  } catch (error) {
    console.error("Error during login:", error);
  }
};

const userSignUp = async (
  username: string,
  email: string,
  password: string
): Promise<any | undefined> => {
  try {
    const response = await axios.post(`${userServiceApi}/users/`, {
      username: username,
      email: email,
      password: password,
    });

    return response;
  } catch (error) {
    console.error("Error during signup:", error);
  }
};

export { userLogin, userSignUp };
