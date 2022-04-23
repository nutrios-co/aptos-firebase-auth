import { https, Request, Response } from "firebase-functions";
import { getNonceHandler, loginHandler } from "./login";
import { createUserHandler } from "./signup";

export const getNonce = https.onRequest(async (request: Request, response: Response) => {
  await getNonceHandler(request, response);
});

export const login = https.onRequest(async (request: Request, response: Response) => {
  await loginHandler(request, response);
});

export const createUser = https.onRequest(async (request: Request, response: Response) => {
  await createUserHandler(request, response);
});
