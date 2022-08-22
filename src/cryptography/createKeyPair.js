import dotenv from 'dotenv';
dotenv.config();

import utils from '../utils/utils.js';

import crypto from "crypto";
import path from "path";
import fs from "fs";

const __dirname = utils.getFileDirectory(import.meta.url);

function generateAsymKeys() {
  const keyPair = crypto.generateKeyPair(
    "rsa",
    {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: "pkcs1",
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs8",
        format: "pem",
      },
    },
    (err, publicKey, privateKey) => {
      fs.writeFileSync(path.join(__dirname+"/publicKey.pem"), publicKey);
      fs.writeFileSync(path.join(__dirname+"/privateKey.pem"), privateKey);
    }
  );
}





export default generateAsymKeys
