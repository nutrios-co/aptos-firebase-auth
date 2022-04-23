import { Request, Response } from "firebase-functions";
import { auth, db } from "../util";

export const createUserHandler = async (request: Request, response: Response): Promise<boolean> => {
  const email = request.query.email;
  const publicKey = request.query.publicKey;
  const address = request.query.address;

  if (typeof email !== "string") {
    response.status(401).json({ error: "Invalid email" });
    return false;
  }

  if (typeof publicKey !== "string") {
    response.status(401).json({ error: "Invalid public key." });
    return false;
  }

  if (typeof address !== "string") {
    response.status(401).json({ error: "Invalid address." });
    return false;
  }
  await auth.createUser({
    uid: address,
    email: email,
    emailVerified: false,
  });
  await db.collection("authorizedUsers").doc(address).set({ publicKey: publicKey });

  response.send(200);
  return true;
};
