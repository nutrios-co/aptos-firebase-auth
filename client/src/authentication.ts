import axios, { AxiosRequestConfig } from "axios";
import { auth } from "./firebaseInit";
import { signInWithCustomToken, User } from "firebase/auth";

export const getNonce = async (): Promise<string> => {
  const options: AxiosRequestConfig = {
    method: "GET",
    url: "https://us-central1-nutrios-protocol.cloudfunctions.net/getNonce",
  };

  const response = await axios.request(options).then((response) => response.data);
  return response.nonce ? response.nonce : "error";
};

export const login = async (address: string, signature: string): Promise<boolean> => {
  let result = false;
  try {
    const options: AxiosRequestConfig = {
      method: "POST",
      url: "https://us-central1-nutrios-protocol.cloudfunctions.net/login",
      //url: "http://localhost:5001/nutrios-protocol/us-central1/login",
      headers: {
        "Content-Type": "application/json",
      },
      data: { address: address, signature: signature },
    };

    const response = await axios.request(options).then((response) => response.data);

    if (response.token) {
      const userCredential = await signInWithCustomToken(auth, response.token);
      if (userCredential) {
        result = true;
      }
    }
  } catch (err) {
    console.log(err);
  }
  return result;
};

let loggedInState = false;
let currentUser: User | undefined;

export const loggedIn = (): boolean => {
  return loggedInState;
};

export const user = (): User | undefined => {
	return currentUser;
}

export const initAuth = () => {
  auth.onAuthStateChanged((user) => {
    if (user) {
      // this is where you set user state info via custom object, vuex, redux, etc
      loggedInState = true;
      console.log("Do stuff when user logs in");
	  currentUser = user;
    } else {
      console.log("Do stuff when user logs out");
      loggedInState = false;
	  currentUser = undefined;
    }
  });
};

export const createUser = async (email: string, publicKey: string, address: string): Promise<boolean> => {
  let success = false;
  try {
    const options: AxiosRequestConfig = {
      method: "GET",
      url: "https://us-central1-nutrios-protocol.cloudfunctions.net/createUser",
      params: {
        email: email,
        publicKey: publicKey,
        address: address,
      },
    };
    const response = await axios.request(options);
    if (response.status === 200) success = true;
  } catch (err) {
    console.log(err);
  }
  return success;
};
