import { connect, signMessage } from "./aptosStubWallet";
import { createUser, getNonce, login } from "./authentication";
import { TextEncoder } from "util";

const aptosWallet = connect();

const signUp = async (email: string) => {
  const success = await createUser(email, aptosWallet.pubKey().hex(), aptosWallet.address().hex());
  if (success) {
    console.log("User sucessfully signed up.");
  } else {
    console.log("Uh oh. something didn't work");
  }
};

const clientLogin = async () => {
  const nonce = await getNonce();
  const stubMessage = "Sign this message for authenticating with your wallet. Nonce: " + nonce;

  const encodedMessage = new TextEncoder().encode(stubMessage);

  const signedMessage = signMessage(encodedMessage, aptosWallet.signingKey.secretKey);
  const loginSuccess = await login(aptosWallet.address().hex(), signedMessage);

  if (loginSuccess) {
    console.log("User is logged in and auth.on will be called");
  } else {
    console.log("Invalid login");
  }
};

signUp("wayne@test.com");

clientLogin();
