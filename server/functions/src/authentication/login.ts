import { randomBytes } from "crypto";
import { Request, Response } from "firebase-functions";
import { sign_detached_verify } from "tweetnacl-ts";
import { auth, db } from "../util";

export const getNonceHandler = async (request: Request, response: Response): Promise<boolean> => {
  if (request.method === "GET") {
    const nonce = randomBytes(32).toString("base64");
    response.cookie("auth-nonce", nonce, { httpOnly: true, secure: true, maxAge: 300000 });
    response.status(200).json({ nonce });
	return true;
  }
  response.status(405);
  return false;
};

export const loginHandler = async (request: Request, response: Response): Promise<boolean> => {
  const cookieString = request.headers.cookie ? request.headers.cookie : "";
  const cookies = cookieParser(cookieString);
  const nonce = cookies["auth-nonce"];
  if (nonce === "") {
    response.status(401).json({ error: "Unauthorized login attempt." });
    return false;
  }
  console.log(request.cookies);
  const message = `Sign this message for authenticating with your wallet. Nonce: ${nonce}`;

  const messageBytes = new TextEncoder().encode(message);
  const address: string = request.body.address as string;

  //check authorized user here
  try {
    await auth.getUser(address);
  } catch (err) {
    response.status(401).json({ error: "Unauthorized wallet." });
    return false;
  }

  // grab related public key
  const usersRef = db.collection("authorizedUsers").doc(address);
  const doc = await usersRef.get();
  if (!doc.exists) {
    response.status(401).json({ error: "Error accessing publicKey record." });
    return false;
  }
  const data = doc.data();
  const publicKey = data ? data.publicKey : "";

  if (publicKey === "") {
    response.status(401).json({ error: "Error accessing publicKey record." });
    return false;
  }

  const signature: string = request.body.signature as string;
  const publicKeyBytes = Buffer.from(publicKey.slice(2), "hex");
  const signatureBytes = Buffer.from(signature, "hex");

  const result = sign_detached_verify(messageBytes, signatureBytes, publicKeyBytes);

  if (!result) {
    // to be added - if key has been rotated, login will be invalid
    response.status(401).json({ error: "Invalid login." });
    return false;
  } else {
    const token = await auth.createCustomToken(address);
    response.status(200).json({ token: token });
  }
  return true;
};

function cookieParser(cookieString: string): Record<string, string> {
  // Return an empty object if cookieString
  // is empty
  if (cookieString === "") return {};

  // Get each individual key-value pairs
  // from the cookie string
  // This returns a new array
  const pairs = cookieString.split(";");

  // Separate keys from values in each pair string
  // Returns a new array which looks like
  // [[key1,value1], [key2,value2], ...]
  const splittedPairs = pairs.map((cookie) => cookie.split("="));

  // Create an object with all key-value pairs
  const cookieObj = splittedPairs.reduce(function (obj: Record<string, string>, cookie) {
    // cookie[0] is the key of cookie
    // cookie[1] is the value of the cookie
    // decodeURIComponent() decodes the cookie
    // string, to handle cookies with special
    // characters, e.g. '$'.
    // string.trim() trims the blank spaces
    // auround the key and value.
    obj[decodeURIComponent(cookie[0].trim())] = decodeURIComponent(cookie[1].trim());

    return obj;
  }, {});

  return cookieObj;
}
