import { AptosAccount } from "aptos";
import { sign_detached } from "tweetnacl-ts";

const testPrivateKey: Uint8Array = new Uint8Array([
  248, 133, 67, 25, 116, 236, 35, 129, 154, 103, 146, 251, 248, 66, 192, 210, 192, 102, 123, 161, 166, 29, 85, 242, 164,
  211, 90, 27, 217, 243, 233, 4, 58, 8, 67, 188, 136, 138, 132, 169, 9, 169, 32, 111, 249, 200, 199, 157, 180, 8, 208,
  84, 147, 76, 27, 107, 174, 152, 123, 234, 12, 253, 16, 232,
]);

const testAddress = "ca344913732e33971f77d45936d2af055ffc0d21df65134d768fdb89ea2afd78";

export const connect = (): AptosAccount => {
  return new AptosAccount(testPrivateKey, testAddress);
};

export const signMessage = (message: Uint8Array, secretKey: Uint8Array): string => {
  return Buffer.from(sign_detached(message, secretKey)).toString("hex");
};
