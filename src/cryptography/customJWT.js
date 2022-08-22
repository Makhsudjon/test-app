import utils from '../utils/utils.js';


import base64url from "base64url";
import crypto from "crypto";
import fs from "fs";
import path from 'path';
import moment from "moment";

const __dirname = utils.getFileDirectory(import.meta.url);

const sign = crypto.createSign("RSA-SHA256");
const verify = crypto.createVerify("RSA-SHA256");

function isExpiredToken(expireTime) {
  const now = moment();
  const isExpired = moment(expireTime).isAfter(now, 's');
  return isExpired;
}

function createJWT(payload, time) {
  const privateKey = fs.readFileSync(
    path.join(__dirname, "privateKey.pem"),
    "utf8"
  );

  const expTime = moment().add(time, "s");
  const header = {
    alg: "rs256",
    type: "customJWT",
    expTime,
  };

  const base64UrlHeader = base64url(JSON.stringify(header));
  const base64UrlPayload = base64url(JSON.stringify(payload));

  sign.write(base64UrlHeader + "." + base64UrlPayload);
  sign.end();

  const base64Signature = sign.sign(privateKey, "base64");

  const base64urlSignature = base64url.fromBase64(base64Signature);

  const signedData =  base64UrlHeader + "." + base64UrlPayload + "." + base64urlSignature;

  return signedData;
}

function verifyJWT(token) {
  const publicKey = fs.readFileSync(
    path.join(__dirname, "/publicKey.pem"),
    "utf8"
  );
  const tokenParts = token.split(".");

  const tokenHeader = tokenParts[0];
  const tokenPayload = tokenParts[1];
  const tokenSignature = tokenParts[2];

  const decodedTokenHeader = base64url.decode(tokenHeader);
  const decodedTokenPayload = base64url.decode(tokenPayload);

  const tokenHeaderObject = JSON.parse(decodedTokenHeader);
  const tokenPayloadObject = JSON.parse(decodedTokenPayload);

  verify.write(tokenHeader + "." + tokenPayload);
  verify.end();

  const base64Signature = base64url.toBase64(tokenSignature);

  const isExpired = isExpiredToken(tokenHeaderObject.expTime);
  
  const isValid = verify.verify(publicKey, base64Signature, "base64");

  if (isExpired || isValid === false) {
    return undefined;
  }

  return tokenPayloadObject;
}

export default {
  sign: createJWT,
  verify: verifyJWT,
};
